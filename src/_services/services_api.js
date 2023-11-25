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
    const response = await fetcher('POST', process.env.GALLERY_ADD_DATA, params);
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
    const url = `${process.env.GALLERY_DATA}/${id}`;
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
