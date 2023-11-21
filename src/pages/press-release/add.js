import React from 'react';
import dynamic from 'next/dynamic';

const PressReleaseAdd = dynamic(import('@/components/PressRelease/PressReleaseAdd'));

function DefaultPage() {
  return <PressReleaseAdd />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
