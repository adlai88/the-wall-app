import { useRouter } from 'next/router';
import PosterView from '../../components/PosterView';

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;

  return <PosterView eventId={id} />;
} 