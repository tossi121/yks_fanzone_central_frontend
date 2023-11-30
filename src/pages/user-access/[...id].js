import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const UserAccessEdit = dynamic(import('@/components/UserAccess/UserAccessEdit'));

function DefaultPage() {
  const router = useRouter();
  const id = router.query.id;
  return (
    <>
      <UserAccessEdit id={id?.[0]} />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
