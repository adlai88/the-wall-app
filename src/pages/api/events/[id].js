import { events } from '../../../data/events';

export default function handler(req, res) {
  const { id } = req.query;
  const eventId = parseInt(id);
  
  const event = events.find(e => e.id === eventId);
  
  if (event) {
    res.status(200).json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
} 