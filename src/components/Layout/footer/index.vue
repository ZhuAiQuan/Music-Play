<template>
  <van-tabbar route id="footer">
    <van-tabbar-item replace :to="item.path" :icon="item.icon" v-for="item in navList.routes" :key="item.path">{{ item.name }}</van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'footer-nav',
  setup() {
    const navList = reactive({
      routes: [
        {
          path: '/play',
          name: '播放',
          icon: 'music-o'
        },
        {
          path: '/list',
          name: '列表',
          icon: 'orders-o'
        },
        {
          path: '/export',
          name: '导入',
          icon: 'apps-o'
        }
      ]
    })

    return {
      navList
    }
  }
})
</script>

<style lang="less" scoped>
.van-tabbar {
  background: transparent;
  .van-tabbar-item--active {
    background: transparent;
    filter: blur(3px);
  }
}
</style>