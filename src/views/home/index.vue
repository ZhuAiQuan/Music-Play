<template>
  <div class="content">
    <van-notice-bar
      left-icon="volume-o"
      text="tips：本地上传音乐文件，便于添加到曲库播放，上传不会消耗任何流量！"
    />
    <van-divider dashed>本地上传</van-divider>
    <van-uploader :before-read="beforeRead" accept="audio/*" multiple>
      <van-button icon="plus" type="primary">上传文件</van-button>
    </van-uploader>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { getPlayList, SongsInfo, state } from '../../util';
import { Dialog } from 'vant'

interface SongInfo {
  songs: string,
  name: string
}
interface SongDetail {
  sing: string,
  song: string,
  type: string
}

export default defineComponent({
  name: 'home',
  setup() {
    const url = ref('');
    const play_list: SongsInfo[] = ref([])
    const beforeRead = (file) => {
      if (file.length) {
        // 
        for(let i = 0; i < file.length; i++) {
          const { sing, song, type } = resetSongName(file[i].name);
          // const tag = await musicMetadata.parseBlob(file[i]);
          if (!play_list.value.map(item => item.name).includes(file[i].name)) {
            play_list.value.push({
              song,
              size: file[i].size,
              lastModified: file[i].lastModified,
              url: window.webkitURL.createObjectURL(file[i]),
              sing,
              type
              // info: resetName(file[i].name),
              // cover: musicMetadata.parseBlob(file[i])
            })
          }
        }
      } else {
        if (!play_list.value.map(item => item.name).includes(file.name)) {
          const { sing, song, type } = resetSongName(file.name)
          play_list.value.push({
            song,
            sing,
            type,
            size: file.size,
            lastModified: file.lastModified,
            url: window.webkitURL.createObjectURL(file),
          })
        }
      }
      getPlayList(play_list.value);
      Dialog.alert({
        title: '提示',
        message: `本次上传了${file.length || 1}个文件`
      }).then(() => {})
    }
    function resetName(name: string) {
      if (name.includes(' - ')) {
        return {
          songs: name.split(' - ')[0],
          name: name.split(' - ')[1]
        }
      } else {
        return {
          songs: '未知',
          name
        }
      }
    }
    // 获取歌曲的信息 歌手 歌曲名字 类型
    function resetSongName(title: string): SongDetail {
      const type = title.substr(title.lastIndexOf('.'), title.length);
      if(title.includes('-')) {
        const sing = title.substr(0, title.lastIndexOf('-')).trim();
        const song = title.substring(title.lastIndexOf('-') + 1, title.lastIndexOf('.')).trim();
        
        return {
          sing,
          song,
          type
        }
      } else {
        return {
          sing: '',
          song: title.substring(0, title.lastIndexOf('.')),
          type
        }
      }
    }
    onMounted(() => {
      play_list.value = state.list
    })

    return {
      beforeRead,
      url,
      play_list
    }
  }
})
</script>

<style lang="less" scoped>
.content {
  text-align: center;
  padding-top: 10px;
}
</style>