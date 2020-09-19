const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobs: [],
    dataIndex: 0
  },

  //跳转职位详情
  jobDetail(e) {
    wx.setStorageSync('jobDetail', e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/jobDetail/jobDetail?isCompany=yes'
    })
  },

  //创建职位
  jobCreat() {
    wx.navigateTo({
      url: '/pages/jobCreat/jobCreat',
    })
  },

  //查询发布的职位
  searchJobs() {
    let _this = this
    let companyid = wx.getStorageSync('company').companyid
    wx.showLoading({
      title: '加载中...'
    })
    db.collection('jobs_school').where({
      companyid: companyid
    })
      .orderBy('postTime', 'desc')
      .get({
        success(res) {
          wx.hideLoading()
          _this.setData({
            jobs: res.data,
            dataIndex: 0
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.searchJobs()
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
    let _this = this
    let dataIndex = this.data.dataIndex + 20
    let jobs = this.data.jobs
    let companyid = wx.getStorageSync('company').companyid
    wx.showLoading({
      title: '加载中...'
    })
    db.collection('jobs_school').where({
      companyid: companyid
    })
      .skip(dataIndex)
      .orderBy('postTime', 'desc')
      .get({
        success(res) {
          if (res.data.length != 0) {
            wx.hideLoading()
            _this.setData({
              jobs: jobs.concat(res.data)
            })
          } else {
            wx.hideLoading()
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})