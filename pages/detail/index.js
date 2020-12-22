import {
  throttle
} from '../../utils/util';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show:true,
    colorStyle: app.globalData.theme.colorStyle, // 页面色彩风格
    backgroundColor: app.globalData.theme.backgroundColor, // 页面背景色
    // 0 正常 1 无数据 2 网络异常 3 服务器异常
    retcode: 0,
    // 是否开始播放
    playing: false,
    // 视频移动动画参数
    animationVideo: {
      minMoveLength: 50, // 动画生效最低触摸移动长度
      offset: 0, // 触摸位置与view窗口左侧距离
      ing: false, // 移动中
      open: false, // 打开详情
      startX: 0, // 触发移动的时候x位置
      endX: 0 // 移动中x位置
    },
    // 影院移动动画参数
    animationCinema: {
      maxDataLength: 0, // 最大数据长度
      minMoveLength: 50, // 动画生效最低触摸移动长度
      index: 0, // 当前移动到第几个
      listWidth: 0, // 列表窗口宽度
      itemWidth: 0, // 每个影院窗口宽度
      left: 0, // 左侧定位距离
      ing: false, // 移动中
      startX: 0, // 触发移动的时候x位置
      endX: 0, // 移动中x位置
      moveX: 0 // 移动x位置
    },
    // 视频详情
    detail: {},
    // 影院列表
    cinemas: [],
    vid: "-1", //电影id
  },
  pageData: {
    videoPlaying: false,
    scale: wx.getStorageSync('scale')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.screenAdapt(this);
    app.setTheme(this);
    const vid = options.vid ? options.vid : "-1"
    if(options.latitude && options.longitude){
      wx.setStorageSync('lat', options.latitude); 
      wx.setStorageSync('lng', options.longitude); 
   } 
    this.setData({
      vid: vid
    })
    this.getDetail(vid);
  },

  onReady(res) {
    this.videoContext = wx.createVideoContext('video')
  },

  /**
   * 点击重新加载按钮
   */
  reloadData(res) {
    wx.showLoading({
      title: '加载中',
    });
    const vid = this.data.vid
    this.getDetail(vid);
  },

  // 查询详情
  getDetail(id) {
    const stamp = app.getDateStamp();
    if (!app.detailCache.refresh &&
      app.detailCache.data[stamp] &&
      app.detailCache.data[stamp][id]) {
      this.setData(app.detailCache.data[stamp][id], () => {
        // 在页面加载成功后获取窗口尺寸
        this.getViewSize();
      });
      return;
    }
    const data = {
      pos: `${wx.getStorageSync('lat')},${wx.getStorageSync('lng')},`,
      movieId: id
    }
    app.post({
      url: 'videoDetail',
      data: data
    }, (res) => {
      let retcode = 0;
      wx.hideLoading();
      if (res.retcode === 0) { //success
      if (!res.data) { //无数据
          retcode = 1
        } else { //有数据
          retcode = 0
          const cinemas = res.data.cinemas;
          const shows = res.data.shows;
          // 标签分割逗号转换为斜线
          shows.cat = shows.cat.replace(/,/g, " / ");
          shows.star = shows.star.replace(/,/g, " / ");
          console.log(this.pageData.scale);
          shows.img = app.impressImg(shows.img)
          // shows.img = app.scaleImage(shows.img, 400, 400, this.pageData.scale);
          shows.videoImg = app.impressImg(shows.videoImg, "w=640&h=360")
          // shows.videoImg = app.scaleImage(shows.videoImg, 640, 360, this.pageData.scale);
          // 金额换算
          cinemas.map(item => {
            item.sellPrice = parseInt(item.sellPrice / 100);
            return item;
          });
          const data = {
            detail: shows,
            cinemas: cinemas,
            'animationCinema.maxDataLength': cinemas.length
          };
          this.setData(data, () => {
            // 在页面加载成功后获取窗口尺寸
            this.getViewSize();
          });
          app.refreshDetailCache(stamp, data);
        }
      } else { //fail
        retcode = res.retcode === 408 ? 2 : 3
      }
      this.setData({
        retcode: retcode
      });
    });
  },

  /**
   * 导航到影院
   */
  navToMap: throttle(function (e) {
    // this.setData({
    //   show:!this.data.show
    // })
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
      })
    }
  }),

  /**
   * 播放视频
   */
  playVideo: throttle(function (e) {
    this.setData({
      playing: true,
    });
    this.videoContext.play();
    this.videoContext.requestFullScreen({
      direction: 90
    });
  }),

  playEnd() {
    this.setData({
      playing: false,
    });
  },

  /**
   * 当开始/继续播放时触发play事件 
   */
  videoOnPlay(res) {
    console.log(res)
    this.pageData.videoPlaying = true;
    this.setData({
      playing: true,
    });
  },

  /**
   * 当暂停播放时触发 pause 事件
   */
  videoOnPause(res) {
    console.log(res)
    this.pageData.videoPlaying = false;
  },


  /**
   * 获取窗口尺寸 (在页面加载成功后调用)
   */
  getViewSize() {
    const query = wx.createSelectorQuery();
    query.select('.cinema-box').boundingClientRect((rect) => {
      this.setData({
        'animationCinema.listWidth': rect.width
      });
    }).exec();
    query.select('.cinema-item').boundingClientRect((rect) => {
      this.setData({
        'animationCinema.itemWidth': rect.width
      });
    }).exec();
  },

  /**
   * 视频详情-开始移动
   */
  startHandle(e) {
    // 开启移动状态
    this.setData({
      'animationVideo.ing': true
    });
  },

  /**
   * 视频详情-移动中
   */
  moveHandle(e) {
    console.log("------moveHandle-----", e)
    console.log("------moveHandle-----", e.changedTouches[0].clientX)
    console.log("------moveHandle-----", e.touches[0].clientX)
    // 触摸位置与view窗口左侧距离
    const offset = e.currentTarget.offsetLeft;
    // 实时移动坐标
    const move = e.touches[0];
    //移动出左屏幕外，不会回调移动结束处理，没有任何响应，这里手动执行移动结束
    if (e.touches[0].clientX < 0) {
      this.endHandle()
    } else {
      // x坐标
      const x = move.pageX;
      // 触摸移动开始位置
      const startX = this.data.animationVideo.startX;
      // 如果是开始移动, 赋值开始位置
      if (startX === 0) {
        this.setData({
          'animationVideo.offset': (offset - x),
          'animationVideo.startX': x,
          'animationVideo.endX': x
        });
      } else {
        this.setData({
          'animationVideo.endX': x
        });
      }
    }
  },

  touchcancel(e) {
    this.endHandle()
    console.log("------touchcancel-----", e)
  },

  /**
   * 视频详情-移动结束
   */
  endHandle(e) {
    // 最小移动距离
    const length = this.data.animationVideo.minMoveLength;
    // 触摸移动开始位置
    const startX = this.data.animationVideo.startX;
    // 触摸移动结束位置
    const endX = this.data.animationVideo.endX;
    // 详情展开状态
    const open = this.data.animationVideo.open;
    // 触摸移动距离
    const move = (endX - startX);
    // 移动距离超过 length 开始动画, 否则恢复原始状态
    if ((move <= -length && !open) || (move >= length && open)) {
      this.setData({
        'animationVideo.startX': 0,
        'animationVideo.endX': 0,
        'animationVideo.ing': false,
        'animationVideo.open': !open
      });
    } else {
      this.setData({
        'animationVideo.startX': 0,
        'animationVideo.endX': 0,
        'animationVideo.ing': false
      });
    }
  },

  /**
   * 影院列表-开始移动
   */
  cinemaStartHandle(e) {
    // 开启移动状态
    this.setData({
      'animationCinema.ing': true
    });
  },

  /**
   * 影院列表-移动中
   */
  cinemaMoveHandle(e) {
    // 实时移动坐标
    const move = e.touches[0];
    // x坐标
    const x = move.pageX;
    // 触摸移动开始位置
    const startX = this.data.animationCinema.startX;
    // 如果是开始移动, 赋值开始位置
    if (startX === 0) {
      this.setData({
        'animationCinema.startX': x,
        'animationCinema.endX': x
      });
    } else {
      this.setData({
        'animationCinema.endX': x,
        'animationCinema.moveX': (x - startX)
      });
    }
  },

  /**
   * 影院列表-移动结束
   */
  cinemaEndHandle(e) {
    // 最小移动距离
    const length = this.data.animationCinema.minMoveLength;
    // 最大数据长度
    const max = this.data.animationCinema.maxDataLength;
    // 显示窗口宽度
    const listWidth = this.data.animationCinema.listWidth;
    // 每一个视图窗口宽度
    const itemWidth = this.data.animationCinema.itemWidth;
    // 当前移动到第几个
    let index = this.data.animationCinema.index;
    // 触摸移动开始位置
    const startX = this.data.animationCinema.startX;
    // 触摸移动结束位置
    const endX = this.data.animationCinema.endX;
    // 触摸移动距离
    const move = (startX - endX);
    // 是否可以开始动画
    const action = (move >= length || move <= -length);
    // 左移动
    if (startX > 0 && move > 0 && action && index < max) {
      // 可移动最大范围
      const scrollWidth = (max * itemWidth) - listWidth;
      // 在可移动范围内
      if (scrollWidth > index * itemWidth) {
        console.log('left');
        index += 1;
      }
    } else if (startX > 0 && move < 0 && action && index > 0) {
      // 右移动
      console.log('right');
      index -= 1;
    }
    if (startX > 0 && move) {
      // 参数恢复默认值
      this.setData({
        'animationCinema.index': index,
        'animationCinema.startX': 0,
        'animationCinema.moveX': 0,
        'animationCinema.ing': false
      }, () => {
        // 可移动最大范围
        const scrollWidth = (max * itemWidth) - listWidth;
        // 在可移动范围内
        if (scrollWidth > index * itemWidth) {
          this.setData({
            'animationCinema.left': -(index * itemWidth)
          });
        } else {
          if (scrollWidth > 0) {
            // 已移动到最右边
            this.setData({
              'animationCinema.left': -scrollWidth
            });
          }
        }
      });
    }
  },
});