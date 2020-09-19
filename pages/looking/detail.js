const db = wx.cloud.database()
const _ = db.command
const time = require("../../utils/util")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
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

  //发送消息
  sendMsg() {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认发起会话吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '发送中'
          })
          let detail = _this.data.detail
          let company = wx.getStorageSync("company")
          let memebers = []
          memebers.push(wx.getStorageSync('openid'))
          memebers.push(detail._openid)
          //创建房间
          db.collection('room').add({
            data: {
              roomid: _this.randomRoomid(),  //房间id
              company: company.name,  //公司名称
              sender: '',  //发起人昵称
              student: detail.name,  //学生姓名
              student_photo: detail.photo,  //学生照片
              student_job: '',  //学生期望职位
              memebers: memebers,  //房间成员
              creatTime: time.formatTime(new Date())  //创建时间
            },
            success() {
              wx.hideLoading()
              wx.switchTab({
                url: '/pages/Msg/list',
              })
            }
          })
        }
      }
    })
  },

  //随机生成房间id
  randomRoomid() {
    let a = []
    let char = '0123456789abcdefghijk'
    for (let i = 0; i < char.length; i++) {
      a[i] = char.substr(Math.floor(Math.random() * 21), 1)
    }
    a[16] = char.substr((a[16] & 3) | 8, 1)
    a[10] = a[14] = a[18] = '-'
    let roomid = a.join('')
    return roomid
  },

  //判断是否已经存在该房间
  isRoomExist() {
    let _this = this
    let detail = wx.getStorageSync('detail')
    let company = wx.getStorageSync('company')
    let sender_openid = wx.getStorageSync('openid')
    let target_openid = detail._openid
    db.collection('room').where({
      memebers: _.in([sender_openid, target_openid]),
      student: detail.name,
      company: company.name
    }).get({
      success(res) {
        if (res.data.length == 1) {
          wx.switchTab({
            url: '/pages/Msg/list'
          })
        } else {
          _this.sendMsg()
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      detail: wx.getStorageSync('detail')
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