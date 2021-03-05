<template>
  <router-view></router-view>
  <audio controls="controls" autoplay style="display: none" ref="audio" :ontimeupdate="updateTime" />
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { getAudioDom, state, getCurrentTime } from './util'

export default defineComponent({
  name: 'App',
  setup() {
    const audio = ref(null);
    const endPlay = computed(() => {
      nextTick(() => {
        return audio.value.ended
      })
    })
    const updateTime = () => {// 获取当前时长以及总时长
      // console.log(audio.value.currentTime, audio.value.duration)
      getCurrentTime([audio.value.currentTime, audio.value.duration])
    }
    watch(() => endPlay.value, (type) => {
      console.log(type)
    })

    onMounted(() => {
      getAudioDom(audio.value);
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