
import pageConfig from '../../utils/pageOtpions/pageOtpions'
const config = pageConfig.index
const app = getApp()
let wxMap = require('../../utils/qqmap-wx-jssdk');
var map = new wxMap({
  key: 'VFWBZ-OIK3W-VAIRD-R7YAZ-T3UPV-NNFX5' 
}); 

Component({
  // behaviors: [myBehavior],
  modalAnimation: null,
  animation2: null,
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
    // 0 正常 1 无数据 2 网络异常 3 定位失败
    retcode: 0,
    // 视频列表
    videoList: [],
    imgType: config.type,
    button: config.button,
    oilAnimation: null,
    brandAnimation: null,
    showMaskOil: false,
    showMaskBrand: false,
    address: '',
    locationLoading: false,
    locationPic: '../../../images/dark/invalid_name_1.png',
    loadAnimation: null,
    isLoading: false
  },
  methods: {
    getList() {
      this.setData({retcode: 1})
    },
    refresh() {

    },
    scrollRight() {
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
    },
    linkInfo() {
      wx.navigateTo({
        url: '/pages/detail/index.js',
      })
    }
  },
  attached: function () {
    app.setTheme(this);
    setTimeout(() => {
      this.setData({
        videoList: config.pageData
      })
    }, 1000)
    this.getList()
  },

})
