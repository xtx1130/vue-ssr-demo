<template>
    <div class="pb-video">
        <div class="pb-video-poster" v-show="!isShowVideo">
            <img :src="videoPoster" width="100%">
            <p class="pb-video-play" @click="handleVideoShow"></p>
        </div>
        <div class="pb-video-channel" v-show="isShowVideo" ref="videoPannel">
            <div class="video-arounder">
                <video ref="videoPlayer" preload="metadata" width="100%" height="100%" x-webkit-airplay="true" x5-video-orientation="portraint" raw-controls="true" webkit-playsinline="true" playsinline="true" x5-video-player-type="h5" :src="videoSrc" @click.prevent="function noop(){}"></video>
            </div>
            <div class="pb-video-control" @click.stop="handleControlShow">
                <div class="pb-video-pannel"  v-show="isShowControl">
                    <div class="pb-video-icon" :style="{backgroundImage: isPlaying ? 'url(' + pauseBtn + ')' :'url(' + playBtn + ')' }" @click.stop="handleVideoPlay"></div>
                    <div class="pb-video-progress">
                        <span class="prog-playtime">{{ playTime }}</span>
                        <div class="prog-track" @click.stop="handlePlayTime" ref="progressTrack">
                            <span class="prog-load"></span>
                            <span class="prog-current" :style="{width: progressLength}"  @click.stop="handlePlayTime"><i class="prog-seekbtn"></i></span>
                        </div>
                        <span class="prog-fulltime">{{ fullTime }}</span>
                    </div>
                    <div class="prog-fullscreen" :style="{backgroundImage: isFullScreen ? 'url(' + smallBtn + ')' :'url(' + fullBtn + ')' }" @click.stop="handleVideoFull"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import screenfull from 'screenfull';
import playBtn from './static/icon_play.png';
import pauseBtn from './static/icon_pause.png';
import fullBtn from './static/icon_video_on.png';
import smallBtn from './static/icon_video_off.png';
// import fetch from '@/util/fetch-data';
export default {
    data() {
        return {
            videoSrc: String,
            videoPoster: String,
            isShowVideo: false,
            isShowControl: false,
            isPlaying: false,
            isFullScreen: false,
            playTime: '00:00',
            progressLength: '0%',
            fullTime: String,
            /* 图片素材 */
            playBtn: playBtn,
            pauseBtn: pauseBtn,
            fullBtn: fullBtn,
            smallBtn: smallBtn

        }
    },
    props: {
        kz: String,
        videoList: [],
        videoIndex: 0
    },
    methods: {
        fetchVideoData: async function() {
            // let res = await fetch('/mo/q/pb/page?kz=5866442128&fr=smallapp') 
            // return res.data.data
        },
        init: async function() {
            // let data = await this.fetchVideoData()
            // let videoInfo = data.video_info
            this.videoSrc = this.videoList[this.videoIndex]
            this.videoPoster = './static/poster.jpg'
            this.fullTime = this.formatTime(127)
        },
        // handleVideoEnd: function () {
        //     let ind = this.videoIndex
        //     if(ind < 2) {
        //         ind ++
        //     } else {
        //         ind = 0
        //     }
        //     this.$refs.videoPlayer.src = this.videoList[ind]
        // },
        handleVideoShow: function() {
            this.isShowVideo = true
            this.$refs.videoPlayer.play()
            this.isShowControl = true
            this.isPlaying = true
        },
        handleVideoPlay: function() {
            if(this.isPlaying){
                this.isPlaying = false
                this.$refs.videoPlayer.pause()
            } else {
                this.isPlaying = true
                this.$refs.videoPlayer.play()
            }
        },
        handleVideoFull: function() {
            let ele = this.$refs.videoPannel
            if(this.isFullScreen)
                this.cancelFullScreen(ele)
            else
                this.inFullScreen(ele)
        },
        handlePlayTime: function (ev) {
            let srcObj = ev.target || ev.srcElement
            let offset = ev.offsetX || (ev.clientX - srcObj.getBoundingClientRect().left)
            this.updatePlayTime(offset/this.$refs.progressTrack.clientWidth)
        },
        handleControlShow: function () {
            this.isShowControl ? (this.isShowControl = false) : (this.isShowControl = true)
        },
        updatePlayTime: function(precent) {
            let player = this.$refs.videoPlayer
            if(precent >= 1){
                player.currentTime = player.duration
                this.isPlaying = false
            } else if(precent <= 0) {
                player.currentTime = 0
                player.play()
                this.isPlaying = true
            } else {
                player.currentTime = player.duration*precent
            }
            this.playTime = this.formatTime(player.currentTime)
        },
        updateProgress: function() {
            let that = this
            let stopInter
            function playing() {
                let player = that.$refs.videoPlayer
                if(that.isPlaying) {
                    if(player.ended){
                        that.isPlaying = false
                        that.isShowVideo = false
                        that.progressLength = '0%'
                        that.playTime = '00:00'
                        that.cancelFullScreen(that.$refs.videoPannel)
                        clearInterval(stopInter)
                    }else {
                        that.playTime = that.formatTime(player.currentTime)
                        that.progressLength = (player.currentTime/player.duration)*100 + '%'
                    }
                } else {
                    clearInterval(stopInter)
                }
            }
            stopInter = setInterval(playing, 600)
        },
        formatTime: function(second) {
            const hour = parseInt(second / 3600, 10)
            const minute = parseInt((second - hour * 3600) / 60, 10)
            const minuteStr = minute < 10 ? ('0' + minute) : minute
            const sec = parseInt((second - hour * 3600) % 60, 10)
            const secStr = sec < 10 ? ('0' + sec) : sec
            const durationStr = minuteStr + ':' + secStr
            return hour ? (hour + ':' + durationStr) : durationStr
        },
        inFullScreen: function(ele) {
            ele.controls = false
            this.isFullScreen = true
            if(screenfull.enabled) {
                screenfull.request(ele)
            }
            // if (ele .requestFullscreen) {
            //     ele .requestFullscreen()
            // } else if (ele .mozRequestFullScreen) {
            //     ele .mozRequestFullScreen()
            // } else if (ele .webkitRequestFullScreen) {
            //     ele .webkitRequestFullScreen()
            // }
        },
        cancelFullScreen: function(ele) {
            this.isFullScreen = false
            if(screenfull.enabled) {
                screenfull.exit(ele)
            }
            // if (ele.exitFullscreen) {
            //     ele.exitFullscreen();
            // } else if (ele.mozCancelFullScreen) {
            //     ele.mozCancelFullScreen();
            // } else if (ele.webkitCancelFullScreen) {
            //     ele.webkitCancelFullScreen();
            // }
        }
    },
    created() {
        this.init();
    },
    mounted() {
        let that = this
        let ind = that.videoIndex
        this.$refs.videoPlayer.addEventListener('ended', function() {
            if(ind < 2) {
                ind ++
            } else {
                ind = 0
            }
            this.src = that.videoList[ind]
            this.play()
        })
    },
    watch: {
        isPlaying: function(play) {
            this.updateProgress()
            play ? setTimeout(() => this.isShowControl = false, 3000) : this.isShowControl = true
        },
        videoIndex: function(newUri) {
            this.$refs.videoPlayer.src = this.videoList[newUri]
        }
    }
}
</script>
<style>
.pb-video-poster {
    width: 100%;
    position: relative;
}
.pb-video-play {
    background-image: url(./static/icon_play.png);
    width: 64px;
    height: 64px;
    background-size: contain;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.pb-video-channel {
    position: relative;
    line-height: 0;
    height: 100%;
    width: 100%;
    background: #000;
}
.video-arounder, .video-arounder video {
    height: 100%;
    width: 100%;
}
.pb-video-control {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2147483648;
}
.pb-video-control .pb-video-pannel {
    position: absolute;
    bottom: 0px;
    height: 40px;
    width: 100%;
    background: rgba(0,0,0,.3);
}
.pb-video-control .pb-video-icon {
    position: absolute;
    width: 30px;
    height: 30px;
    background-size: contain;
    left: 10px;
    top: 5px;
}
.pb-video-control .pb-video-progress {
    position: relative;
    color: #fff;
    margin: 0 40px;
    margin-top: -10px;
}
.prog-playtime {
    position: absolute;
    left: 0;
    width:50px;
    font-size: 12px;
    top: 21px;
}
.prog-track {
    height: 3px;
    border-radius: 1.5px;
    background-color: #fff;
    position: relative;
    margin: 8px 55px 0;
    top: 20px;
    background: rgba(255,255,255,.5);
}
.prog-fulltime {
    position: absolute;
    right: 0;
    width:50px;
    font-size: 12px;
    top: 21px;
}
.prog-fullscreen {
    position: absolute;
    width: 20px;
    height: 19px;
    background-size: contain;
    right: 10px;
    top: 10px;
}
.prog-current {
    background: #4c94fc;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height:3px;
    border-radius: 1.5px;
}
video::-webkit-media-controls-enclosure { 
    display: none !important; 
} 
</style>