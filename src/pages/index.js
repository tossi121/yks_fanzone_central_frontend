import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const routeMapping = {
  manage_press_release: '/press-release',
  manage_gallery: '/gallery',
  manage_player_profile: '/player-profile',
  create_user: '/user-access',
  manage_articles: '/articles',
  manage_photoTagging: '/photo-tagging',
  manage_videoTagging: '/video-tagging',
};

export default function Home() {
  const router = useRouter();
  const token = Cookies.get('yks_fanzone_central_permissions');
  const tokenValues = token?.split(',');

  useEffect(() => {
    const hasPermission = (key) => tokenValues?.some((value) => value.includes(key));

    for (const key of Object.keys(routeMapping)) {
      if (hasPermission(key)) {
        router.push(routeMapping[key]);
        break;
      }
    }
  }, [tokenValues, router]);

  return <></>;
}
