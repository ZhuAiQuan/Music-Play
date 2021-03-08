import { request } from '../util/request'

export const searchSong = (keyword: string) => {
  return request({
    url: `/search?keywords=${keyword}`,
    method: 'get',
  })
}

export const getLyric = (id: number) => {
  return request({
    url: `/lyric?id=${id}`,
    method: 'get'
  })
}

export const SongDetail = (ids: number) => {
  return request({
    url: `/song/detail?ids=${ids}`,
    method: 'get'
  })
}