import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const getEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'approved');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw error;
  }
};

export const submitEvent = async (eventData) => {
  try {
    // First upload the image to Supabase Storage
    let posterUrl = null;
    if (eventData.poster instanceof File) {
      const fileName = `${Date.now()}-${eventData.poster.name}`;
      const { data: fileData, error: fileError } = await supabase.storage
        .from('event-posters')
        .upload(fileName, eventData.poster);
      
      if (fileError) throw fileError;
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('event-posters')
        .getPublicUrl(fileName);
      
      posterUrl = publicUrl;
    }

    // Then create the event record
    const { data, error } = await supabase
      .from('events')
      .insert([{
        title: eventData.title,
        date: eventData.date,
        time: eventData.time,
        end_date: eventData.endDate,
        end_time: eventData.endTime,
        location: eventData.location,
        coordinates: `(${eventData.coordinates[0]},${eventData.coordinates[1]})`,
        category: eventData.category,
        description: eventData.description,
        poster: posterUrl,
        status: 'active'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting event:', error);
    throw error;
  }
};

// Admin functions
export const getPendingEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'pending');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching pending events:', error);
    throw error;
  }
};

export const getApprovedEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'approved');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching approved events:', error);
    throw error;
  }
};

export const getRejectedEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'rejected');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching rejected events:', error);
    throw error;
  }
};

export const approveEvent = async (id) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({ status: 'approved' })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error approving event with id ${id}:`, error);
    throw error;
  }
};

export const rejectEvent = async (id) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({ status: 'rejected' })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error rejecting event with id ${id}:`, error);
    throw error;
  }
};
