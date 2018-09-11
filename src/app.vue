<template>
    <div id="app">
        <tb-video class="video" :videoList="videoList" ref="tbVideo" :videoIndex="videoIndex"></tb-video>
        <div class="pic" style="margin-top:0">
            <img src="./components/TbVideo/static/poster.jpg">
        </div>
        <div class="pic">
            <img src="./components/TbVideo/static/poster2.jpg">
        </div>
        <div class="pic">
            <img src="./components/TbVideo/static/poster3.jpg">
        </div>
        <div class="pic">
            <img src="./components/TbVideo/static/poster4.jpg">
        </div>
    </div>
</template>
<script>
import TbVideo from './components/TbVideo/TbVideo.vue'
export default {
    components: {
        TbVideo
    },
    data() {
        return {
            scroll: '',
            ifVideoChange: false,
            videoList: ['./components/TbVideo/static/video1.mp4','./components/TbVideo/static/video2.mp4', './components/TbVideo/static/video3.mp4', './components/TbVideo/static/video1.mp4'],
            video: '',
            videoIndex: 0
        }
    },
    methods: {
        handleScroll: function() {
            this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
            let index = Math.floor(this.scroll/400)
            if(this.$refs.tbVideo.isPlaying === true)
                this.$refs.tbVideo.$refs.videoPlayer.play()
            if(index !== this.videoIndex){
                this.videoIndex = index
                console.log(this.$refs.tbVideo)
            }
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll)
    }
}
</script>
<style>
#app {
    width:100%;
    height: 100%
}
.video {
    height: 211px;
    position: fixed;
    top: 0;
    width: 100%;
}
.pic {
    width: 100%;
    margin-top: 200px;
}
.pic img {
    width: 100%;
}
</style>