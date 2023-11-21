import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const PressReleaseEdit = dynamic(import('@/components/PressRelease/PressReleaseEdit'));

function DefaultPage() {
  const router = useRouter();
  const id = router.query.id;
  return (
    <>
      <PressReleaseEdit id={id?.[0]} />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
