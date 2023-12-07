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
    IMAGE_BASE: 'https://test',
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

    // Player Profile
    PLAYER_PROFILE_DATA: 'admin/playerprofiles',

    // UserAccess
    USER_ACCESS_DATA: 'admin/getallusers',
    USER_ACCESS_PERMISSIONS_DATA: 'admin/permissions',
    USER_ACCESS_ADD_PERMISSIONS_DATA: 'admin/addnewuser',
    USER_ACCESS_DELETE_PERMISSIONS_DATA: 'admin/deleteuser',
    USER_ACCESS_CURRENT_PERMISSIONS_DATA: 'admin/getusers',
    USER_ACCESS_UPDATE_PERMISSIONS_DATA: 'admin/updateuser',
  },
};

module.exports = nextConfig;
