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
      console.log('Fetching posters from Supabase...');
      
      // First, get all posters without date filter to check if we have any data
      const { data: allPosters, error: countError } = await supabase
        .from('posters')
        .select('*')
        .eq('moderation_status', 'approved')
        .eq('hidden', false)
        .eq('status', 'active');
      
      if (countError) {
        console.error('Error fetching all posters:', countError);
        throw countError;
      }
      
      console.log(`Found ${allPosters?.length || 0} total approved posters`);

      // Now get the filtered posters
      const { data, error } = await supabase
        .from('posters')
        .select('*')
        .eq('moderation_status', 'approved')
        .eq('hidden', false)
        .eq('status', 'active')
        .gt('display_until', new Date().toISOString());
      
      if (error) {
        console.error('Error fetching filtered posters:', error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} active posters after date filter`);
      
      // Log some debug info about the date filter
      if (data?.length === 0 && allPosters?.length > 0) {
        console.log('Date filter removed all posters. Current time:', new Date().toISOString());
        console.log('Sample poster display_until dates:', 
          allPosters.slice(0, 3).map(p => p.display_until)
        );
      }
      
      return res.status(200).json(data || []);
    } catch (error) {
      console.error('Error in /api/posters:', error);
      // Return empty array instead of error to prevent client-side crashes
      return res.status(200).json([]);
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
        let base64Data = posterData.poster_image.data;
        if (base64Data.includes(',')) {
          base64Data = base64Data.split(',')[1];
        }
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
          moderation_status: 'pending',
          event_start_date: posterData.event_start_date || null,
          event_end_date: posterData.event_end_date || null,
          link: posterData.link || null
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