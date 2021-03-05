import axios from '../util/api.request'

export const searchSong = (keyword: string) => {
  const params = { timestamp: new Date().getTime(), keyword };
  return axios.request({
    url: '/search',
    withCredentials: true,
    method: 'get',
    params
  })
}

export const getLyric = (id: number) => {
  const params = { timestamp: new Date().getTime(), id };
  return axios.request({
    url: '/lyric',
    withCredentials: true,
    method: 'get',
    params
  })
}