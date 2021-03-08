<template>
  <van-cell-group>
    <van-cell v-for="item in list" :key="item.src" @click="nowPlay(item)">
      <template #title>
        {{ item.sing }} - {{ item.song }}
      </template>
      <template #default>
        {{ (item.size/1024/1024).toFixed(2) }}MB
      </template>
      <template #label>
        {{ new Date(item.lastModified).toLocaleDateString() }}
      </template>
    </van-cell>
  </van-cell-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { state, SongsInfo } from '../../util/index'

export default defineComponent({
  name: 'play-list',
  setup() {
    const nowPlay = (item: SongsInfo) => {
      state.audio.src = item.url
    }

    return {
      list: state.list,
      nowPlay
    }
  }
})
</script>

<style lang="less" scoped>
.van-cell-group {
  padding-bottom: 50px;
}
</style>