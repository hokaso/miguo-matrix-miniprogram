// miniprogram/components/w-vote/w-vote.js

var util = require('../../utils/common.js');

const app = getApp()

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    votesList: {
      type: Array,
      value: []
    },
    openid: String,
    id: String,
    hasAuthorize: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    openid: '',
    votesList: [],
    hasAuthorize: ''
  },



    attached: function () {
      let that = this
      // 在组件实例进入页面节点树时执行
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success(res) {
                app.globalData.userInfo = res.userInfo
                that.setData({
                  hasAuthorize: true
                })
              },
              fail() {
                // console.log("2324")
                that.setData({
                  hasAuthorize: false
                })
              }
            })
          }
          else {
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId 
                app.globalData.userInfo = res.userInfo
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回 
                // 所以此处加入 callback 以防止这种情况 
                if (app.userInfoReadyCallback) {
                  app.userInfoReadyCallback(res)
                }
              }
            }) 
            that.setData({
              hasAuthorize: true
            })
          }
        }
      })
    },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGetUserInfo: function (e) {
      console.log(e.detail.userInfo)
      if (e.detail.userInfo) {
        app.globalData.userInfo = e.detail.userInfo
        wx.showToast({
          title: '已完成授权',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          hasAuthorize: true
        })
        
      } else {
        //用户按了拒绝按钮
        wx.showToast({
          title: '同意授权后投票',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          hasAuthorize: false
        })
      }
      this.triggerEvent('eventListener')
    },



    addVote: function(e){


      console.log(app.globalData.userInfo)
        let that = this;
        var data = {
          groupId: e.currentTarget.id,
          recordOpenid: this.data.openid,
          recordNickname: app.globalData.userInfo.nickName
        }
        // console.log(data)
        util.getAPI("POST", data, 'record/add').then((res) => {
          // console.log(res)
          if (res.data.data === "success") {
            wx.showToast({
              title: '投票成功',
              icon: 'success',
              duration: 2000
            })
          }
          else {
            wx.showToast({
              title: '您已投票',
              icon: 'none',
              duration: 2000
            })
          }
        })
        this.triggerEvent('eventListener')
      }
  }
})