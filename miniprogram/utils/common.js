const app = getApp()

function getAPI(x_method, data, x_url) {
  return new Promise(function (resolve, reject) {
    var f_url = app.globalData.serverAddr + x_url
    wx.request({
      url: f_url,
      method: x_method,
      data: data,
      success: function (res) {
        resolve(res);
      },
      fail: () => {
        reject("系统异常，请重试！")
      }
    })
  })
}
module.exports = {
  getAPI: getAPI
}
