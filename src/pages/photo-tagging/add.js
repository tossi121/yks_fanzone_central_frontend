import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const PhotoTaggingAdd = dynamic(import('@/components/PhotoTagging/PhotoTaggingAdd'));

function DefaultPage() {
  const router = useRouter();
  const token = Cookies.get('yks_fanzone_central_permissions');
  const tokenValues = token?.split(',');

  useEffect(() => {
    if (!tokenValues.includes('manage_photoTagging')) {
      router.push('/');
    }
  }, [router]);

  return <PhotoTaggingAdd />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
