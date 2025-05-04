import { supabase } from '../../../lib/supabase';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('posters')
        .select('*')
        .eq('moderation_status', 'approved')
        .eq('hidden', false)
        .eq('status', 'active')
        .gt('display_until', new Date().toISOString()) // Only show posters that are still meant to be displayed
      
      if (error) throw error;
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching posters:', error);
      return res.status(500).json({ error: 'Error fetching posters' });
    }
  }

  if (req.method === 'POST') {
    try {
      // Debug log: print the full payload
      console.error('POST /api/posters payload:', JSON.stringify(req.body, null, 2));
      const posterData = req.body;

      // Validate required fields based on database schema
      const requiredFields = ['coordinates', 'category', 'display_until'];
      const missingFields = requiredFields.filter(field => !posterData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: 'Missing required fields', 
          missingFields: missingFields 
        });
      }

      let posterImageUrl = null;

      // Handle base64 image if provided
      if (posterData.poster_image?.data) {
        // Remove the data:image/xyz;base64, prefix
        const base64Data = posterData.poster_image.data.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        
        const fileName = `${Date.now()}-${posterData.poster_image.name}`;
        const { data: fileData, error: fileError } = await supabase.storage
          .from('poster-images')
          .upload(fileName, buffer, {
            contentType: posterData.poster_image.type
          });

        if (fileError) {
          console.error('File upload error:', fileError);
          throw new Error('Failed to upload image');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('poster-images')
          .getPublicUrl(fileName);

        posterImageUrl = publicUrl;
      }

      // Insert the poster data
      const { data, error } = await supabase
        .from('posters')
        .insert([{
          title: posterData.title || null,
          description: posterData.description || null,
          location: posterData.location || null,
          coordinates: posterData.coordinates,
          category: posterData.category,
          display_until: posterData.display_until,
          poster_image: posterImageUrl,
          status: 'active',
          hidden: false,
          moderation_status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw new Error('Failed to save poster data');
      }
      
      return res.status(201).json(data);
    } catch (error) {
      console.error('Error submitting poster:', error);
      return res.status(500).json({ error: error.message || 'Error submitting poster' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 