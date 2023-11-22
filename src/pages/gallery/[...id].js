import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const GalleryEdit = dynamic(import('@/components/Gallery/GalleryEdit'));

function DefaultPage() {
  const router = useRouter();
  const id = router.query.id;
  return (
    <>
      <GalleryEdit id={id?.[0]} />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
