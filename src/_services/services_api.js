import { fetcher } from '@/_helper/apiBase';

export async function getLogin(params) {
  try {
    const response = await fetcher('POST', process.env.LOGIN_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

// Press Releases
export async function geTournamentList(params) {
  try {
    const response = await fetcher('GET', process.env.TOURNAMENT_LIST_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function getPressReleasesList(params) {
  try {
    const response = await fetcher('GET', process.env.PRESS_RELEASES_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function addPressRelease(params) {
  try {
    const response = await fetcher('POST', process.env.PRESS_RELEASES_ADD_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function currentPressRelease(id) {
  try {
    const url = `${process.env.PRESS_RELEASES_DATA}/${id}`;
    const response = await fetcher('GET', url);
    return response;
  } catch (err) {
    return null;
  }
}

export async function deletePressRelease(params) {
  try {
    const response = await fetcher('POST', process.env.PRESS_RELEASES_DELETE_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function updatePressRelease(id, params) {
  try {
    const url = `${process.env.PRESS_RELEASES_DATA}/${id}`;
    const response = await fetcher('POST', url, params);
    return response;
  } catch (err) {
    return null;
  }
}

// Gallery
export async function getGalleryList(params) {
  try {
    const response = await fetcher('GET', process.env.GALLERY_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function addGallery(params) {
  try {
    const response = await fetcher('POST', process.env.GALLERY_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function currentGallery(id) {
  try {
    const url = `${process.env.GALLERY_DATA}/${id}`;
    const response = await fetcher('GET', url);
    return response;
  } catch (err) {
    return null;
  }
}

export async function deleteGallery(params) {
  try {
    const response = await fetcher('POST', process.env.GALLERY_DELETE_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function updateGallery(id, params) {
  try {
    const url = `${process.env.GALLERY_UPDATE_DATA}/${id}`;
    const response = await fetcher('POST', url, params);
    return response;
  } catch (err) {
    return null;
  }
}

// Player Profile
export async function getPlayerProfileList(params) {
  try {
    const response = await fetcher('GET', process.env.PLAYER_PROFILE_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function currentPlayerProfile(id) {
  try {
    const url = `${process.env.PLAYER_PROFILE_DATA}/${id}`;
    const response = await fetcher('GET', url);
    return response;
  } catch (err) {
    return null;
  }
}

export async function updatePlayerProfile(id, params) {
  try {
    const url = `${process.env.PLAYER_PROFILE_DATA}/${id}`;
    const response = await fetcher('POST', url, params);
    return response;
  } catch (err) {
    return null;
  }
}

// User Access
export async function getUserAccessList(params) {
  try {
    const response = await fetcher('GET', process.env.USER_ACCESS_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function getUserAccessPermissions(params) {
  try {
    const response = await fetcher('GET', process.env.USER_ACCESS_PERMISSIONS_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function addUserAccessPermissions(params) {
  try {
    const response = await fetcher('POST', process.env.USER_ACCESS_ADD_PERMISSIONS_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function deleteUserAccessPermission(id) {
  try {
    const url = `${process.env.USER_ACCESS_DELETE_PERMISSIONS_DATA}/${id}`;
    const response = await fetcher('POST', url);
    return response;
  } catch (err) {
    return null;
  }
}

export async function currentUserAccessPermission(id) {
  try {
    const url = `${process.env.USER_ACCESS_CURRENT_PERMISSIONS_DATA}/${id}`;
    const response = await fetcher('GET', url);
    return response;
  } catch (err) {
    return null;
  }
}

export async function updateUserAccessPermissions(params) {
  try {
    const response = await fetcher('POST', process.env.USER_ACCESS_UPDATE_PERMISSIONS_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function getTeamList(params) {
  try {
    const response = await fetcher('GET', process.env.TEAM_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function getMatchList(params) {
  try {
    const response = await fetcher('GET', process.env.MATCH_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

// photoTaggings

export async function getPhotoTaggingsList(params) {
  try {
    const response = await fetcher('GET', process.env.PHOTO_TAGGINGS_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function currentPhotoTagging(id) {
  try {
    const url = `${process.env.PHOTO_TAGGINGS_DATA}/${id}`;
    const response = await fetcher('GET', url);
    return response;
  } catch (err) {
    return null;
  }
}

export async function addPhotoTaggings(params) {
  try {
    const response = await fetcher('POST', process.env.PHOTO_TAGGINGS_ADD_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function deletePhotoTaggings(params) {
  try {
    const response = await fetcher('POST', process.env.PHOTO_TAGGINGS_DELETE_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function updatePhotoTagging(id, params) {
  try {
    const url = `${process.env.PHOTO_TAGGINGS_UPDATE_DATA}/${id}`;
    const response = await fetcher('POST', url, params);
    return response;
  } catch (err) {
    return null;
  }
}
// Articles
export async function getArticlesList(params) {
  try {
    const response = await fetcher('GET', process.env.ARTICLES_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function addArticles(params) {
  try {
    const response = await fetcher('POST', process.env.ARTICLES_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function deleteArticles(params) {
  try {
    const response = await fetcher('POST', process.env.ARTICLES_DELETE_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function currentArticles(id) {
  try {
    const url = `${process.env.ARTICLES_DATA}/${id}`;
    const response = await fetcher('GET', url);
    return response;
  } catch (err) {
    return null;
  }
}

export async function updateArticles(id, params) {
  try {
    const url = `${process.env.ARTICLES_UPDATE_DATA}/${id}`;
    const response = await fetcher('POST', url, params);
    return response;
  } catch (err) {
    return null;
  }
}

// Video Tagging
export async function getVideoTaggingsList(params) {
  try {
    const response = await fetcher('GET', process.env.VIDEO_TAGGINGS_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function currentVideoTagging(id) {
  try {
    const url = `${process.env.VIDEO_TAGGINGS_DATA}/${id}`;
    const response = await fetcher('GET', url);
    return response;
  } catch (err) {
    return null;
  }
}

export async function addVideoTaggings(params) {
  try {
    const response = await fetcher('POST', process.env.VIDEO_TAGGINGS_ADD_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function deleteVideoTaggings(params) {
  try {
    const response = await fetcher('POST', process.env.VIDEO_TAGGINGS_DELETE_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function updateVideoTagging(id, params) {
  try {
    const url = `${process.env.VIDEO_TAGGINGS_UPDATE_DATA}/${id}`;
    const response = await fetcher('POST', url, params);
    return response;
  } catch (err) {
    return null;
  }
}

// CustomTags

export async function getCustomTagsList(params) {
  try {
    const response = await fetcher('GET', process.env.TAGS_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function addCustomTags(params) {
  try {
    const response = await fetcher('POST', process.env.TAGS_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function deleteCustomTags(params) {
  try {
    const response = await fetcher('POST', process.env.TAGS_DELETE_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
