import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const PlayerProfile = dynamic(import('@/components/PlayerProfile/PlayerProfile'));

function DefaultPage() {
  const router = useRouter();
  const token = Cookies.get('yks_fanzone_central_permissions');
  const tokenValues = token?.split(',');

  useEffect(() => {
    if (!tokenValues.includes('manage_player_profile')) {
      router.push('/');
    }
  }, [router]);

  return <PlayerProfile />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
