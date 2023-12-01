import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const UserAccessAdd = dynamic(import('@/components/UserAccess/UserAccessAdd'));

function DefaultPage() {
  const token = Cookies.get('yks_fanzone_central_permissions');
  const tokenValues = token?.split(',');
  const router = useRouter();

  useEffect(() => {
    if (!tokenValues.includes('create_user')) {
      router.push('/');
    }
  }, [router]);

  return <UserAccessAdd />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
