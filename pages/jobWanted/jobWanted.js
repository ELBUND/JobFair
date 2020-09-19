// pages/jobWanted/jobWanted.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobWanted: ''
  },

  //选择期望职位
  choose() {
    wx.navigateTo({
      url: '/pages/jobWanted/choose',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('jobWanted')) {
      this.setData({
        jobWanted: wx.getStorageSync('jobWanted')
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})