import {
  throttle
} from '../../../utils/util'
const app = getApp()


Component({
  behaviors: [],
  properties: {
  },
  data: {
    colorStyle: app.globalData.theme.colorStyle,
    backgroundColor: app.globalData.theme.backgroundColor,
    // 视频列表
    videoList: [],
    address: ''
  },
  methods: {
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
    linkInfo(e) {
      
    },
    // 导航
    navToMap: throttle(function (e) {
      // const data = e.currentTarget.dataset;
      // if (wx.canIUse('navigateMap')) {
      //   wx.navigateMap({
      //     destination: {
      //       latitude: parseFloat(data.lat),
      //       longitude: parseFloat(data.lng),
      //       address: data.address // 地址
      //     }
      //   });
      // } else {
      //   wx.showToast({
      //     title: '当前设备不支持导航',
      //     icon: 'none'
      //   })
      // }
    }),
  },
  attached: function () {
    console.log('attached')
    app.setTheme(this);
    this.getList()
  },

})