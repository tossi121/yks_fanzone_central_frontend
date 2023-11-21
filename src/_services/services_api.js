import { fetcher } from '@/_helper/apiBase';

export async function getLogin(params) {
  try {
    const response = await fetcher('POST', process.env.LOGIN_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
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

export async function updatePressRelease(params) {
  try {
    const response = await fetcher('POST', process.env.PRESS_RELEASES_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
