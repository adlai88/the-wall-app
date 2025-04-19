import { useRouter } from 'next/router';
import EventDetailView from '../../components/EventDetailView';

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;

  return <EventDetailView eventId={id} />;
} 