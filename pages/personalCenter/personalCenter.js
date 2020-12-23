const app = getApp()

Page({
  data: {
    screen: app.globalData.screen,
    colorStyle: app.globalData.theme.colorStyle,
    backgroundColor: app.globalData.theme.backgroundColor,
    avatar: '',
    userName: '',
    data: [{
      type: 'order',
      icon: '/images/icon-personCenter.png',
      title: '类目一'
    }, {
      type: 'coupon',
      icon: '/images/icon-personCenter.png',
      title: '类目二'
    }, {
      type: 'VIP',
      icon: '/images/icon-personCenter.png',
      title: '类目三'
    }, {
      type: 'us',
      icon: '/images/icon-personCenter.png',
      title: '类目四'
    }] ,
    isLogin: app.globalData.haveLogin,
    withCredentials: true,
    userInfo: null,
    debugLog: '',
    songInfo: {},
    initPgae: false
  },
  // 调用组件方法
  nofityComponent (e) {
    let callback
    let val = e.currentTarget.dataset.state
    switch (val) {
      case 'login': // 登录
        callback = this.loginIn
        break;
      case 'out': // 退出登录
        callback = this.loginOut
        break;
      default:
        break;
    }
    this.bgConfirm = this.selectComponent('#bgConfirm1')
    this.bgConfirm.hideShow(true, val, callback)
  },
  // 微信登录获取code
  loginIn () {
    console.log(111111111111111)
    const that = this
    wx.login({ // 重新登录
      success: function (res) {
        if (res.code) {
          // 测试开始
          wx.getUserInfo({
            success: function (res) {
              console.log(JSON.stringify(res))
              
              const userInfo = res.userInfo
              const nickName = userInfo.nickName
              const avatarUrl = userInfo.avatarUrl

              app.globalData.haveLogin = true
              that.setData({
                avatar: avatarUrl,
                userName: nickName,
                isLogin: app.globalData.haveLogin
              })
            }
          })
          // 测试结束


          console.log(2220000000022)
          // 改变登录状态
          app.globalData.haveLogin = true
          // 车联登录需要的环境
          // that.code2Session(res.code)

        } else {
          wx.showToast({
            title: '获取code失败',
          });
        }
      },
      fail: function(err) {
        console.log(err)
      }
    });
  },  

  // 把code发至SP后台换取session_key,
  // 1.demo中调用code2Session后code无效，需要重新login获取
  // 2.code 5分钟后失效
  code2Session: function(code) {
    let that = this
    let requestData = {
      "appid": app.appid,
      "nonce": app.nonce,
      "timestamp": String(Date.now()),
      "version": app.version,
      "code": code
    }

    let sign = app.getsign(requestData)
    requestData.sign = sign

    wx.request({
      url: 'http://api.wecar.map.qq.com/account/mini/code2session',
      method: 'POST',
      data: requestData,
      success: function (res) {
        console.log(3333333333333333)
        console.log(JSON.stringify(res))
        that.setData({
          debugLog: that.data.debugLog + "\nCode2Sesssion:" + JSON.stringify(res)
        })

        if (res.data.errcode == 0) {
          console.log(4444444444444444444)
          // Request success
          console.log(JSON.stringify(res.data))
          app.globalData.openid = res.data.data.openid //腾讯车联开放平台openid,保存用于getUserInfo
          var sessionKey = res.data.data.session_key //会话密钥,demo后台会持久化session_key，用于解密getUserInfo
          var unionid = res.data.data.unionid //用户在开放平台的唯一标识符，在满足 UnionID 下发条件的情况下会返回
          
          // 登录后获取用户信息
          that.getUserInfo()
        } else {
          console.log(555555555555555)
          // Request failed
          console.log(JSON.stringify(res))
        }
      },
      fail: function (res) {
        console.log(666666666666666)
        that.setData({
          debugLog: that.data.debugLog + "\nCode2Sesssion:" + JSON.stringify(res)
        })
        console.log(JSON.stringify(res))
      }
    })
  },

  getUserInfo () {
    var that = this
    var openid = app.globalData.openid;
    console.log('444444------111111')
    if (openid) {
      // Has login
      _getUserInfo(openid, this.data.withCredentials)
    } else {
      // No login before
      this.setData({
        debugLog: "getUserInfo failed, 请先登录"
      })
      return
    }

    function _getUserInfo(openid, withCredentials) {
      console.log('444444------22222')
      wx.getUserInfo({
        withCredentials: withCredentials,
        success: function (res) {
          console.log(JSON.stringify(res))
          console.log('444444------333333')
          that.setData({
            userInfo: res.userInfo,
            debugLog: JSON.stringify(res)
          })
          
          const userInfo = res.userInfo
          const nickName = userInfo.nickName
          const avatarUrl = userInfo.avatarUrl
          const gender = userInfo.gender // 性别 0：未知、1：男、2：女
          const province = userInfo.province
          const city = userInfo.city
          const country = userInfo.country

          const rawData = res.rawData
          const signature = res.signature 

          that.setData({
            avatar: avatarUrl,
            userName: nickName,
            isLogin: app.globalData.haveLogin
          })

          if (withCredentials) {
            const encryptedData = res.encryptedData
            const iv = res.iv

            // 发至SP后台，用session_key解密 暂时没有URL
            // that.getUserInfoFromServer(encryptedData, iv, openid)
          }
        },
        fail: function (res) {
          console.log('444444------444444')
          that.setData({
            debugLog: JSON.stringify(res)
          })

          const errMsg = res.errMsg
        }
      })
    }
  },
  
  // 退出登录
  loginOut () {
    app.globalData.haveLogin = false
    this.setData({
      avatar: '/images/icon-admin.png',
      userName: '暂未登录',
      isLogin: app.globalData.haveLogin
    })
  },
  onLoad(options) {
  }
})