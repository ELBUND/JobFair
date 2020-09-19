const db = wx.cloud.database()
const _ = db.command
const majors = require("../../utils/major")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screen_flag: 0,
    current_education: 0,
    education: ['不限', '中专', '大专', '本科', '硕士', '博士'],
    current_major: 0,
    major: [],
    education_selected: '不限',
    major_selected: '不限',
    CV: [],
    animation: {}
  },

  //筛选弹窗
  screen() {
    this.setData({
      screen_flag: 1
    })
    let animation = wx.createAnimation({
      duration: 200,
    })
    animation.translateX(0).opacity(1).step()
    this.setData({
      animation: animation.export()
    })
  },

  //学历选择
  education(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      current_education: index,
      education_selected: this.data.education[index]
    })
  },

  //专业选择
  major(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      current_major: index,
      major_selected: this.data.major[index]
    })
  },

  //清除选择
  btnClear() {
    this.setData({
      current_major: 0,
      current_education: 0,
      major_selected: '不限',
      education_selected: '不限'
    })
  },

  //确定筛选
  btnConfirm() {
    let _this = this
    let animation = wx.createAnimation({
      duration: 200,
    })
    animation.translateX(-200).opacity(0).step()
    this.setData({
      animation: animation.export()
    })
    setTimeout(function () {
      _this.setData({
        screen_flag: 0
      })
      _this.searchCV()
    }, 200)
  },

  //关闭筛选弹窗
  close() {
    let _this = this
    let animation = wx.createAnimation({
      duration: 200,
    })
    animation.translateX(-200).opacity(0).step()
    this.setData({
      animation: animation.export()
    })
    setTimeout(function () {
      _this.setData({
        screen_flag: 0
      })
    }, 200)
  },

  //搜索学生简历
  searchCV() {
    let _this = this
    let education_selected = this.data.education_selected
    let major_selected = this.data.major_selected
    education_selected == '不限' ? education_selected = undefined : education_selected = this.data.education_selected
    major_selected == '不限' ? major_selected = undefined : major_selected = this.data.major_selected
    wx.showLoading({
      title: '加载中'
    })
    db.collection('CV').where({
      education: education_selected,
      major: major_selected
    }).get({
      success(res) {
        wx.hideLoading()
        if (res.data.length == 0) {
          wx.showToast({
            title: '暂无符合的学生',
            icon: 'none',
            duration: 3000
          })
        }
        _this.setData({
          CV: res.data
        })
      }
    })
  },

  //跳转详情
  detail(e) {
    wx.navigateTo({
      url: '/pages/looking/detail'
    })
    wx.setStorageSync('detail', e.currentTarget.dataset.item)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.searchCV()
    let m = ['不限']
    let all = majors.major
    for (let i = 0; i < all.length; i++) {
      for (let j = 0; j < all[i].major.length; j++) {
        m.push(all[i].major[j])
      }
    }
    this.setData({
      major: m
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