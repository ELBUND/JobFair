const db = wx.cloud.database()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userCV: {},
    emty: {},
    hasCV: false
  },

  //跳转创建简历
  creatCV() {
    wx.navigateTo({
      url: '/pages/myCV/changeCV',
    })
  },

  //跳转修改简历
  changeCV() {
    if (Object.keys(this.data.userCV).length > 0) {
      wx.setStorageSync('myCV', this.data.userCV)
    }
    wx.navigateTo({
      url: '/pages/myCV/changeCV'
    })
  },

  //查询云数据库有无此用户的记录
  searchCV() {
    let _this = this
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('CV').where({
      _openid: wx.getStorageSync('openid')
    }).get({
      success(res) {
        wx.hideLoading()
        if (res.data.length != 0) {
          _this.setData({
            userCV: res.data[0],
            hasCV: true
          })
        } else {
          _this.setData({
            userCV: {},
            hasCV: false
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.searchCV()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})