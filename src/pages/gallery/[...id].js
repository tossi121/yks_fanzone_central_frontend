import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const GalleryEdit = dynamic(import('@/components/Gallery/GalleryEdit'));

function DefaultPage() {
  const router = useRouter();
  const token = Cookies.get('yks_fanzone_central_permissions');
  const tokenValues = token?.split(',');
  const id = router.query.id;

  useEffect(() => {
    if (!tokenValues.includes('manage_gallery')) {
      router.push('/');
    }
  }, [router]);

  return <GalleryEdit id={id?.[0]} />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
