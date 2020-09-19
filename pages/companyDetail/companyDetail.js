const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: {},
    readmore: {
      show: false,
      status: false,
      tip: '查看更多'
    },
    jobs: [],
  },

  //举报
  report() {
    wx.navigateTo({
      url: '/pages/report/report',
    })
  },

  //点击放大营业执照
  prelicense() {
    wx.previewImage({
      current: [this.data.company.license],
      urls: [this.data.company.license]
    })
  },

  //照片放大
  prePic(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.current,
      urls: this.data.company.photos,
    })
  },

  //查看工作详情
  jobDetail(e) {
    wx.setStorageSync('jobDetail', e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/jobDetail/jobDetail',
    })
  },

  //查询公司信息
  loadCompanyInfo(companyid) {
    let _this = this
    wx.showLoading({
      title: '加载中'
    })
    db.collection('company').where({
      companyid: companyid
    }).get({
      success(res) {
        _this.setData({
          company: res.data[0]
        })
        _this.isToolong()
      }
    })
    //查询该公司的职位发布信息
    db.collection('jobs_school').where({
      companyid: companyid
    }).get({
      success(res) {
        wx.hideLoading()
        _this.setData({
          jobs: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadCompanyInfo(options.companyid)
  },

  //检查文字是否超行
  isToolong() {
    const query = wx.createSelectorQuery()
    let _this = this
    query.select("#introduction").boundingClientRect(function (rect) {
      const lineHeight = 18
      const height = rect.height  //获取文字显示的高度
      const status = 'readmore.status'
      const show = 'readmore.show'
      _this.setData({
        [show]: (height / lineHeight) > 4,
        [status]: height / lineHeight > 4
      })
    }).exec()
  },

  //查看更多或收起的切换
  toggle() {
    const status = this.data.readmore.status
    const show = this.data.readmore.show
    this.setData({
      readmore: {
        show: show,
        status: !status,
        tip: status ? '收起' : '查看更多'
      }
    })
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