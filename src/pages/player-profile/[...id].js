import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const PlayerProfileEdit = dynamic(import('@/components/PlayerProfile/PlayerProfileEdit'));

function DefaultPage() {
  const router = useRouter();
  const id = router.query.id;
  return (
    <>
      <PlayerProfileEdit id={id?.[0]} />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
