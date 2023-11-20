import React from 'react';
import dynamic from 'next/dynamic';

const Gallery = dynamic(import('@/components/Gallery'));

function DefaultPage() {
  return <Gallery />;
}

DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
