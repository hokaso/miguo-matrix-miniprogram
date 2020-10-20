// miniprogram/pages/vote_detail/vote_detail.js

var util = require('../../utils/common.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_profile:"",
    pic_hd:"",
    activity_filters:"",
    // vote_id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var vote_id = options.id;
    // console.log(options.id)
    this.getCurrentAct(vote_id);
  },
  // 根据活动id获取对象详情
  // 
  getCurrentAct(vote_id){
    let that = this;
    var data = {
      id: vote_id,
    }
    util.getAPI("GET", data, 'group/find_group_id').then((res) => {
      if (res.data.code === 200) {
        console.log(res.data.data)
        let groupInfo = res.data.data;
        groupInfo.groupPicHd = app.globalData.callbackUrl + groupInfo.groupPicHd
        that.setData({
          groupPicHd: groupInfo.groupPicHd,
          groupName: groupInfo.groupName,
          groupProfile: groupInfo.groupProfile

        })
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
})