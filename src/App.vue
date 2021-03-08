<template>
  <router-view></router-view>
  <audio style="display: none" ref="audio" :ontimeupdate="updateTime" />
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { getAudioDom, state, getCurrentTime, resetCurrent } from './util'
import { searchSong, getLyric, SongDetail } from './api/lyric'

export default defineComponent({
  name: 'App',
  setup() {
    const audio = ref(null);
    const info = reactive({
      songs: [],
      lyric: '',
      cover: '',
    })

    const updateTime = () => {// 获取当前时长以及总时长
      // console.log(audio.value.currentTime, audio.value.duration)
      // getCurrentTime([audio.value.currentTime, audio.value.duration]);
      const time = resetCurrent(audio.value.currentTime);
      if (info.lyric && info.lyric.includes(time)) {
        const now = info.lyric.substring(info.lyric.indexOf(time));
        const lrc = now.substring(now.indexOf(']') + 1, now.indexOf('[') > -1 ? now.indexOf('[') : now.length - 1); // 当前的歌词

        if (!state.nowLyric.length || state.nowLyric[state.nowLyric.length - 1] !== lrc) state.nowLyric.push(lrc); // 最后一句不与当前这句相同这添加进来
        if (state.nowLyric.length > 3) state.nowLyric.shift()
      }
    }
    async function searchMusic(keywords) {
      await searchSong(keywords).then((res: unknown) => {
        if (typeof(+res.code) === 'number' && +res.code === 200) {
          if (res.result && Array.isArray(res.result.songs)) {
            info.songs = res.result.songs
          }
        }
      })
    }
    async function _Lyric(i: number = 0) {
      info.lyric = ''
      const id: number = +info.songs[i].id;
      await getLyric(id).then((res: unknown) => {
        if (typeof(+res.code) === 'number' && +res.code === 200) {
          if (res.lrc && res.lrc.lyric) info.lyric = res.lrc.lyric
          if (res.nolyric) info.lyric = ''
        }
      })
    }
    async function _Detail(i: number = 0) {
      const ids = info.songs[i].id;
      await SongDetail(ids).then((res: unknown) => {
        info.cover = ''
        if (typeof(+res.code) === 'number' && +res.code === 200) {
          info.cover = res.songs[0].al.picUrl;
        }
      })
    }

    onMounted(() => {
      getAudioDom(audio.value);
      audio.value.onplay = () => {// 开始播放
        // 
      }
      audio.value.onended = () => {// 监听播放结束自动播放下一首 循环播放
        for(let i = 0; i < state.list.length; i++) {
          if (state.list[i].url === audio.value.src) {
            if (state.list[i+1]) audio.value.src = state.list[i+1].url;
            else audio.value.src = state.list[0].url
            setTimeout(() => {// 延迟播放
              audio.value.play()
            }, 300);
            return
          }
        }
        
      }
      audio.value.onpause = () => {// 暂停
        //
      }
      audio.value.oncanplay = () => {// 当浏览器能够开始播放指定的音频/视频时，会发生 canplay 事件
        // debugger
      }
      audio.value.onloadstart = async () => {// 当浏览器开始寻找指定的音频/视频时，会发生 loadstart 事件。即当加载过程开始时。
        const { sing, song } = state.list.find(item => item.url === audio.value.src);
        await searchMusic(`${sing}-${song}`);
        state.nowInfo.songs = info.songs;
        await _Lyric();
        state.nowInfo.lyric = info.lyric;
        await _Detail();
        state.nowInfo.cover = info.cover;
        audio.value.play()
      }

    })

    return {
      audio,
      updateTime
    }
  }
})
</script>

<style>
#app {
  height: 100vh;
}
</style>