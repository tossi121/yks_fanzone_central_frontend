import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const VideoTaggingEdit = dynamic(import('@/components/VideoTagging/VideoTaggingEdit'));

function DefaultPage() {
  const router = useRouter();
  const token = Cookies.get('yks_fanzone_central_permissions');
  const tokenValues = token?.split(',');
  const id = router.query.id;

  useEffect(() => {
    if (!tokenValues.includes('manage_videoTagging')) {
      router.push('/');
    }
  }, [router]);

  return <VideoTaggingEdit id={id?.[0]} />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
