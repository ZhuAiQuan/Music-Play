<template>
  <router-view></router-view>
  <audio style="display: none" ref="audio" :ontimeupdate="updateTime" />
  <canvas ref="playMusic" style="width: 100%"></canvas>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { getAudioDom, state, getCurrentTime, resetCurrent } from './util'
import { searchSong, getLyric, SongDetail } from './api/lyric'

export default defineComponent({
  name: 'App',
  setup() {
    const audio: any = ref(null);
    const playMusic: any = ref(null);
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
    async function searchMusic(keywords: string) {
      await searchSong(keywords).then((res: any) => {
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
      await getLyric(id).then((res: any) => {
        if (typeof(+res.code) === 'number' && +res.code === 200) {
          if (res.lrc && res.lrc.lyric) info.lyric = res.lrc.lyric
          if (res.nolyric) info.lyric = ''
        }
      })
    }
    async function _Detail(i: number = 0) {
      const ids = info.songs[i].id;
      await SongDetail(ids).then((res: any) => {
        info.cover = ''
        if (typeof(+res.code) === 'number' && +res.code === 200) {
          info.cover = res.songs[0].al.picUrl;
        }
      })
    }
    function drawView() {
      nextTick(() => {
        const ctx = playMusic.value.getContext('2d');
        ctx.width = window.innerWidth;
        ctx.height = window.innerHeight;
        // state.audio.load();
        const actx = new AudioContext();
        const src = actx.createMediaElementSource(state.audio);
        const analyser = actx.createAnalyser();
        src.connect(analyser);
        analyser.connect(actx.destination);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;

        const barW = (ctx.width / bufferLength) - 1;
        let barH;

        const dataArr = new Uint8Array(bufferLength);
        function renderFrame() {
          requestAnimationFrame(renderFrame);

          ctx.fillStyle = '#333';
          ctx.fillRect(0, 0, ctx.width, ctx.height);

          analyser.getByteFrequencyData(dataArr); //获取当前时刻的音频数据

          let x = 0;
          for(let i = 0; i < bufferLength; i++) {
            const item = dataArr[i];
            const percentV = item/255;
            const percentH = i/bufferLength;
            barH = ctx.height * percentV;
            const r = 255*percentV;
            const g = 255*percentH;
            const b = 50;

            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, ctx.height - barH, barW, barH);

            x += barW + 1
          }
        };
        renderFrame()
      })
    }

    onMounted(() => {
      getAudioDom(audio.value);
      state.canvas = playMusic.value;
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
        state.nowLyric = [];
        state.nowInfo.lyric = '';
        const { sing, song } = state.list.find(item => item.url === audio.value.src);
        await searchMusic(`${sing}-${song}`);
        state.nowInfo.songs = info.songs;
        await _Lyric();
        state.nowInfo.lyric = info.lyric;
        await _Detail();
        state.nowInfo.cover = info.cover;
        drawView()
        audio.value.play()
      }

    })

    return {
      audio,
      updateTime,
      playMusic
    }
  }
})
</script>

<style>
#app {
  height: 100vh;
}
</style>