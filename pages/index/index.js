import {
  throttle
} from '../../utils/util';
const app = getApp();
Page({
  data: {
    colorStyle: app.globalData.theme.colorStyle, // 页面色彩风格
    backgroundColor: app.globalData.theme.backgroundColor, // 页面背景色
    // 0 正常 1 无数据 2 网络异常 3 服务器异常
    retcode: 0,
    // 视频列表
    videoList: [],
  },

  pageData: {
    scale: wx.getStorageSync('scale')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    app.setTheme(this);

    //注册监听，网络重连后，就刷新
    wx.onNetworkStatusChange((result) => {
      if(result.isConnected){
        this.loadData();
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadData();
    // 20秒后还没数据，重新刷新一次
    if (this.data.videoList && this.data.videoList.length == 0) {
      setTimeout(() => {
        this.getVideo( wx.getStorageSync('lat') , wx.getStorageSync('lng'));
      }, 1000 * 20);
    }
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

   /**
   * 获取定位，加载电影列表数据
   */
  loadData() {
    const that = this;
    // app.log("----获取定位，加载电影列表数据-----")
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        // app.log("----获取定位初始化数据成功-----",res)
        const latitude = res.latitude;
        const longitude = res.longitude;
        that.getVideo(latitude, longitude);      
        wx.setStorageSync('lat', latitude); 
        wx.setStorageSync('lng', longitude);      
      },
      fail(res) {
        const latitude = '39.908823';
        const longitude = '116.397470';
        that.getVideo(latitude, longitude);
        wx.setStorageSync('lat', latitude); 
        wx.setStorageSync('lng', longitude);     
        // app.log("----获取定位初始化数据失败-----",res) 
      }
    });
  },

  /**
   * 视频列表
   */
  getVideo(lat, lng) {
    // app.log("----获取视频列表-----")
    const stamp = app.getDateStamp();
    if (!app.listCache.refresh &&
      app.getDistance(app.listCache.lat, app.listCache.lng, lat, lng) < 1 &&
      app.listCache.data[stamp]) {
      if(this.data.videoList.length == 0){
        this.setData(app.listCache.data[stamp]);
      }
      return;
    }
    // app.log("----开始请求-----")
    app.post({
      url: 'videoList',
      data: {
        pos: `${lat},${lng}`,
        dis: '10.0',
        count: '20'
      }
    }, (res) => {
      wx.hideLoading();
      console.log(res);
      let retcode = 0;
      if (res.retcode === 0) {//success
        // app.log("----获取视频列表成功-----")
        if (res.data.length == 0) {  //无数据
          retcode = 1 
        } else {//有数据
          retcode = 0
          for (let i = 0; i < res.data.length; i += 1) {
            res.data[i].avatar = app.impressImg(res.data[i].avatar)
          }
          const data = {
            videoList: res.data,
          };
          this.setData(data);
          app.refreshListCache(stamp, data, lat, lng);
          wx.setStorageSync("data", data);
        }
      } else {//fail
        app.log("----获取视频列表失败-----")
        retcode = res.retcode === 408 ? 2 : 4
      }
      this.setData({
        retcode: retcode
      });
    });
  },

  navDetail: throttle(function (e) {
    console.log(e);
    const url = `/pages/detail/index?vid=${e.currentTarget.dataset.itemid}`;
    wx.navigateTo({
      url: url,
    });
  }),

  // 图片加载失败
  imgLoadErr:function(res){
    console.log(res)
    const index = res.currentTarget.dataset.index;
    let data =  `videoList[${index}].avatar`
    this.setData({
      [data]:""
    })
  }
});