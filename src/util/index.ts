import { reactive } from 'vue'

interface State {
  list: SongsInfo[]
  audio: any
  src: string,
  currentTime: number[],
  nowInfo: NowInfo,
  nowLyric: string[]
}
export interface SongsInfo {
  song: string
  size: number
  lastModified: number
  url: string
  sing: string
  type: string,
}
export interface NowInfo {
  songs: any[],
  lyric: string,
  cover: string
}

export const state: State = reactive({
  list: [],
  audio: null,
  src: '',
  currentTime: [],
  nowInfo: {
    songs: [],
    lyric: '',
    cover: ''
  },
  nowLyric: []
})

export const getPlayList = (list: SongsInfo[]):void => {
  state.list = list
}

export const getAudioDom = (dom: any) => {
  state.audio = dom
}

export const getCurrentTime = (data: number[]):void => {
  state.currentTime = data
}

export const resetCurrent = (time: number): string => {
  if (time < 60) {// 小于60s 转换字符串 向下取整
    if (time < 10) return `00:0${Math.floor(time)}`
    else return `00:${Math.floor(time)}`
  } else {
    const m: number = Math.floor(time/60); // 分钟
    const s: number = Math.floor(time - (m*60)); // 秒钟
    if (time/60 < 10) {
      return `0${m}:${s}`
    } else {
      return `${m}:${s}`
    }
  }
}