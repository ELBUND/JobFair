const positions = require("../../utils/positions")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: -1,
    vtabs: positions.positions,
    currentSelect: '',
    animation: {},
    flag: 0
  },

  //点击弹出子菜单
  showSubitem(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      current: index,
      flag: 1
    })
    let animation = wx.createAnimation({
      duration: 200
    })
    animation.translateX(0).step()
    this.setData({
      animation: animation
    })
  },

  //选择职位
  select(e) {
    let index = e.currentTarget.dataset.index
    let currentSelect = this.data.vtabs[this.data.current].subitem[index]
    this.setData({
      currentSelect: currentSelect
    })
    //缓存本地
    wx.setStorageSync('jobWanted', currentSelect)
    //返回上一页
    wx.navigateBack({
      delta: 1
    })
  },

  //关闭子菜单
  close() {
    let _this = this
    let animation = wx.createAnimation({
      duration: 200
    })
    animation.translateX(230).step()
    this.setData({
      animation: animation
    })
    setTimeout(function () {
      _this.setData({
        flag: 0
      })
    }, 200)
  },

  in() { },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('jobWanted')) {
      this.setData({
        currentSelect: wx.getStorageSync('jobWanted')
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})