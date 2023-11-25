import React from 'react';
import dynamic from 'next/dynamic';

const UserAccessAdd = dynamic(import('@/components/UserAccess/UserAccessAdd'));

function DefaultPage() {
  return <UserAccessAdd />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
