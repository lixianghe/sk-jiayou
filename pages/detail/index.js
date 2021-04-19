const app = getApp();
Page({
  data: {
    // 0 正常 1 无数据 2 网络异常 3 服务器异常
    retcode: 0,
    detailOption: null
  },
  onLoad: function (options) {
    this.setData({
      detailOption: options
    })
  },

  onReady() {

  }
});