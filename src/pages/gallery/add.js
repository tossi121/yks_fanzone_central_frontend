import React from 'react';
import dynamic from 'next/dynamic';

const GalleryAdd = dynamic(import('@/components/Gallery/GalleryAdd'));

function DefaultPage() {
  return <GalleryAdd />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
