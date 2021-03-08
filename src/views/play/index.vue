<template>
  <div class="play-container">
    <div id="bg-content"></div>
    <div class="title">
      <h1>{{ data.info.song }}</h1>
      <div>{{ data.info.sing }}</div>
    </div>
    <div class="cover" :class="{ 'no-cover': !data.cover }">
      <img :src="data.cover" alt="" v-show="data.cover">
    </div>
    <div class="opeartion">
      <van-icon name="arrow-left" size="30px" @click="onPrev" />
      <van-icon name="play-circle-o" size="40px" @click="onPlay" v-show="!data.isPlay" />
      <van-icon name="pause-circle-o" size="40px" @click="onPause" v-show="data.isPlay" />
      <van-icon name="arrow" size="30px" @click="onNext" />
    </div>
    <div class="lyric-content">
      <div v-for="item in data.now_lyric" :key="item">{{ item }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { state, SongsInfo, resetCurrent } from '../../util'
import { searchSong, getLyric } from '../../api/lyric'
import $ from 'jquery'
import { Toast } from 'vant';

interface DataType {
  info: SongsInfo,
  isPlay: boolean,
  netInfo: NetMsg[],
  lyric: string,
  now_lyric: Array,
  cover: string
}
interface NetMsg {
  id: number,
  name: string
}

export default defineComponent({
  name: 'play-page',
  setup() {
    const data: DataType = reactive({
      info: {
        song: '',
        size: 0,
        lastModified: 0,
        url: '',
        sing: '',
        type: ''
      },
      isPlay: false,
      netInfo: [],
      lyric: '',
      now_lyric: [],
      cover:''
    })

    const onPause = () => {
      state.audio.pause();
      data.isPlay = false
    }
    const onPlay = () => {
      if (state.audio.src) {
        state.audio.play();
        data.isPlay = true
      } else {
        Toast('列表暂无曲目，请导入')
      }
      
    }
    const onPrev = () => {
      //
      state.list.forEach((item: SongsInfo, i: number) => {
        if (item.url === data.info.url && state.list[i - 1]) {
          state.audio.src = state.list[i-1].url;
          data.isPlay = true;
          data.now_lyric = []
        } else if (item.url === data.info.url && !state.list[i - 1]) {
          state.audio.src = state.list[state.list.length-1].url;
          data.isPlay = true;
          data.now_lyric = []
        }
      })
    }
    const onNext = () => {
      for(let i = 0; i < state.list.length; i++) {
        const item: SongsInfo = state.list[i];
        if (item.url === data.info.url) {
          if (state.list[i+1]) state.audio.src = state.list[i+1].url
          else state.audio.src = state.list[0].url
          // state.audio.play();
          data.isPlay = true;
          data.now_lyric = []
          return
        }
      }
    };
    // 获取歌曲信息
    function getSongInfo() {
      data.info = state.list.find((item: SongsInfo) => item.url === state.audio.src);
      // searchMusic()
    }
    // 在线获取音乐信息
    function searchMusic() {
      // searchSong(`${data.info.sing}-${data.info.song}`).then(res => {
      //   console.log(res)
      // })
      $.ajax({
        url: `https://wyy.wangpinpin.com/search?keywords=${data.info.sing}-${data.info.song}&timestamp=${new Date().getTime()}`,
        xhrFields: {
          withCredentials: true, //关键
        },
        method: 'get',
        // dataType: 'jsonp',
        success: (res: any) => {
          if (+res.code === 200 && Array.isArray(res.result.songs) && res.result.songs.length) {
            data.netInfo = res.result.songs.map(item => {
              return {
                id: item.id,
                name: item.name
              }
            })
            MusicDetail();
            MusicLyric()
          }
        },
      })
    }
    // 在线获取歌词
    function MusicLyric(i: number = 0) {
      const id = data.netInfo[i].id;
      $.ajax({
        url: `https://wyy.wangpinpin.com/lyric?id=${id}&&timestamp=${new Date().getTime()}`,
        method: 'get',
        xhrFields: {
          withCredentials: true, //关键
        },
        success: (res) => {
          // res = res.lrc
          if (res.lrc && res.lrc.lyric) data.lyric = res.lrc.lyric
          else data.lyric = ''
          // debugger
        }
      })
    }
    // 歌曲详情
    function MusicDetail(i: number = 0) {
      const ids = data.netInfo[i].id;
      data.cover = '';
      $.ajax({
        url: `https://wyy.wangpinpin.com/song/detail?ids=${ids}`,
        xhrFields: {
          withCredentials: true, //关键
        },
        method: 'get',
        success: (res) => {
          if (+res.code === 200) {
            data.cover = res.songs[0].al.picUrl;
            document.getElementById('bg-content').style.backgroundImage = `url(${data.cover})`;
            document.getElementById('bg-content').style.backgroundSize = `cover`;
          }
        }
      })
    }

    onMounted(() => {
      if (state.audio.src && !state.audio.paused) {
        data.now_lyric = []
        data.isPlay = true
        data.cover = state.nowInfo.cover
        data.lyric = state.nowInfo.lyric
        document.getElementById('bg-content').style.backgroundImage = `url(${data.cover})`;
        document.getElementById('bg-content').style.backgroundSize = `cover`;
        data.now_lyric = state.nowLyric
        getSongInfo()
      } else {
        data.isPlay = false
      }
      // if (state.audio.paused) debugger
      document.getElementById('app').style.backgroundImage = "linear-gradient(to top left, #409EFF, #E6A23C)"
      state.audio.onplay = () => {// 监听播放状态
        data.now_lyric = []
        data.isPlay = true
        data.cover = state.nowInfo.cover
        data.lyric = state.nowInfo.lyric
        document.getElementById('bg-content').style.backgroundImage = `url(${data.cover})`;
        document.getElementById('bg-content').style.backgroundSize = `cover`;
        data.now_lyric = state.nowLyric
        getSongInfo()
      }
    })
    onUnmounted(() => {
      document.getElementById('app').style.backgroundImage = "none"
    })

    
    
    return {
      data,
      onPlay,
      onPause,
      onPrev,
      onNext,
    }
  }
})
</script>

<style lang="less" scoped>
.play-container {
  padding-bottom: 50px;
  height: calc(100% - 50px);
  overflow: hidden;
  position: relative;
  z-index: 10;
  // background-image: linear-gradient(to top left, #409EFF, #E6A23C);
  .cover {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 0 auto;
    overflow: hidden;
    // transform:rotate(360deg);
    // transition:transform initial linear;
    img {
      width: 100%;
      height: 100%;
      -webkit-animation: circle 10s infinite linear;
    }
  }
  .no-cover {
    background-image: linear-gradient(to bottom right, #67C23A, #E6A23C);
  }
  .title {
    height: 24%;
    width: 100%;
    text-align: center;
    color: #fff;
    padding-top: 10%;
  }
  .opeartion {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    & > .van-icon:first-child {
      margin-right: 30px;
    }
    & > .van-icon:last-child {
      margin-left: 30px;
    }
  }
  .lyric-content {
    height: calc(66% - 260px);
    padding-top: 20px;
    text-align: center;
    color: #fff;
    font-size: 12px;
    & > div:last-child {
      font-size: 16px;
      color: tomato;
    }
    & > div {
      margin-bottom: 10px;
    }
  }
  #bg-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% + 50px);
    filter: blur(10px);
    z-index: -1;
  }
}
</style>

<style lang="less">
@-webkit-keyframes circle{
    0%{ transform:rotate(0deg); }
    100%{ transform:rotate(360deg); }
}
</style>