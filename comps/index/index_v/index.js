
import pageConfig from '../../../utils/pageOtpions/pageOtpions'
import { throttle } from '../../../utils/util'
const config = pageConfig.index
const app = getApp()
let wxMap = require('../../../utils/qqmap-wx-jssdk');
var map = new wxMap({
  key: 'VFWBZ-OIK3W-VAIRD-R7YAZ-T3UPV-NNFX5' 
}); 

import { getOil } from '../../../utils/httpOpt/api'

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
      {oil: '90#', num: '6'},
      {oil: '92#', num: '7'},
      {oil: '95#', num: '7.5'},
      {oil: '98#', num: '8.2'}
    ],
    currentOil: '92',
    currentBrand: '0'
  },
  methods: {
    // 获取地理位置
    loadLocation() {
      let that = this
      that.setData({
        address: '加载中',
        locationPic: '../../../images/dark/locationLoading.png',
        isLoading: true
      })
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          // app.log("----获取定位初始化数据成功-----",res)
          const latitude = res.latitude;
          const longitude = res.longitude;     
          wx.setStorageSync('lat', latitude); 
          wx.setStorageSync('lng', longitude);  
          that.getAddress(latitude, longitude)  
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
      console.log(latitude, longitude)
      map.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function(res) {//成功后的回调
          console.log(res);
          let result = res.result;
          let address = `${result.formatted_addresses.recommend}`
          setTimeout(() => {
            that.setData({
              address,
              locationPic: '../../../images/dark/invalid_name_1.png',
              isLoading: false
            })
          }, 1000)
          let params = {
            pageNo: 1,
            pageSize: 10,
            latitude: String(latitude),
            longitude: String(longitude),
            type: 0,
            oilName: '92'
          }
          that.getOilList(params)
        },
        fail: function(error) {
          console.error(error);
          that.setData({
            retcode: 3,
            address: '重新加载',
            locationPic: '../../../images/dark/locationReload.png',
            isLoading: false
          })
        }
      })
    },
    getOilList(params){
      getOil(params).then(res => {
        console.log(res)
        let list = []
        res.data.oilInfoList.map(item => {
          list.push({
            id: item.id,
            mainTitle: item.name,
            subTitle: item.address,
            // mainLabel: item.
          })
        })
        this.setData({
          videoList: list,
          total: res.data.count
        })
      })
    },
    refresh() {
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
    linkInfo() {
      wx.navigateTo({
        url: '/pages/detail/index',
      })
    },
    // 初始化swiper
    initSwiper() {
      var mySwiper = new Swiper ('.swiper-container', {
        direction: 'vertical', // 垂直切换选项
        loop: true, // 循环模式选项
      })        
    },
    selectOil(e) {
      this.setData({currentOil: e.currentTarget.dataset.val})
    },
    selectBrand(e) {
      this.setData({currentBrand: e.currentTarget.dataset.val})
    }
  },
  attached: function () {
    app.setTheme(this);
    this.modalAnimation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.loadLocation()
  },

})
