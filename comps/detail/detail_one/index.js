import { getOilInfo } from '../../../utils/httpOpt/api'
import { throttle, formatMeter } from '../../../utils/util'
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
    },
    detailOption: {
      type: Object,
      default: {}
    }
  },
  data: {
    codeUrl: null,
    info: {},
    colorStyle: app.globalData.theme.colorStyle, // 页面色彩风格
    backgroundColor: app.globalData.theme.backgroundColor, // 页面背景色
    // 0 正常 1 无数据 2 网络异常 3 服务器异常
    retcode: 0,
    isFull: true
  },
  observers: {

  },
  attached: function (opion) {
    // 检测网络
    let that = this
    app.getNetWork(that)
    setTimeout(() => {
      that.getInfo()
    }, 200)
  },
  ready: function() {

  },
  detached: function () {

  },
  methods: {
    getInfo() {
      // 获取url的参数，如果有参数就是外部跳转的
      
      let detailOption = this.data.detailOption
      let params
      let oilItem = wx.getStorageSync('oilItem')
      if (detailOption && detailOption.gasId) {
        params = {
          gasId: detailOption.gasId,
          latitude: Number(detailOption.latitude).toFixed(6),
          longitude: Number(detailOption.longitude).toFixed(6)
        }
      } else {
        
        // this.setData({oilItem: oilItem})
        params = {
          gasId: oilItem.id,
          latitude: Number(oilItem.lat).toFixed(6),
          longitude: Number(oilItem.lng).toFixed(6)
        }
      }
      wx.showLoading({title: '加载中...'})
      
      getOilInfo(params).then(res => {
        res.oilInfo.prices = res.oilInfo.product.filter(n => n.oilNumber == '92')[0]
        res.oilInfo.prices.shengPrice = ((200 / res.oilInfo.prices.gunPrice) * (res.oilInfo.prices.gunPrice - res.oilInfo.prices.userPrice)).toFixed(2)
        res.oilInfo.distance = (detailOption && detailOption.gasId) ? formatMeter(res.oilInfo.distance, 1) : oilItem.distance
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
