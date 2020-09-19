const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myFavors: [],
    dataIndex: 0
  },

  //查看工作详情
  jobDetail(e) {
    wx.setStorageSync('jobDetail', e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/jobDetail/jobDetail',
    })
  },

  //查询用户收藏的职位
  loadFavor() {
    let _this = this
    wx.showLoading({
      title: '加载中'
    })
    db.collection('favor').where({
      _openid: wx.getStorageSync('openid')
    })
      .orderBy('favorTime', 'desc')
      .get({
        success(res) {
          wx.hideLoading()
          _this.setData({
            myFavors: res.data
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadFavor()
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
    let myFavors = this.data.myFavors
    if (myFavors.length >= 20) {
      let _this = this
      let dataIndex = this.data.dataIndex + 20
      wx.showLoading({
        title: '加载中'
      })
      db.collection('favor').where({
        _openid: wx.getStorageSync('openid')
      })
        .orderBy('favorTime', 'desc')
        .skip(dataIndex)
        .get({
          success(res) {
            wx.hideLoading()
            if (res.data.length != 0) {
              _this.setData({
                myFavors: myFavors.concat(res.data),
                dataIndex: dataIndex
              })
            } else {
              wx.showToast({
                title: '没有更多了',
                icon: 'none'
              })
              _this.setData({
                dataIndex: dataIndex - 20
              })
            }
          }
        })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})