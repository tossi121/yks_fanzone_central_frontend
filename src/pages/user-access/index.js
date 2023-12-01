import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const UserAccess = dynamic(import('@/components/UserAccess/UserAccess'));

function DefaultPage() {
  const router = useRouter();
  const token = Cookies.get('yks_fanzone_central_permissions');
  const tokenValues = token?.split(',');

  useEffect(() => {
    if (!tokenValues.includes('create_user')) {
      router.push('/');
    }
  }, [router]);

  return <UserAccess />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
