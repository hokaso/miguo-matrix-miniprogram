//index.js

var time = require('../../utils/time.js');

var util = require('../../utils/common.js');

const app = getApp()

export const BACK_TOP_POSITION = 1000;

Page({
  data: {
    // i-tab切换页面相关
    current: '1',
    tab1: true,
    tab2: false,
    // 主页所需的各种数据
    activityId: '',
    activityName: '',
    activityProfile: '',
    isShowAd: false,
    activityLive: '',
    activityAd: '',
    activitySharePic: '',
    banners: [],
    votes: [],
    notes: [],
    recommends: [],
    nickName: null,
    getOpenID: null,
    isAuthorize: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')

    // 聊天室相关
    // topPosition: 0,
    // avatarUrl: './user-unlogin.png',
    // userInfo: null,
    // logged: false,
    // takeSession: false,
    // requestResult: '',
    // chatRoomEnvId: 'release-f8415a',
    // chatRoomCollection: 'chatroom',
    // chatRoomGroupId: 'demo',
    // chatRoomGroupName: '聊天室',
    // 在聊天室组件中需要用到的方法
    // onGetUserInfo: null,
  },
  // 初始化
  onLoad: function (options) {
    // 发送网络请求
    this.getLogin()
    this.getInfo()
    this.getActivity()
    // 获得用户手机信息
    wx.getSystemInfo({
      success: res => {
        // console.log('system info', res)
        if (res.safeArea) {
          const { top, bottom } = res.safeArea
          this.setData({
            containerStyle: `padding-top: ${(/ios/i.test(res.system) ? 10 : 20) + top}px; padding-bottom: ${20 + res.windowHeight - bottom}px`,
          })
        }
      },
    })
  },
  // 初始化结束，onShow用来刷新当前页面的
  onShow: function () {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    this.onLoad(currentPage.options);
  },
  // 预加载视频&直播
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  // 下拉刷新，测试使用
  onPullDownRefresh: function (){
    this.onLoad();
    wx.stopPullDownRefresh();
    wx.hideLoading();
  },
  // 监听投票组件是否被点击，检测到被点击的时候执行onShow方法刷新页面
  handleEventListener() {
    this.onShow();
    // console.log('更新票数')
  },
  // 分享页面时执行的操作
  onShareAppMessage: function (ops) {
    var shareObj = {
      title: this.data.activityName,
      path: 'pages/index/index',  // 路径，传递参数到指定页面。
      imageUrl: app.globalData.activitySharePic, // 分享的封面图
    }
    return shareObj;
  },
  // tab分页栏的控制方法
  switchPage({ detail }) {
    var index = detail.key
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
  getLogin(){
    let that = this
    if (!app.checkCache()) {
      
      app.login()
    }
    that.setData({
      // onGetUserInfo: this.onGetUserInfo,
      getOpenID: wx.getStorageSync("openid"),
    })
  },
  getInfo(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }

    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
      })
    }
  },
  getActivity(){
    let that = this
    var data = {
      a: '123',
    }
    util.getAPI("POST", data, 'activity/find_active').then((res) => {
      if (res.data.code === 200) {
        app.globalData.activityId = res.data.data[0].id
        app.globalData.activityName = res.data.data[0].activityName
        app.globalData.activityProfile = res.data.data[0].activityProfile
        app.globalData.activitySharePic = app.globalData.callbackUrl + res.data.data[0].activitySharePic
        that.setData({
          activityId: res.data.data[0].id,
          activityName: res.data.data[0].activityName,
          activityLive: res.data.data[0].activityLive,
          activityAd: res.data.data[0].activityAd,
          activityProfile: res.data.data[0].activityProfile,
        })
      }
      wx.setNavigationBarTitle({
        title: res.data.data[0].activityName,
      })
    }).then(()=>{
      that.getNote()
    }).then(() => {
      that.getBanners()
    }).then(() => {
      that.getVote()
    }).then(() => {
      that.getRecommends()
    })
  },
  //云端根据时间返回当前活动详情
  getNote() {
    let that = this;
    var activityId = this.data.activityId
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
  // 获取轮播图
  getBanners() {
    let that = this;
    let imgArr = [];
    var activityId = this.data.activityId
    var data = {
      id: activityId,
    }
    util.getAPI("GET", data, 'swiper/find_active').then((res) => {
      if (res.data.code === 200) {
        let dataList = res.data.data;
        for (let i = 0; i < dataList.length; i++) {
          imgArr.push(app.globalData.callbackUrl + dataList[i].swiperPic)
        }
        that.setData({
          banners: imgArr
        })
      }
    })
  },
  // 获取投票对象
  getVote(){
    let that = this;
    var activityId = this.data.activityId
    var data = {
      id: activityId,
    }
    util.getAPI("GET", data, 'group/find_active').then((res) => {
      if (res.data.code === 200) {
        let dataList = res.data.data;
        Object.keys(dataList).forEach(key => (dataList[key].groupPicHd = app.globalData.mpCallbackUrl + dataList[key].groupPicHd))
        that.setData({
          votes: dataList
        })
      }
    })
  },
  // 获取参与单位
  getRecommends(){
    let that = this;
    var activityId = this.data.activityId
    var data = {
      id: activityId,
    }
    util.getAPI("GET", data, 'merchant/find_active').then((res) => {
      if (res.data.code === 200) {
        let dataList = res.data.data;
        Object.keys(dataList).forEach(key => (dataList[key].merchantLogo = app.globalData.callbackUrl + dataList[key].merchantLogo))
        that.setData({
          recommends: dataList
        })
      }
    })
  },
  // 边滑动变加载，防爬虫防刷票防卡死
  scrollPosition(e) {
    // 1.获取滚动的顶部
    const position = e.detail.scrollTop;

    // 2.设置是否显示
    this.setData({
      showBackTop: position > BACK_TOP_POSITION,
    })
    wx.createSelectorQuery().select('.src').boundingClientRect((rect) => {
      const show = rect.top > 0
      this.setData({
        showTabControl: !show
      })
    }).exec()
  }
})