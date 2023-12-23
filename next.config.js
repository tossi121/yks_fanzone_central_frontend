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
    BASE_API_URL: 'http://192.168.1.46:7012/',
    IMAGE_BASE: 'https://yks-contents.s3.ap-south-1.amazonaws.com/',
    TINYMCE_API_KEY: 'zmrizzmd4j65mm6bn8p7t5pj5wbcbboia2x7ggmezulk3thg',
    YOUTUBE_API_KEY: 'AIzaSyD9RSUKhdwSpXcOapnhC1sL-eWn0z9nNIw',
    LOGIN_DATA: 'login',

    // Press Releases
    PRESS_RELEASES_DATA: 'admin/pressreleases',
    PRESS_RELEASES_ADD_DATA: 'admin/addpressreleases',
    PRESS_RELEASES_DELETE_DATA: 'admin/deletepressrelease',
    PRESS_RELEASES_UPLOAD_FILE_DATA: 'admin/uploadfiles',
    TOURNAMENT_LIST_DATA: 'admin/getAllNamesAndIds',

    // Gallery
    GALLERY_DATA: 'admin/galleries',
    GALLERY_DELETE_DATA: 'admin/galleriesDelete',
    GALLERY_UPDATE_DATA: 'admin/galleriesUpdate',

    // Player Profile
    PLAYER_PROFILE_DATA: 'admin/playerprofiles',

    // UserAccess
    USER_ACCESS_DATA: 'admin/getallusers',
    USER_ACCESS_PERMISSIONS_DATA: 'admin/permissions',
    USER_ACCESS_ADD_PERMISSIONS_DATA: 'admin/addnewuser',
    USER_ACCESS_DELETE_PERMISSIONS_DATA: 'admin/deleteuser',
    USER_ACCESS_CURRENT_PERMISSIONS_DATA: 'admin/getusers',
    USER_ACCESS_UPDATE_PERMISSIONS_DATA: 'admin/updateuser',

    // allteams
    TEAM_DATA: 'admin/allteams',

    // matches
    MATCH_DATA: 'admin/matches',

    // photoTaggings
    PHOTO_TAGGINGS_DATA: 'admin/photoTaggings',
    PHOTO_TAGGINGS_ADD_DATA: 'admin/photoTagging',
    PHOTO_TAGGINGS_DELETE_DATA: 'admin/photoTaggingDelete',
    PHOTO_TAGGINGS_UPDATE_DATA: 'admin/photoTaggingUpdate',

    // articles
    ARTICLES_DATA: 'admin/articles',
    ARTICLES_DELETE_DATA: 'admin/articlesDelete',
    ARTICLES_UPDATE_DATA: 'admin/articlesUpdate',
    
    //videoTagging
    VIDEO_TAGGINGS_DATA: 'admin/videoTaggings',
    VIDEO_TAGGINGS_ADD_DATA: 'admin/videoTagging',
    VIDEO_TAGGINGS_DELETE_DATA: 'admin/videoTaggingsDelete',
    VIDEO_TAGGINGS_UPDATE_DATA: 'admin/videoTaggingsUpdate',
  },
};

module.exports = nextConfig;
