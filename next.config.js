/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    BASE_API_URL: 'http://localhost:7012/',
    IMAGE_BASE: 'https://new-bucket-3b724d30.s3.amazonaws.com/',
    LOGIN_DATA: 'login',
    PRESS_RELEASES_DATA: 'admin/pressreleases',
    PRESS_RELEASES_ADD_DATA: 'admin/addpressreleases',
    PRESS_RELEASES_DELETE_DATA: 'admin/deletepressrelease',
    PRESS_RELEASES_UPLOAD_FILE_DATA: 'admin/uploadfiles',
    TOURNAMENT_LIST_DATA: 'admin/getAllNamesAndIds',
  },
};

module.exports = nextConfig;
