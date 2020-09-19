//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: "sdb-0bdlv"
    })

    //云函数获取用户openid
    wx.cloud.callFunction({
      name: 'getOpenid',
      success(res) {
        //缓存到本地
        wx.setStorageSync('openid', res.result)
      }
    })

  },
  globalData: {
  }
})