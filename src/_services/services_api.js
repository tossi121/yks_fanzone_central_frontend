import { fetcher, filesFetch } from '@/_helper/apiBase';

export async function getLogin(params) {
  try {
    const response = await fetcher('POST', process.env.LOGIN_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function getPressReleasesList(params) {
  try {
    const response = await fetcher('GET', process.env.PRESS_RELEASES_LIST_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
