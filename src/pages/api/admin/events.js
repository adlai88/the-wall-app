import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  // Basic authentication check - in production, use proper auth
  const authHeader = req.headers.authorization
  if (!authHeader || authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const { status } = req.query
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('moderation_status', status || 'pending')
      
      if (error) throw error
      return res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching events:', error)
      return res.status(500).json({ error: 'Error fetching events' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, action } = req.body
      
      if (!id || !action) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const moderation_status = action === 'approve' ? 'approved' : 'rejected'
      const { data, error } = await supabase
        .from('events')
        .update({ moderation_status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return res.status(200).json(data)
    } catch (error) {
      console.error('Error updating event status:', error)
      return res.status(500).json({ error: 'Error updating event status' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
} 