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
    this.setData({
      type: config.type.substr(0,1)
    })
  },

  onShow() {

  }
});