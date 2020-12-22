const http = require('./utils/api.js');
const config = require('./utils/config.js');
const sha256 = require('./utils/sha256.js');
let app;

// app.js
App({
  onLaunch: function () {
    app = this
    this.logText = `v${this.version}\n`;
    this.getTheme();
    this.registerMossEventListener();
    this.initImgPress();
    this.screenAdapt()
  },
  // API域名
  domain: http.domain.prod,
  // AppId
  appId: '60022',
  // 版本号
  version: '6.0.60.20200831',

  // 日志文本
  logText: '',
  // 日志计时器
  logTimer: null,

  // 图片压缩域名
  scaleDomain: 'http://service-if5lmf7q-1251316161.gz.apigw.tencentcs.com/test/wecar/',
  // 全局参数
  globalData: {
    userInfo: null,
    theme: {
      colorStyle: 'dark',
      backgroundColor: 'transparent'
    },
    canUseImgCompress: false,
    imgCompresDomain: "",

  },
  // 小程序默认配色
  defaultTheme: {
    light: {
      colorStyle: 'light',
      backgroundColor: '#edf0f6'
    },
    dark: {
      colorStyle: 'dark',
      backgroundColor: '#30303e'
    }
  },


  // 屏幕分辨率适配
  screenAdapt(page) {
    const sysInfo = wx.getSystemInfoSync();
    const width = sysInfo.screenWidth;
    const height = sysInfo.screenHeight;
    const width1 = sysInfo.windowWidth;
    const height1 = sysInfo.windowHeight;
    this.globalData.winWidth = width;
    this.globalData.winHeight = height;
    const rate = width / height;
    this.log(`screenWidth:${width}`, `screenHeight:${height}`);
    this.log(`windowWidth:${width1}`, `windowHeight:${height1}`);
    this.log("---sysInfo----",sysInfo)
    // let adaptClass = '';
    // // console.log(rate)
    // // 默认1920*720，不设置特殊样式，
    // if (rate < 2.2) {
    //   adaptClass = 'w1280h720';
    // }
    // page.setData({
    //   adaptClass
    // });
  },

  // 列表缓存
  listCache: {
    refresh: true,
    lat: 0,
    lng: 0,
    data: {}
  },
  // 详情缓存
  detailCache: {
    refresh: true,
    index: [],
    max: 15,
    data: {}
  },
  // 刷新列表缓存
  refreshListCache(stamp, data, lat, lng) {
    const cache = 'listCache';
    this[cache].refresh = false;
    this[cache].lat = lat;
    this[cache].lng = lng;
    this[cache].data = {};
    this[cache].data[stamp] = data;
  },
  // 刷新详情缓存
  refreshDetailCache(stamp, data) {
    const cache = 'detailCache';
    this[cache].refresh = false;
    if (!this[cache].data[stamp]) {
      this[cache].index = [];
      this[cache].data = {};
      this[cache].data[stamp] = {};
    }
    if (!this[cache].data[stamp][data.detail.id] && this[cache].index.length >= this[cache].max) {
      delete this[cache].data.id;
    }
    this[cache].data[stamp][data.detail.id] = data;
  },
  // 获取日期时间戳
  getDateStamp() {
    const now = new Date();
    return `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}`;
  },

  // 获取页面配色
  getTheme: function () {
    // app.log("----执行getTheme--"+(typeof wx.getColorStyle === 'function'))
    if (typeof wx.getColorStyle === 'function') {
      wx.getColorStyle({
        success: (res) => {
          app.globalData.theme.colorStyle = res.colorStyle
          app.globalData.theme.backgroundColor = res.backgroundColor.length < 8 ? res.backgroundColor : (res.colorStyle == 'dark' ? '#30303e' : '#edf0f6')
          // app.log("----getTheme--", res)
          const pages = getCurrentPages();
          if (pages) {
            for (var i = 0; i < pages.length; i++) {
              // app.log("----pages--setTheme--")
              pages[i].setData({
                colorStyle: res.colorStyle,
                backgroundColor: res.backgroundColor.length < 8 ? res.backgroundColor : (res.colorStyle == 'dark' ? '#30303e' : '#edf0f6')
              })
            }
          }
        },
      });
    } else {
      const resTheme = {
        colorStyle: 'dark',
        backgroundColor: '#30303e'
      };
      // app.log("----getTheme--无该方法wx.getColorStyle ")
      this.globalData.theme = resTheme;
    }
  },

  // 设置页面配色 页面需要持续监听
  setTheme(page, callback) {
    const colorStyle = app.globalData.theme.colorStyle
    // app.log("----执行setTheme--"+(wx.canIUse('onColorStyleChange')),app.globalData.theme)
    page.setData({
      colorStyle: colorStyle,
      backgroundColor: app.globalData.theme.backgroundColor.length < 8 ? app.globalData.theme.backgroundColor : (colorStyle == 'dark' ? '#30303e' : '#edf0f6')
    })
    if (wx.canIUse('onColorStyleChange')) {
      wx.onColorStyleChange((res) => {
        app.globalData.theme.colorStyle = res.colorStyle
        app.globalData.theme.backgroundColor = res.backgroundColor.length < 8 ? res.backgroundColor : (res.colorStyle == 'dark' ? '#30303e' : '#edf0f6')
        page.setData({
          colorStyle: res.colorStyle,
          backgroundColor: res.backgroundColor.length < 8 ? res.backgroundColor : (res.colorStyle == 'dark' ? '#30303e' : '#edf0f6')
        })
        // app.log("----onColorStyleChange--", res)
      })

      if (callback && typeof callback === 'function') {
        callback()
      }
    }
  },

  // 通过经纬度计算距离，单位km
  getDistance: function (lat1, lng1, lat2, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    return s
  },

  /**
   * 初始化图片压缩
   */
  initImgPress: function () {
    let that = this
    let canUseImgCompress = false;
    let imgCompresDomain = "";
    if (wx.canIUse('getMossApiSync') && wx.canIUse('getMossApi')) {
      const ret = wx.getMossApiSync({
        type: "image-compress"
      })
      if (typeof ret == null || ret == "" || ret == "undefined") {
        wx.getMossApi({
          type: "image-compress",
          success(ret) {
            that.globalData.canUseImgCompress = true;
            that.globalData.imgCompresDomain = ret.url;
          },
        });
      } else {
        canUseImgCompress = true;
        imgCompresDomain = ret;
      }
    }
    this.globalData.canUseImgCompress = canUseImgCompress;
    this.globalData.imgCompresDomain = imgCompresDomain;
  },


  /**
   * 压缩图片
   */
  impressImg(imgUrl, widthheight) {
    const originImg = imgUrl;
    let impressImg = '';
    const canUseImgCompress = this.globalData.canUseImgCompress;
    const imgCompresDomain = this.globalData.imgCompresDomain;
    if (canUseImgCompress) { //可以使用压缩服务
      if (imgCompresDomain.length > 0) { //压缩域名获取成功
        const encodeImgUrl = encodeURIComponent(imgUrl);
        if (widthheight) {
          impressImg = `${imgCompresDomain}${widthheight}&url=${encodeImgUrl}`;
        } else {
          impressImg = `${imgCompresDomain}w=400&h=544&url=${encodeImgUrl}`;
        }
      } else { //压缩域名获取失败
        this.initImgPress();
        impressImg = ''; //显示默认图
      }
    } else { //不可以使用压缩服务，pad环境使用原图
      impressImg = originImg;
    }
    return impressImg;
  },

  /*
   * GET请求
   */
  get: function (param, callback) {
    this.http(param, 'GET', callback);
  },
  /*
   * POST请求
   */
  post: function (param, callback) {
    this.http(param, 'POST', callback);
  },
  /*
   * http请求
   */
  http: function (param, method, callback) {
    const that = this;
    const logDomain = http.domain.test;
    const url = http.api[param.url];

    const query = {
      charset: 'utf-8',
      clientInfo: 'iPhone',
      data: param.data ? param.data : {},
      partnerId: config.id,
      signType: 'sha256',
      timestamp: parseInt(new Date().getTime() / 1000)
    };
    // 获取签名
    query.sign = this.getsign(query);
    console.log(JSON.stringify(query));
    // app.log("----请求参数-----",query)
    console.log("--请求参数"+JSON.stringify(query))
    console.log("--请求URL",url)
    wx.request({
      url: this.domain + url,
      data: query,
      header: {
        'content-type': 'application/json'
      },
      method: method,
      dataType: 'json',
      success: function (res) {
        // app.log("----请求成功-----"+(new Date().getTime()),res)
        callback(res.data);
        that.uploadLog(logDomain + url, query, res.data);
      },
      fail: function (err) {
        // app.log("----请求失败-----",err)
        console.log(err);
        const retcode = err.errMsg == 'request:fail timeout' ? 408 : 500;
        callback({
          retcode: retcode,
          retmsg: '',
          data: null
        });
        if (retcode === 408) {
          wx.showToast({
            title: '网络请求超时',
            icon: 'none'
          });
        }
        that.uploadLog(logDomain + url, query, err.data);
        wx.hideLoading();
      },
      complete: function () {
        // app.log("----请求结束complete-----")
      }
    });
  },

  /**
   * 签名
   */
  getsign: function (param) {
    const data = {};
    for (const key in param) {
      data[key] = param[key];
    }
    // 设置排序 a-z
    function sortHandle(obj) {
      const arr = [];
      for (const key in obj) {
        arr.push(key);
      }
      arr.sort();
      const newObj = {};
      for (const index in arr) {
        newObj[arr[index]] = obj[arr[index]];
      }
      return JSON.stringify(newObj);
    }
    data.data = sortHandle(data.data);
    // 拼接字符串
    let str = '';
    str += `charset=${data.charset}`;
    str += `&clientInfo=${data.clientInfo}`;
    str += `&data=${data.data}`;
    // KEY
    str += `&key=${config.key}`;
    str += `&partnerId=${config.id}`;
    str += `&signType=${data.signType}`;
    str += `&timestamp=${data.timestamp}`;
    // console.log('sign--->', str)
    return sha256(str);
  },
  uploadLog: function (url, request, result) {
    const data = {
      type: 0,
      apiUrl: url,
      request: JSON.stringify(request),
      result: JSON.stringify(result),
    };
    this.logHttp(data);
  },
  // 注册语音指令
  registerMossEventListener: function () {
    if (wx.canIUse('addMossEventListener')) {
      wx.addMossEventListener({
        mossSpeech: ['版本号', '当前版本号', '切换模式']
      }, this.onSpeechSkillCommand);
    }
  },
  // 响应语音指令
  onSpeechSkillCommand: function (res) {
    const that = this;
    const content = res.skillCommand.parameters.content;

    if (content == '版本号' || content == "当前版本号") {
      console.log('识别语音版本号');
      // 语音播报版本号
      wx.playTTS({
        content: `当前版本号${that.version}`, // 字符串，播报内容。如果前面没播完，会被后面的覆盖。
        volume: 50
      });
      wx.showToast({
        title: `版本号${that.version}`,
      });
    } else if (content == '切换模式') {
      const colorStyle = getApp().theme.colorStyle == 'dark' ? 'light' : 'dark';
      wx.setStorageSync('colorStyle', colorStyle);
      wx.showToast({
        title: `已切换至：${colorStyle}模式，请切换小程序后重新进入应用`,
      });
    }
  },
  onError(msg) {
    wx.hideLoading();
    this.msg = msg;
    const data = {
      type: 1,
      request: msg
    };
    this.logHttp(data);
  },
  logHttp: function (data) {
    const query = {
      charset: 'utf-8',
      clientInfo: 'iPhone',
      data: data ? data : {},
      partnerId: config.id,
      signType: 'sha256',
      timestamp: parseInt(new Date().getTime() / 1000),
      token: '95020983a91f13b026c58475f9017f5c45611080520183ecccbaf5f8c4a7c7ea',
      userId: 10001
      // 用户ID
    };
    // 获取签名
    query.sign = this.loggetsign(query);
    wx.request({
      url: http.logUrl,
      data: query,
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      dataType: 'json',
    });
  },
  // log验签
  loggetsign: function (param) {
    const data = {};
    for (const key in param) {
      data[key] = param[key];
    }
    // 设置排序 a-z
    function sortHandle(obj) {
      const arr = [];
      for (const key in obj) {
        arr.push(key);
      }
      arr.sort();
      const newObj = {};
      for (const index in arr) {
        newObj[arr[index]] = obj[arr[index]];
      }
      return JSON.stringify(newObj);
    }
    data.data = sortHandle(data.data);
    // 拼接字符串
    let str = '';
    str += `charset=${data.charset}`;
    str += `&clientInfo=${data.clientInfo}`;
    str += `&data=${data.data}`;
    // KEY
    str += `&key=${config.key}`;
    str += `&partnerId=${config.id}`;
    str += `&signType=${data.signType}`;
    str += `&timestamp=${data.timestamp}`;
    str += `&token=${data.token}`;
    str += `&userId=${data.userId}`;
    // console.log('sign--->', str)
    return sha256(str);
  },

  /**
   * 记录日志
   */
  log(str, object) {
    // return
    this.logText += str + '\n'
    if (object) {
      this.logText += JSON.stringify(object) + '\n'
      console.log(JSON.stringify(object) + '\n')
    }
  }
});