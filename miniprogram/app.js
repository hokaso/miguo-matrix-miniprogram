//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },
  globalData: {
    userInfo: null,
    activityId: '',
    activityName: '',
    activityProfile: '',
    callbackUrl: 'https://migotimes.com/file/',
    mpCallbackUrl: 'https://migotimes.com/file/thumbnails/mp',
    serverAddr: 'https://migotimes.com/client_miniprogram/',
  },
  /**
   * 校验缓存
   */
  checkCache: function () {
    if (wx.getStorageSync("session_key") && wx.getStorageSync("openid")) {
      return true
    } else {
      return false
    }
  },
  /**
   * 微信用户登录
   */
  login: function () {
    var that = this
    if (this.checkCache()) {
      return
    }
    wx.showLoading({
      title: '正在获取用户凭证',
      mask: true
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.setStorageSync('wxCode', res.code);
          var _url = this.globalData.serverAddr
          wx.request({
            url: _url + 'user/login',
            method: 'POST',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              if (res.data.openid != "" || res.data.data.openid != null) {
                // 登录成功
                wx.setStorageSync("openid", res.data.data.openid);//将用户id保存到缓存中
                wx.setStorageSync("session_key", res.data.data.session_key);//将session_key保存到缓存中
                console.log('获取授权成功');
              }
            }
          })
          
        }
      },
      fail: function () {
        wx.removeStorageSync(that.globalData.openid)
        wx.showToast({
          title: '获取用户凭证失败',
          icon: 'none',
          duration: 3000
        })
      },
      timeout: function () {
        wx.removeStorageSync(that.globalData.openid)
        wx.showToast({
          title: '获取用户凭证超时',
          icon: 'none',
          duration: 3000
        })
      }
    })
    wx.hideLoading()
  },
})
