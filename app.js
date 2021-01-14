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
    this.screenAdapt()
    // 判断横竖屏
    if (wx.getSystemInfoSync().windowWidth > wx.getSystemInfoSync().windowHeight) {
      this.globalData.screen = 'h'
    } else {
      this.globalData.screen = 'v'
    }
  },
  // API域名
  domain: http.domain.prod,
  // AppId
  appId: '60022',
  nonce: 'aDwQZGXgI',
  version: '1.0',
  // 日志文本
  logText: '',
  // 全局参数
  globalData: {
    userInfo: null,
    haveLoginL: false,
    screen: '',
    theme: {
      colorStyle: 'dark',
      backgroundColor: 'transparent'
    },
  },
  // 小程序默认配色
  defaultTheme: {
    light: {
      colorStyle: 'light',
      backgroundColor: '#edf0f6'
    },
    dark: {
      colorStyle: 'dark',
      backgroundColor: '#151515'
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
    // this.log(`windowWidth:${width1}`, `windowHeight:${height1}`);
    // this.log("---sysInfo----",sysInfo)
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
          app.globalData.theme.backgroundColor = res.backgroundColor.length < 8 ? res.backgroundColor : (res.colorStyle == 'dark' ? '#151515' : '#edf0f6')
          // app.log("----getTheme--", res)
          const pages = getCurrentPages();
          if (pages) {
            for (var i = 0; i < pages.length; i++) {
              // app.log("----pages--setTheme--")
              pages[i].setData({
                colorStyle: res.colorStyle,
                backgroundColor: res.backgroundColor.length < 8 ? res.backgroundColor : (res.colorStyle == 'dark' ? '#151515' : '#edf0f6')
              })
            }
          }
        },
      });
    } else {
      const resTheme = {
        colorStyle: 'dark',
        backgroundColor: '#151515'
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
      backgroundColor: app.globalData.theme.backgroundColor.length < 8 ? app.globalData.theme.backgroundColor : (colorStyle == 'dark' ? '#151515' : '#edf0f6')
    })
    if (wx.canIUse('onColorStyleChange')) {
      wx.onColorStyleChange((res) => {
        app.globalData.theme.colorStyle = res.colorStyle
        app.globalData.theme.backgroundColor = res.backgroundColor.length < 8 ? res.backgroundColor : (res.colorStyle == 'dark' ? '#151515' : '#edf0f6')
        page.setData({
          colorStyle: res.colorStyle,
          backgroundColor: res.backgroundColor.length < 8 ? res.backgroundColor : (res.colorStyle == 'dark' ? '#151515' : '#edf0f6')
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

  onError(msg) {
    wx.hideLoading();
    this.msg = msg;
    const data = {
      type: 1,
      request: msg
    };
  },

  /**
   * 记录日志
   */
  log(str, object) {
    // return
    this.logText += str + '\n'
    if (object) {
      this.logText += JSON.stringify(object) + '\n'
      // console.log(JSON.stringify(object) + '\n')
    }
  }
});