// miniprogram/pages/promotion/promotion.js

var util = require('../../utils/common.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchant:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMerchant();
  },

  getMerchant() {
    let that = this;
    var activityId = app.globalData.activityId
    var data = {
      id: activityId,
    }
    util.getAPI("GET", data, 'merchant/find_active').then((res) => {
      if (res.data.code === 200) {
        let dataList = res.data.data;
        Object.keys(dataList).forEach(key => (dataList[key].merchantLogo = app.globalData.callbackUrl + dataList[key].merchantLogo))
        that.setData({
          merchant: dataList
        })
      }
    })
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
})