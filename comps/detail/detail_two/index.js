import { throttle } from '../../../utils/util';
var detail = require('../../../behaviors/detail')
var detailCom = require('../detailCom')
const app = getApp()

Component({
  behaviors: [detail, detailCom],
  properties: {
    detail: {
      type: Object,
      default: {}
    },
    btns: {
      type: Array,
      default: []
    }
  },
  data: {
    
  },
  observers: {

  },
  attached: function () {

  },
  ready: function() {

  },
  detached: function () {

  },
  methods: {
    /**
     * 点击重新加载按钮
     */
    reloadData(res) {
      wx.showLoading({
        title: '加载中',
      });
      const vid = this.data.vid
      this.getDetail(vid);
    },
    /**
   * 播放视频
   */
  playVideo: throttle(function (e) {
    this.setData({
      playing: true,
    });
    this.videoContext.play();
    this.videoContext.requestFullScreen({
      direction: 90
    });
  }), 

  playEnd() {
    this.setData({
      playing: false,
    });
  },
  

  /**
   * 当开始/继续播放时触发play事件 
   */
  videoOnPlay(res) {
    console.log(res)
    this.pageData.videoPlaying = true;
    this.setData({
      playing: true,
    });
  },

  /**
   * 当暂停播放时触发 pause 事件
   */
  videoOnPause(res) {
    console.log(res)
    this.pageData.videoPlaying = false;
  }
  }
})
