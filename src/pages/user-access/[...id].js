import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const UserAccessEdit = dynamic(import('@/components/UserAccess/UserAccessEdit'));

function DefaultPage() {
  const token = Cookies.get('yks_fanzone_central_permissions');
  const tokenValues = token?.split(',');
  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    if (!tokenValues.includes('create_user')) {
      router.push('/');
    }
  }, [router]);

  return <UserAccessEdit id={id?.[0]} />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
