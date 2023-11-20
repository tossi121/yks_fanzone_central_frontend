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
    BASE_API_URL: 'http://localhost:7011/',
    LOGIN_DATA: 'login',
    PRESS_RELEASES_LIST_DATA: 'admin/pressreleases',
    PRESS_RELEASES_ADD_DATA: 'admin/addpressreleases',
    PRESS_RELEASES_UPDATE_DATA: 'admin/pressreleases',
    PRESS_RELEASES_DELETE_DATA: 'admin/deletepressrelease',
  },
};

module.exports = nextConfig;
