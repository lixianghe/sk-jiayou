
import pageConfig from '../../../utils/pageOtpions/pageOtpions'
const config = pageConfig.index
const app = getApp()
Component({
  // behaviors: [myBehavior],
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
    colorStyle: app.globalData.theme.colorStyle,
    backgroundColor: app.globalData.theme.backgroundColor,
    // 0 正常 1 无数据 2 网络异常 3 服务器异常
    retcode: 0,
    // 视频列表
    videoList: [],
    imgType: config.type,
    button: config.button
  },
  observers: {

  },
  attached: function () {
    app.setTheme(this);
    setTimeout(() => {
      this.setData({
        videoList: config.pageData
      })
    }, 1000)
  },

  methods: {
  }
})
