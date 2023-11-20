import React from 'react';
import dynamic from 'next/dynamic';

const PressRelease = dynamic(import('@/components/PressRelease'));

function DefaultPage() {
  return <PressRelease />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
