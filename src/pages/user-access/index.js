import React from 'react';
import dynamic from 'next/dynamic';

const UserAccess = dynamic(import('@/components/UserAccess/UserAccess'));

function DefaultPage() {
  // return <UserAccess />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
