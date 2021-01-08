// my-behavior.js
import { throttle } from '../../utils/util'
const app = getApp()
module.exports = Behavior({
  behaviors: [],
  properties: {

  },
  data: {
    show: true,
    colorStyle: app.globalData.theme.colorStyle, // 页面色彩风格
    backgroundColor: app.globalData.theme.backgroundColor, // 页面背景色
    // 0 正常 1 无数据 2 网络异常 3 服务器异常
    retcode: 0,
    // 是否开始播放
    playing: false,
    // 视频详情
    detail: {},
    // 影院列表
    cinemas: [],
    vid: "-1", //电影id
    labels: [
      '标题一',
      '标题二'
    ],
    currentTap: 0,
    lineAnimation: {},
    textContent: '',
    scrollTop: 0,
    scrollLeft: 0,
    scrollWidth: 0,
    windowWidth: 0,
    touchWidth: 0,
    endPosition: 0,
    scrollLeft: 0,
    playing: true
  },
  created: function () {

  },
  attached: function () {
    this.videoContext = wx.createVideoContext('video')
    this.animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease'
    })
  },
  ready: function () {
    // this.getBoxWidth()
  },

  methods: {
    selectTap(e) {
      const index = e.currentTarget.dataset.index
      this.setData({
        currentTap: index
      })
      this.animation.translate(33.3 * index + 'vh', 0).step()
      this.setData({
        lineAnimation: this.animation.export(),
        'detail.textContent': this.data.detail.textContentList[index],
        scrollTop: 0
      })
    },
    touchstart(e) {
      let startPosition = e.changedTouches[0].pageX
      this.setData({
        startPosition
      })
      let query = wx.createSelectorQuery().in(this);
      query.select('.scroll').boundingClientRect(rect => {
        this.setData({
          scrollLeft: rect.left
        })
      }).exec();
    },
    touchmove(e) {
      let currentPosition = e.changedTouches[0].pageX
      let touchWidth = currentPosition - this.data.startPosition // 手指划过的距离
      let left = currentPosition - this.data.startPosition + this.data.scrollLeft // left值
      this.setData({
        touchWidth
      })
      // 获取scroll元素的left值，如果在起点不允许向右移动，在终点不允许向左移动,屏幕宽度大于内容也不能移动
      if (this.data.windowWidth > this.data.scrollWidth) return false
      if (this.data.scrollLeft === 0 && touchWidth < 0 || this.data.scrollLeft !== 0 && touchWidth > 0) {
        this.setData({
          left
        })
      }
    },
    touchend() {
      // 如果滑动的距离小于110就不执行下main动画
      if (Math.abs(this.data.touchWidth) < 110) {
        this.setData({
          left: this.data.scrollLeft
        })
        return false
      }
      let moveWidth = this.data.touchWidth > 0 ? 0 : this.data.windowWidth - this.data.scrollWidth // 屏幕最终移动的距离
      this.setData({
        left: moveWidth
      })
    },
    // 获取整个盒子和窗口的宽度
    getBoxWidth() {
      let query = wx.createSelectorQuery().in(this);
      query.select('.scroll').boundingClientRect(rect => {
        this.setData({
          scrollWidth: rect.width
        })
      }).exec();
      const windowWidth = wx.getSystemInfoSync().windowWidth
      this.setData({
        windowWidth
      })
    },
    detailClick(e) {
      const name = e.currentTarget.dataset.name
      this[name]()
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