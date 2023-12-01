import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const PressReleaseEdit = dynamic(import('@/components/PressRelease/PressReleaseEdit'));

function DefaultPage() {
  const router = useRouter();
  const token = Cookies.get('yks_fanzone_central_permissions');
  const tokenValues = token?.split(',');

  useEffect(() => {
    if (!tokenValues.includes('manage_press_release')) {
      router.push('/');
    }
  }, [router]);

  return <PressReleaseEdit id={id?.[0]} />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
