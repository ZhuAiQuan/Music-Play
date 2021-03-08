# vue

> A Vue.js project


> 已经集成 vue-router、jquery、vant-ui、less

> 一个本地音乐播放器，需要先上传到web上才能加入曲库，上传不会消耗任何流量！ 播放会根据解析的曲目来网络匹配歌词以及封面，所以务必要求本地歌曲名称规范如 歌手 - 歌曲名。


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:7010
npm run dev

# build for production with minification
# npm run build
npm run build   

```

> 基于vite vue3 ts vant 构建 使用jquery ajax请求 （axios跨域问题无法在线上使用）
> 歌词来源于网易云 api来源于https://github.com/Binaryify/NeteaseCloudMusicApi 这位大佬

> 
> 待修复bug 歌词偶尔读取错误
> 原因是本项目歌词是实时获取当前播放进度时间来匹配请求后返回的歌词，可能算法存在一定的缺陷，待后期有空再修复！
> 

