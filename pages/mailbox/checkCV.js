const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    deliverer: {}
  },

  //拨打电话
  makecall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },

  //复制信息
  copy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success() { }
    })
  },

  //通过
  pass() {
    let _this = this
    wx.showModal({
      title: '请确认',
      content: '确认通过吗？',
      success(res) {
        if (res.confirm) {
          let _id = _this.data.detail._id
          wx.showLoading({
            title: '操作中'
          })
          wx.cloud.callFunction({
            name: 'CV_operation',
            data: {
              _id: _id,
              op: 'pass'
            },
            success() {
              wx.hideLoading()
              wx.showToast({
                title: '已通过'
              })
              _this.updateStatus(_id)
            },fail(res){
              console.log(res)
            }
          })
        }
      }
    })
  },

  //撤销
  cancel() {
    let _this = this
    wx.showModal({
      title: '请确认',
      content: '确认撤销吗？',
      success(res) {
        if (res.confirm) {
          let _id = _this.data.detail._id
          wx.showLoading({
            title: '操作中'
          })
          wx.cloud.callFunction({
            name: 'CV_operation',
            data: {
              _id: _id,
              op: 'wait'
            },
            success() {
              wx.hideLoading()
              wx.showToast({
                title: '已撤销'
              })
              _this.updateStatus(_id)
            }
          })
        }
      }
    })
  },

  //更新状态
  updateStatus(_id) {
    let _this = this
    db.collection('company_mailbox').doc(_id).get({
      success(res) {
        _this.setData({
          deliverer: res.data.deliverer,
          detail: res.data
        })
        //更新本地缓存
        wx.setStorageSync('detail', res.data)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      detail: wx.getStorageSync('detail'),
      deliverer: wx.getStorageSync('detail').deliverer
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('detail')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})