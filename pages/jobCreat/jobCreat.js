const db = wx.cloud.database()
const util = require("../../utils/util")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSelect: '',
    index_salary1: 0,
    index_salary2: 0,
    index_education: 0,
    salary1: ['选择起始金额', '0', '1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k', '20k'],
    salary2: ['选择结束金额', '0', '1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k', '20k'],
    education: ['请选择学历', '不限', '中专', '大专', '本科', '本科以上'],
    address: ['选择省', '选择市', '选择区'],
    animation: {},
    welfares: [
      {
        name: '五险一金',
        selected: false
      }, {
        name: '定期体检',
        selected: false
      }, {
        name: '加班补助',
        selected: false
      }, {
        name: '全勤奖',
        selected: false
      }, {
        name: '年终奖',
        selected: false
      }, {
        name: '带薪年假',
        selected: false
      }, {
        name: '员工旅游',
        selected: false
      }, {
        name: '免费班车',
        selected: false
      }, {
        name: '餐补',
        selected: false
      }, {
        name: '交通补助',
        selected: false
      }, {
        name: '节日福利',
        selected: false
      }, {
        name: '零食下午茶',
        selected: false
      }],
    points: [],
    chooseWelfare: false
  },

  //选择职位
  chooseJob() {
    wx.navigateTo({
      url: '/pages/jobCreat/choose'
    })
  },

  //选择起始金额
  salary1(e) {
    this.setData({
      index_salary1: e.detail.value
    })
  },

  //选择结束金额
  salary2(e) {
    this.setData({
      index_salary2: e.detail.value
    })
  },

  //学历选择
  eduaction(e) {
    this.setData({
      index_education: e.detail.value
    })
  },

  //添加福利待遇
  addWelfare() {
    this.setData({
      chooseWelfare: true
    })
    this.animation.translateY(120).opacity(1).step()
    this.setData({
      animation: this.animation.export()
    })
  },

  //选择福利待遇
  welfareSelect(e) {
    let index = e.currentTarget.dataset.index
    let w = this.data.welfares
    w[index].selected = !w[index].selected
    this.setData({
      welfares: w
    })
  },

  //关闭弹窗
  close() {
    let _this = this
    this.animation.translateY(-120).opacity(0).step()
    this.setData({
      animation: this.animation.export()
    })
    setTimeout(function () {
      _this.setData({
        chooseWelfare: false
      })
    }, 200)
  },

  //地址选择
  address(e) {
    this.setData({
      address: e.detail.value
    })
  },

  //添加职位说明
  addPoint() {
    let p = this.data.points
    p.push({
      point: ''
    })
    this.setData({
      points: p
    })
  },

  //监听职位说明输入
  pointInput(e) {
    let index = e.currentTarget.dataset.index
    this.data.points[index].point = e.detail.value
  },

  //删除职位说明
  delPoint(e) {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确定删除该点说明吗？',
      success(res) {
        if (res.confirm) {
          let index = e.currentTarget.dataset.index
          let p = _this.data.points
          p.splice(index, 1)
          _this.setData({
            points: p
          })
        }
      }
    })
  },

  //提交
  submit(e) {
    let value = e.detail.value
    let welfares = this.data.welfares
    let points = this.data.points
    let selectWalfare = []
    //检查信息是否填写完整
    for (let key in value) {
      if (value[key] == '' || value[key] == '请选择学历' || value[key] == '选择起始金额' || value[key] == '选择结束金额' || value['address'][0] == '选择省') {
        wx.showToast({
          title: '请将信息填写完整',
          icon: 'none',
          duration: 2500
        })
        return -1
      }
    }
    //检查金额选择是否非法
    if (value.salary_start >= value.salary_end) {
      wx.showToast({
        title: '请确认金额的选择',
        icon: 'none',
        duration: 2500
      })
      return -1
    }
    //检查是否选择福利待遇
    for (let i = 0; i < welfares.length; i++) {
      if (welfares[i].selected == true) {
        selectWalfare.push(welfares[i].name)
      }
    }
    if (selectWalfare.length == 0) {
      wx.showToast({
        title: '请选择福利待遇',
        icon: 'none'
      })
      return -1
    }
    //检查是否添加职位说明
    if (this.data.points.length == 0) {
      wx.showToast({
        title: '请添加职位说明',
        icon: 'none',
        duration: 2500
      })
      return -1
    } else {
      for (let index in points) {
        if (points[index].point == '') {
          wx.showToast({
            title: '请将职位说明填写完整',
            icon: 'none',
            duration: 2500
          })
          return -1
        }
      }
    }
    wx.showLoading({
      title: '提交中...'
    })
    let company = wx.getStorageSync('company')
    db.collection('jobs_school').add({
      data: {
        companyid: company.companyid,  //公司id
        company: company.name,  //公司名称
        trade: company.trade, //所属行业(跟随公司行业)
        name: value.name,  //职位名称
        salary_start: parseInt(value.salary_start),  //起始金额
        salary_end: parseInt(value.salary_end),  //结束金额
        eduaction: value.eduaction,  //学历要求
        welfares: selectWalfare,  //福利待遇
        hr: value.hr,  //发布者姓名
        position: value.position, //发布者职位
        phone: value.phone,  //联系电话
        weixin: value.weixin,  //发布者微信
        email: value.email, //发布者邮箱
        address: value.address,  //地址
        addressDetail: value.addressDetail, //详细地址
        points: points, //职位说明
        postTime: util.formatTime(new Date()),  //发布时间
        deliverNum: 0,  //投递数量
        browseNum: 0,  //浏览数量
      },
      success() {
        wx.hideLoading()
        wx.showToast({
          title: '创建成功'
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
          let pages = getCurrentPages()
          let beforepage = pages[pages.length - 2]
          beforepage.searchJobs()
        }, 2000)
      },
      fail() {
        wx.hideLoading()
        wx.showToast({
          title: '出现错误,请稍后重试',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow() {
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
    this.animation = wx.createAnimation({
      duration: 200
    })
  },

  onUnload() {
    wx.removeStorageSync('currentSelect')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})