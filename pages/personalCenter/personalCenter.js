import pageConfig from '../../utils/pageOtpions/pageOtpions'
import {
  throttle
} from '../../utils/util'
const config = pageConfig.index
const app = getApp()


Page({
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
    locationPic: '../../images/dark/invalid_name_1.png',
    loadAnimation: null,
    isLoading: false
  },
  getList() {
    let list = wx.getStorageSync('oilHistoryList') || []
    if (list.length) {
      this.setData({
        videoList: list.slice(0, 31),
        retcode: 0
      })
    } else {
      this.setData({
        retcode: 1
      })
    }

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
      url: '/pages/detail/index',
    })
  },
  toHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 导航
  navToMap: throttle(function (e) {
    const data = e.currentTarget.dataset;
    if (wx.canIUse('navigateMap')) {
      wx.navigateMap({
        destination: {
          latitude: parseFloat(data.lat),
          longitude: parseFloat(data.lng),
          address: data.address // 地址
        }
      });
    } else {
      wx.showToast({
        title: '当前设备不支持导航',
        icon: 'none'
      })
    }
  }),
  onShow: function() {
    console.log('show')
    this.getList()
  },
  onLoad: function () {
    app.setTheme(this);
  },

})