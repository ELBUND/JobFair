const db = wx.cloud.database()
const time = require("../../utils/util")
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: [],
    roomid: '',
    content: '',
    myopenid: wx.getStorageSync('openid'),
    photo: '',
    company: '',
    hr: '',
    student: ''
  },

  //监听输入内容
  inputing(e) {
    this.setData({
      content: e.detail.value
    })
  },

  //发送消息
  sendMsg(e) {
    if (this.data.content == '') {
      wx.showToast({
        title: '输入内容不能为空',
        icon: 'none'
      })
      return -1
    }
    let roomid = e.currentTarget.dataset.roomid
    let _this = this
    let avatarUrl = ""
    if (wx.getStorageSync('company')) {
      avatarUrl = wx.getStorageSync('userInfo').avatarUrl
    } else {
      avatarUrl = this.data.photo
    }
    db.collection('message').add({
      data: {
        roomid: roomid,
        content: this.data.content,
        sendTime: time.formatTime(new Date()),
        avatarUrl: avatarUrl   //用户头像
      }, success() {
        _this.setData({
          content: ''
        })
      }
    })
  },

  //自动滚动到底部
  pageScrollBottom() {
    wx.createSelectorQuery().select('#showMsg').boundingClientRect(function (rect) {
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let roomid = options.roomid
    let photo = options.photo
    let company = options.company
    let hr = options.hr
    let student = options.student
    this.setData({
      roomid: roomid,
      photo: photo,
      company: company,
      hr: hr,
      student: student
    })
    db.collection('message').where({
      roomid: roomid
    }).watch({
      onChange(snapshot) {
        _this.setData({
          msg: snapshot.docs
        })
        _this.pageScrollBottom()
      },
      onError(error) {
        console.log(error)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})