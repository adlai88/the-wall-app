import { events, pendingEvents, rejectedEvents } from '../../../data/events';

export default function handler(req, res) {
  const { method } = req;
  const { action, id } = req.query;

  if (method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const eventId = parseInt(id);
  const eventIndex = pendingEvents.findIndex(e => e.id === eventId);

  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const event = pendingEvents[eventIndex];

  switch (action) {
    case 'approve':
      const approvedEvent = { ...event, status: 'approved' };
      events.push(approvedEvent);
      pendingEvents.splice(eventIndex, 1);
      res.status(200).json(approvedEvent);
      break;

    case 'reject':
      const rejectedEvent = { ...event, status: 'rejected' };
      rejectedEvents.push(rejectedEvent);
      pendingEvents.splice(eventIndex, 1);
      res.status(200).json(rejectedEvent);
      break;

    default:
      res.status(400).json({ message: 'Invalid action' });
  }
} 