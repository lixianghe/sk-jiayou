import { getOilInfo } from '../../../utils/httpOpt/api'
import { throttle } from '../../../utils/util'
const app = getApp()

Component({
  behaviors: [],
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
    codeUrl: null,
    info: {},
    colorStyle: app.globalData.theme.colorStyle, // 页面色彩风格
    backgroundColor: app.globalData.theme.backgroundColor, // 页面背景色
    // 0 正常 1 无数据 2 网络异常 3 服务器异常
    retcode: 0
  },
  observers: {

  },
  attached: function () {
    this.getInfo()
  },
  ready: function() {

  },
  detached: function () {

  },
  methods: {
    getInfo() {
      wx.showLoading({title: '加载中...'})
      let oilItem = wx.getStorageSync('oilItem')
      this.setData({oilItem: oilItem})
      let params = {
        gasId: oilItem.id,
        latitude: Number(oilItem.lat).toFixed(6),
        longitude: Number(oilItem.lng).toFixed(6)
      }
      getOilInfo(params).then(res => {
        this.setData({
          codeUrl: res.codeUrl,
          info: res.oilInfo
        })
        wx.hideLoading()
      }).catch(error => {
        wx.hideLoading()
      })
    },
    // 图片加载完成
    imgLoad(e) {
      console.log(e)
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
      }else{
        wx.showToast({
          title: '当前设备不支持导航',
          icon: 'none'
        })
      }
    })
  },
  
})
