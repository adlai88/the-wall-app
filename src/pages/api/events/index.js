import { supabase } from '../../../lib/supabase'

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
        .from('events')
        .select('*')
        .eq('moderation_status', 'approved')
        .eq('status', 'active')
      
      if (error) throw error
      return res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching events:', error)
      return res.status(500).json({ error: 'Error fetching events' })
    }
  }

  if (req.method === 'POST') {
    try {
      const eventData = req.body
      let posterUrl = null

      if (eventData.poster) {
        const fileName = `${Date.now()}-${eventData.poster.name}`
        const { data: fileData, error: fileError } = await supabase.storage
          .from('event-posters')
          .upload(fileName, eventData.poster)
        
        if (fileError) throw fileError
        
        const { data: { publicUrl } } = supabase.storage
          .from('event-posters')
          .getPublicUrl(fileName)
        
        posterUrl = publicUrl
      }

      const coordinates = Array.isArray(eventData.coordinates) 
        ? `(${eventData.coordinates[0]},${eventData.coordinates[1]})`
        : null

      if (!coordinates) {
        throw new Error('Invalid coordinates format')
      }

      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: eventData.title,
          date: eventData.date,
          time: eventData.time,
          end_date: eventData.endDate,
          end_time: eventData.endTime,
          location: eventData.location,
          coordinates: coordinates,
          category: eventData.category,
          description: eventData.description,
          poster: posterUrl,
          status: 'active',
          moderation_status: 'pending'
        }])
        .select()
        .single()

      if (error) throw error
      return res.status(201).json(data)
    } catch (error) {
      console.error('Error submitting event:', error)
      return res.status(500).json({ error: error.message || 'Error submitting event' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
} 