
import pageConfig from '../../../utils/pageOtpions/pageOtpions'
import { throttle, formatMeter } from '../../../utils/util'
const config = pageConfig.index
const app = getApp()
let wxMap = require('../../../utils/qqmap-wx-jssdk');
var map = new wxMap({
  key: 'VFWBZ-OIK3W-VAIRD-R7YAZ-T3UPV-NNFX5' 
}); 

import { getOil } from '../../../utils/httpOpt/api'
let pageNo = 1
let params = {}

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
    isLoading: false,
    oilList: [
      {value: '92', label: '92#'},
      {value: '95', label: '95#'},
      {value: '98', label: '98#'},
      {value: 'E92', label: 'E92#'}
    ],
    brandList: [
      {value: '0', label: '全部品牌'},
      {value: '1', label: '中石油'},
      {value: '2', label: '中石化'},
      {value: '3', label: '壳牌'},
      {value: '4', label: '其他'}
    ],
    swiperArr: [
    ],
    currentOil: '92',
    currentBrand: '0',
    latitude: null,
    longitude: null,
    lowerThreshold: 100,
    scrollLeft: 0
  },
  params: {},
  methods: {
    // 获取地理位置
    loadLocation() {
      let that = this
      that.setData({
        address: '加载中',
        locationPic: '../../../images/dark/locationLoading.png',
        isLoading: true,
        scrollLeft: 0
      })
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          // app.log("----获取定位初始化数据成功-----",res)
          app.log(JSON.stringify(res))
          const latitude = res.latitude;
          const longitude = res.longitude;     
          wx.setStorageSync('lat', latitude); 
          wx.setStorageSync('lng', longitude);  
          // 获取地理位置
          that.getAddress(latitude, longitude)  
          // 获取加油站列表
          params = {
            pageNo: 1,
            pageSize: 10,
            latitude: latitude,
            longitude: longitude,
            type: that.data.currentBrand,
            oilName: that.data.currentOil
          }
          that.getOilList(params)
        },
        fail(res) {
          const latitude = '39.908823';
          const longitude = '116.397470';
          wx.setStorageSync('lat', latitude); 
          wx.setStorageSync('lng', longitude);     
        }
      });
    },
    getAddress(latitude, longitude) {
      let that = this
      map.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function(res) {//成功后的回调
          let result = res.result;
          // console.log(result)
          let address = `${result.formatted_addresses.recommend}`
          that.setData({
            address,
            locationPic: '../../../images/dark/invalid_name_1.png',
            isLoading: false,
            latitude: latitude,
            longitude: longitude
          })
        },
        fail: function(error) {
          that.setData({
            retcode: 3,
            address: '重新加载',
            locationPic: '../../../images/dark/locationReload.png',
            isLoading: false
          })
        }
      })
    },
    getOilList(params, scrollLoad = false){
      if (!scrollLoad) {
        wx.showLoading({
          title: '加载中...'
        })
      }
      getOil(params).then(res => {
        let list = []
        // 如果没有返回列表或返回为空的情况
        if (!res.data || !res.data.oilInfoList || !res.data.oilInfoList.length) {
          this.setData({
            retcode: 4
          })
          wx.hideLoading()
          return
        }
        res.data.oilInfoList.map(item => {
          item.priceObj = item.product.filter(n => n.oilNumber == this.data.currentOil)[0]
          let shengPrice = ((200 / item.priceObj.gunPrice) * (item.priceObj.gunPrice - item.priceObj.userPrice)).toFixed(2)
          item.subLabel = `加200比油站价省${shengPrice}`
          // console.log(item.address.split('市'))
          list.push({
            id: item.id,
            mainTitle: item.name,
            subTitle: item.address.split('市')[item.address.split('市').length - 1],
            mainLabel: item.priceObj.userPrice,
            subLabel: [item.subLabel],
            image: item.picture.small,
            lat: item.location.lat,
            lng: item.location.lng,
            address: item.address,
            gunPrice: item.priceObj.gunPrice,
            shengPrice: shengPrice,
            distance: formatMeter(item.distance, 1)
          })
        })
        this.setData({
          videoList: !scrollLoad ? list : this.data.videoList.concat(list),
          total: res.data.count,
          retcode: 0,
          swiperArr: res.gasolineList
        }, () => {
          if (res.data.count <= 10) this.setData({lowerThreshold: 100})
        })
        wx.hideLoading()
      })
      .catch(error => {
        wx.hideLoading()
        this.setData({
          videoList: [],
          total: 0,
          retcode: 4
        })
      })
    },
    refresh() {
      this.loadLocation()
    },
    // 重制条件
    reset() {
      this.setData({
        currentBrand: '0',
        currentOil: '92'
      })
      this.loadLocation()
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
    }),
    scrollRight() {
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
    },
    showOil() {
      this.modalAnimation.translateX(0).step()
      this.setData({
        oilAnimation: this.modalAnimation.export(),
        showMaskOil: true
      })
    },
    closeOil() {
      this.modalAnimation.translateX('-160vh').step()
      this.setData({
        oilAnimation: this.modalAnimation.export(),
        showMaskOil: false
      })
    },
    showBrand() {
      this.modalAnimation.translateX(0).step()
      this.setData({
        brandAnimation: this.modalAnimation.export(),
        showMaskBrand: true
      })
    },
    closeBrand() {
      this.modalAnimation.translateX('-116.9vh').step()
      this.setData({
        brandAnimation: this.modalAnimation.export(),
        showMaskBrand: false
      })
    },
    linkInfo(e) {
      
      let index = e.currentTarget.dataset.index
      let oil = this.data.videoList[index]
      app.log(JSON.stringify(oil))
      wx.setStorageSync('oilItem', oil)
      // 把历史记录存在缓存
      let oilHistoryList = wx.getStorageSync('oilHistoryList') || []
      // console.log(e.currentTarget.dataset.index, oil, oilHistoryList)
      // 判断是否已经存在oil
      for (var i = 0; i < oilHistoryList.length; i++) {
        if (oilHistoryList[i] && (oilHistoryList[i].id === oil.id)) {
          oilHistoryList.splice(i, 1)
          oilHistoryList.unshift(oil)
          wx.setStorageSync('oilHistoryList', oilHistoryList)
          wx.navigateTo({
            url: '/pages/detail/index',
          })
          return;
        }
      }
      
      if (oil.id) oilHistoryList.unshift(oil)
      wx.setStorageSync('oilHistoryList', oilHistoryList)
      wx.navigateTo({
        url: '/pages/detail/index',
      })
    },
    selectOil(e) {
      pageNo = 1
      this.setData({
        currentOil: e.currentTarget.dataset.val,
        scrollLeft: 0,
        lowerThreshold: 350
      })
      params.oilName = e.currentTarget.dataset.val 
      params.pageNo = 1
      this.closeOil()
      this.getOilList(params)
    },
    selectBrand(e) {
      pageNo = 1
      this.setData({
        currentBrand: e.currentTarget.dataset.val,
        scrollLeft: 0,
        lowerThreshold: 350
      })
      params.type = e.currentTarget.dataset.val 
      params.pageNo = 1
      this.closeBrand()
      this.getOilList(params)
    },
    scrollRight(e) {
      let maxPageNo = Math.ceil(this.data.total / 10)
      // console.log(maxPageNo, pageNo)
      if (pageNo == maxPageNo) this.setData({lowerThreshold: 50})
      pageNo++
      if (pageNo > maxPageNo) {
        wx.showToast({
          title: '已经到底了！',
          icon: 'none'
        })
        return
      } 
      params.pageNo = pageNo
      this.getOilList(params, true)
    },
  },

  attached: function () {
    // 检测网络
    let that = this
    app.getNetWork(that)
    pageNo = 1
    app.setTheme(that);
    that.modalAnimation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    that.loadLocation()
  },

})
