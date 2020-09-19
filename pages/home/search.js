const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: ['选择省', '城市', '区'],
    inputValue: '',
    history: [],
    history_flag: 0,
    result: [],
    result_company: []
  },

  //选择城市
  city(e) {
    this.setData({
      city: e.detail.value
    })
  },

  //进行搜索
  search(e) {
    let value = e.detail.value
    let history = this.data.history
    let _this = this
    if (history.length > 0) {
      //检查有无重复历史
      if (!(history.includes(value))) {
        history.push(value)
      }
      this.setData({
        inputValue: value,
        history: history
      })
      //缓存本地，作为搜索历史
      wx.setStorageSync('history', history)
    } else {
      let newhistory = []
      newhistory.push(value)
      this.setData({
        inputValue: value,
        history: newhistory
      })
      //缓存本地，作为搜索历史
      wx.setStorageSync('history', newhistory)
    }
    wx.showLoading({
      title: '搜索中'
    })
    //检索公司
    db.collection('company').where({
      name: db.RegExp({
        regexp: value
      })
    }).get({
      success(res) {
        if (res.data.length != 0) {
          _this.setData({
            result_company: res.data,
            history_flag: 1
          })
        } else {
          _this.setData({
            result_company: []
          })
        }
      }
    })
    //检索职位
    db.collection('jobs_school').where({
      name: db.RegExp({
        regexp: value,
        options: 'i'
      })
    }).get({
      success(res) {
        wx.hideLoading()
        if (res.data.length != 0) {
          _this.setData({
            result: res.data,
            history_flag: 1
          })
        } else {
          _this.setData({
            result: []
          })
        }
      }
    })
  },

  //取消输入并清空显示内容
  cancel() {
    this.setData({
      inputValue: '',
      result: [],
      result_company: [],
      history_flag: 0
    })
  },

  //选择搜索历史
  selectHistory(e) {
    let value = e.currentTarget.dataset.item
    this.setData({
      inputValue: value
    })
    let param = {
      detail: {
        value: value
      }
    }
    this.search(param)
  },

  //清除搜索历史
  clearHistory() {
    wx.removeStorageSync('history')
    this.onShow()
  },

  //跳转公司详情
  companyDetail(e) {
    let companyid = e.currentTarget.dataset.companyid
    wx.navigateTo({
      url: '/pages/companyDetail/companyDetail?companyid=' + companyid
    })
  },

  //跳转职位详情
  jobDetail(e){
    wx.setStorageSync('jobDetail',e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/jobDetail/jobDetail',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('city')) {
      this.setData({
        city: wx.getStorageSync('city')
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      history: wx.getStorageSync('history')
    })
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