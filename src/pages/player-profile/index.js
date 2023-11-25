import React from 'react';
import dynamic from 'next/dynamic';

const PlayerProfile = dynamic(import('@/components/PlayerProfile/PlayerProfile'));

function DefaultPage() {
  return <PlayerProfile />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
