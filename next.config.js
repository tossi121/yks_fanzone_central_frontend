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
    IMAGE_BASE: 'https://d1zoo736173x95.cloudfront.net/',
    LOGIN_DATA: 'login',
    // Press Releases
    PRESS_RELEASES_DATA: 'admin/pressreleases',
    PRESS_RELEASES_ADD_DATA: 'admin/addpressreleases',
    PRESS_RELEASES_DELETE_DATA: 'admin/deletepressrelease',
    PRESS_RELEASES_UPLOAD_FILE_DATA: 'admin/uploadfiles',
    TOURNAMENT_LIST_DATA: 'admin/getAllNamesAndIds',

    // Gallery
    GALLERY_DATA: 'admin/getallgalleries',
    GALLERY_ADD_DATA: 'admin/addgallery',
    GALLERY_DELETE_DATA: 'admin/deletegallery',
  },
};

module.exports = nextConfig;
