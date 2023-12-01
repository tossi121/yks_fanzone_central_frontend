import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const PressRelease = dynamic(import('@/components/PressRelease/PressRelease'));

function DefaultPage() {
  const router = useRouter();
  const token = Cookies.get('yks_fanzone_central_permissions');
  const tokenValues = token?.split(',');

  useEffect(() => {
    if (!tokenValues.includes('manage_press_release')) {
      router.push('/');
    }
  }, [router]);

  return <PressRelease />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
