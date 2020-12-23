import pageConfig from '../../utils/pageOtpions/pageOtpions'
const config = pageConfig.index
const app = getApp();

Page({
  data: {
    type: ''
  },

  pageData: {
    scale: wx.getStorageSync('scale')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    this.setData({
      type: config.type.substr(0,1)
    })


    //注册监听，网络重连后，就刷新
    wx.onNetworkStatusChange((result) => {
      if (result.isConnected) {
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 点击重新加载按钮
   */
  reloadData(res) {
    wx.showLoading({
      title: '加载中',
    });
    this.loadData();
  },

  // navDetail: throttle(function (e) {
  //   console.log(e);
  //   const url = `/pages/detail/index?vid=${e.currentTarget.dataset.itemid}`;
  //   wx.navigateTo({
  //     url: url,
  //   });
  // }),

  // navToMap: throttle(function (e) {
  //   const data = e.currentTarget.dataset;
  //   if (wx.canIUse('navigateMap')) {
  //     wx.navigateMap({
  //       destination: {
  //         latitude: parseFloat(data.lat),
  //         longitude: parseFloat(data.lng),
  //         address: data.address // 地址
  //       }
  //     });
  //   } else {
  //     wx.showToast({
  //       title: '当前设备不支持导航',
  //     })
  //   }
  // }),
  // 图片加载失败
  imgLoadErr: function (res) {
    console.log(res)
    const index = res.currentTarget.dataset.index;
    let data = `videoList[${index}].avatar`
    this.setData({
      [data]: ""
    })
  }
});