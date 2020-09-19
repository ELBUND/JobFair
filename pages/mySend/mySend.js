const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mySends: [],
    dataIndex: 0
  },

  //查询用户所投递的职位
  searchSend() {
    let _this = this
    let openid = wx.getStorageSync('openid')
    let mySends = []
    wx.showLoading({
      title: '加载中'
    })
    db.collection('company_mailbox').where({
      _openid: openid
    })
      .orderBy('deliveryTime', 'desc')
      .get({
        success(res) {
          if (res.data.length != 0) {
            for (let i = 0; i < res.data.length; i++) {
              mySends.push(new Promise((reslove, reject) => {
                db.collection('jobs_school').where({
                  companyid: res.data[i].companyid,
                  name: res.data[i].name
                }).get({
                  success(res) {
                    reslove(res.data[0])
                  }
                })
              }))
            }
            //等待查询完成
            Promise.all(mySends).then(allSends => {
              wx.hideLoading()
              _this.setData({
                mySends: allSends
              })
            })
          } else {
            wx.hideLoading()
            _this.setData({
              mySends: []
            })
          }
        }
      })
  },

  //跳转职位详情
  jobDetail(e) {
    wx.setStorageSync('jobDetail', e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/jobDetail/jobDetail',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.searchSend()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  //触底加载更多
  onReachBottom() {
    let mySends = this.data.mySends
    if (mySends.length >= 20) {
      let _this = this
      let dataIndex = this.data.dataIndex + 20
      let openid = wx.getStorageSync('openid')
      wx.showLoading({
        title: '加载中'
      })
      db.collection('company_mailbox').where({
        _openid: openid
      })
        .orderBy('deliveryTime', 'desc')
        .skip(dataIndex)
        .get({
          success(res) {
            if (res.data.length != 0) {
              for (let i = 0; i < res.data.length; i++) {
                mySends.push(new Promise((reslove, reject) => {
                  db.collection('jobs_school').where({
                    companyid: res.data[i].companyid,
                    name: res.data[i].name
                  }).get({
                    success(res) {
                      reslove(res.data[0])
                    }
                  })
                }))
              }
              //等待查询完成
              Promise.all(mySends).then(allSends => {
                wx.hideLoading()
                _this.setData({
                  mySends: allSends,
                  dataIndex: dataIndex
                })
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
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})