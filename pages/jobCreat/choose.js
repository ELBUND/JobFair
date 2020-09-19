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
    wx.setStorageSync('currentSelect', currentSelect)
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
    if (wx.getStorageSync('currentSelect')) {
      this.setData({
        currentSelect: wx.getStorageSync('currentSelect')
      })
    }
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