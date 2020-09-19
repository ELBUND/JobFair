const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rooms: [],
    isCompany: false
  },

  //获取房间列表
  getRoomList() {
    let _this = this
    let openid = wx.getStorageSync('openid')
    wx.showLoading({
      title: '加载中'
    })
    this.watcher = db.collection('room').where({
      memebers: openid
    })
      .orderBy('creatTime', 'desc')
      .watch({
        onChange(res) {
          wx.hideLoading()
          if (res.docs.length != 0) {
            let rooms = res.docs
            let a = {}
            //查询每个房间最新的一条消息,并放入对应的房间里
            for (let i = 0; i < rooms.length; i++) {
              a = new Promise((reslove, reject) => {
                db.collection('message').where({
                  roomid: rooms[i].roomid
                }).orderBy('sendTime', 'desc')
                  .limit(1)
                  .watch({
                    onChange(res) {
                      reslove(rooms[i].newMsg = res.docs[0])
                    },
                    onError(error) {

                    }
                  })
              })
            }
            Promise.all([a]).then(() => {
              wx.hideLoading()
              _this.setData({
                rooms: rooms
              })
            })
          } else {
            wx.showToast({
              title: '暂无消息',
              icon: 'none'
            })
            _this.setData({
              rooms: []
            })
          }
        },
        onError(error) {

        }
      })
  },

  //进入对应的房间
  enterRoom(e) {
    let roomid = e.currentTarget.dataset.roomid
    let photo = e.currentTarget.dataset.photo
    let company = e.currentTarget.dataset.company
    let hr = e.currentTarget.dataset.hr
    let student = e.currentTarget.dataset.student
    wx.navigateTo({
      url: '/pages/Msg/room?roomid=' + roomid + '&photo=' + photo + '&company=' + company + '&hr=' + hr + '&student=' + student
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //检查是否登录
    if (!(wx.getStorageSync('userInfo'))) {
      wx.showModal({
        title: '提示',
        content: '请先登录~',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine'
            })
          }
        }
      })
    } else {
      if (wx.getStorageSync('company')) {
        this.setData({
          isCompany: true
        })
      } else {
        this.setData({
          isCompany: false
        })
      }
      this.getRoomList()
    }
  },

  onHide() {

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