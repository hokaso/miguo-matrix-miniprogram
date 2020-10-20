// miniprogram/pages/propaganda/propaganda.js

var time = require('../../utils/time.js');

var util = require('../../utils/common.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notesList:[],
    current: '1',
    tab1: true,
    tab2: false,
    activityProfile: '',
    notes: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAct();
    this.getNote();
  },
  //发请求给云函数，云端根据时间返回当前活动详情（不同的时间返回的值是不一样的，由人工控制）
  getAct() {
    let that = this; 
    that.setData({
      activityProfile: app.globalData.activityProfile
    })
    wx.setNavigationBarTitle({
      title: app.globalData.activityName,
    })
  },
  getNote() {
    let that = this;
    var activityId = app.globalData.activityId
    var data = {
      id: activityId,
    }
    util.getAPI("GET", data, 'note/find_active').then((res) => {
      if (res.data.code === 200) {
        let dataList = res.data.data;
        Object.keys(dataList).forEach(key => (dataList[key].noteDisplayTime = time.js_date_time(dataList[key].noteDisplayTime)))
        that.setData({
          notes: dataList
        })
      }
    })
  },
  switchPage({ detail }) {
    var index = detail.key
    // console.log(detail.key)
    this.setData({
      current: detail.key
    });
    if (index == 1) {
      this.setData({
        tab1: true,
        tab2: false
      })
    } else if (index == 2) {
      this.setData({
        tab1: false,
        tab2: true
      })
    }
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
  onShareAppMessage: function (ops) {
    var shareObj = {
      title: app.globalData.activityName,
      path: 'pages/index/index',  // 路径，传递参数到指定页面。
      imageUrl: app.globalData.activitySharePic, // 分享的封面图
    }
  }
})