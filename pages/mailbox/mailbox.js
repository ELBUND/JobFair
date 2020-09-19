const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyid: '',
    nav: ['未通过', '已通过'],
    current: 0,
    noPass: [],
    Pass: [],
    num_noPass: 0,
    num_Pass: 0
  },

  //切换选项卡
  switchNav(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      current: index
    })
    if (index == 0) {
      this.searchNoPass()
    } else if (index == 1) {
      this.searchPass()
    }
  },

  //查询未通过的投递
  searchNoPass() {
    let _this = this
    wx.showLoading({
      title: '加载中'
    })
    db.collection('company_mailbox').where({
      companyid: this.data.companyid,
      status: 'wait'
    })
      .orderBy('deliveryTime', 'desc')
      .get({
        success(res) {
          wx.hideLoading()
          _this.setData({
            noPass: res.data
          })
        }, fail() {
          wx.hideLoading()
          wx.showToast({
            title: '出错了,请稍后重试',
            icon: 'none'
          })
        }
      })
  },

  //查询已通过的投递
  searchPass() {
    let _this = this
    wx.showLoading({
      title: '加载中'
    })
    db.collection('company_mailbox').where({
      companyid: this.data.companyid,
      status: 'pass'
    })
      .orderBy('deliveryTime', 'desc')
      .get({
        success(res) {
          wx.hideLoading()
          _this.setData({
            Pass: res.data
          })
        }, fail() {
          wx.hideLoading()
          wx.showToast({
            title: '出错了,请稍后重试',
            icon: 'none'
          })
        }
      })
  },

  //跳转投递者详情页
  detail(e) {
    wx.setStorageSync('detail', e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/mailbox/checkCV',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let companyid = wx.getStorageSync('company').companyid
    this.setData({
      companyid: companyid
    })
    this.searchNoPass()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let current = this.data.current
    if (current == 0) {
      this.searchNoPass()
    } else if (current == 1) {
      this.searchPass()
    }
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
    let current = this.data.current  //当前的选项卡
    //未通过 加载更多
    if (current == 0) {
      let num_noPass = this.data.num_noPass + 20
      let noPass = this.data.noPass
      wx.showLoading({
        title: '加载中'
      })
      db.collection('company_mailbox').where({
        companyid: _this.data.companyid,
        status: 'wait'
      })
        .orderBy('deliveryTime', 'desc')
        .skip(num_noPass)
        .get({
          success(res) {
            wx.hideLoading()
            if (res.data.length != 0) {
              _this.setData({
                noPass: noPass.concat(res.data),
                num_noPass: num_noPass
              })
            } else {
              _this.setData({
                num_noPass: num_noPass - 20
              })
            }
          }
        })
    }
    //已通过加载更多
    else if (current == 1) {
      let num_Pass = this.data.num_Pass + 20
      let Pass = this.data.Pass
      wx.showLoading({
        title: '加载中'
      })
      db.collection('company_mailbox').where({
        companyid: _this.data.companyid,
        status: 'pass'
      })
        .orderBy('deliveryTime', 'desc')
        .skip(num_Pass)
        .get({
          success(res) {
            wx.hideLoading()
            if (res.data.length != 0) {
              _this.setData({
                Pass: Pass.concat(res.data),
                num_Pass: num_Pass
              })
            } else {
              _this.setData({
                num_Pass: num_Pass - 20
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