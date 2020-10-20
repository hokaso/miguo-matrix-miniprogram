// miniprogram/pages/vote/vote.js

var util = require('../../utils/common.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankList: [],
    nickName: null,
    votes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getActivity();
    this.getRank();
    this.getVote();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log(res.userInfo)
              this.setData({
                nickName: res.userInfo.nickName,
              })
            }
          })
        }
      }
    })
  },
  onShareAppMessage: function (ops) {
    var shareObj = {
      title: this.data.activityName,
      path: 'pages/index/index',  // 路径，传递参数到指定页面。
      imageUrl: app.globalData.activitySharePic, // 分享的封面图
    }

    return shareObj;
  },

  getActivity() {
    let that = this
    wx.setNavigationBarTitle({
      title: app.globalData.activityName,
    })
  },
  getRank() {
    let that = this;
    var activityId = app.globalData.activityId
    var data = {
      id: activityId,
    }
    util.getAPI("GET", data, 'group/find_rank').then((res) => {
      if (res.data.code === 200) {
        let dataList = res.data.data;
        // console.log(dataList)
        Object.keys(dataList).forEach(key => (dataList[key].groupPicHd = app.globalData.mpCallbackUrl + dataList[key].groupPicHd))
        that.setData({
          rankList: dataList
        })
      }
    })
  },
  getVote() {
    let that = this;
    var activityId = app.globalData.activityId
    var data = {
      id: activityId,
    }
    util.getAPI("GET", data, 'group/find_active').then((res) => {
      if (res.data.code === 200) {
        let dataList = res.data.data;
        // console.log(dataList)
        Object.keys(dataList).forEach(key => (dataList[key].groupPicHd = app.globalData.mpCallbackUrl + dataList[key].groupPicHd))
        that.setData({
          votes: dataList
        })
      }
    })
  },
  handleEventListener() {
    this.onShow();
    console.log('更新票数')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    this.onLoad(currentPage.options);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
})