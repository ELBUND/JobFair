const db = wx.cloud.database()
const _ = db.command
const city = require("../../utils/allcity")

Page({
  data: {
    animation: {},
    city: ['省份', '城市', '区'],
    screen_flag: 0,
    index_education: 0,
    education: [{
      name: '不限',
      isSelected: true
    }, {
      name: '中专',
      isSelected: false
    }, {
      name: '大专',
      isSelected: false
    }, {
      name: '本科',
      isSelected: false
    }, {
      name: '本科以上',
      isSelected: false
    }],
    education_selected: '不限',
    index_salary: 0,
    salary: [{
      name: '不限',
      isSelected: true
    }, {
      name: '3k以下',
      isSelected: false
    }, {
      name: '3k-5k',
      isSelected: false
    }, {
      name: '5k-10k',
      isSelected: false
    }, {
      name: '10k-20k',
      isSelected: false
    }],
    salary_selected: '不限',
    index_trade: 0,
    trade: [{
      name: '不限',
      isSelected: true
    }, {
      name: '电子商务',
      isSelected: false
    }, {
      name: '游戏',
      isSelected: false
    }, {
      name: '媒体',
      isSelected: false
    }, {
      name: '广告营销',
      isSelected: false
    }, {
      name: '数据服务',
      isSelected: false
    }, {
      name: '医疗健康',
      isSelected: false
    }, {
      name: '生活服务',
      isSelected: false
    }, {
      name: 'O2O',
      isSelected: false
    }, {
      name: '旅游',
      isSelected: false
    }, {
      name: '分类信息',
      isSelected: false
    }, {
      name: '教育',
      isSelected: false
    }, {
      name: '社交网络',
      isSelected: false
    }, {
      name: '人力资源服务',
      isSelected: false
    }, {
      name: '企业服务',
      isSelected: false
    }, {
      name: '信息安全',
      isSelected: false
    }, {
      name: '智能硬件',
      isSelected: false
    }, {
      name: '移动互联网',
      isSelected: false
    }, {
      name: '互联网',
      isSelected: false
    }, {
      name: '计算机软件',
      isSelected: false
    }, {
      name: '通信',
      isSelected: false
    }, {
      name: '金融',
      isSelected: false
    }, {
      name: '物流',
      isSelected: false
    }, {
      name: '贸易',
      isSelected: false
    }, {
      name: '汽车生产',
      isSelected: false
    }, {
      name: '其他行业',
      isSelected: false
    }],
    trade_selected: '不限',
    selectNum: 0,
    jobs: [],
    jobWanted: '',
    dataIndex: 0
  },

  //跳转搜索页
  search() {
    wx.navigateTo({
      url: '/pages/home/search',
    })
  },

  //城市选择
  city(e) {
    this.setData({
      city: e.detail.value,
    })
    this.loadJobs()
    //缓存选择
    wx.setStorageSync('city', e.detail.value)
  },

  //筛选条件
  screen() {
    this.setData({
      screen_flag: 1
    })
    let animation = wx.createAnimation({
      duration: 500
    })
    animation.translateY(700).opacity(1).step()
    this.setData({
      animation: animation
    })
  },

  //学历选择
  eduSelect(e) {
    let index = e.currentTarget.dataset.index
    let education = this.data.education
    for (let i = 0; i < education.length; i++) {
      education[i].isSelected = false
    }
    education[index].isSelected = true
    this.setData({
      index_education: index,
      education: education
    })
    this.totalScreen()
  },

  //薪资待遇选择
  salarySelect(e) {
    let index = e.currentTarget.dataset.index
    let salary = this.data.salary
    for (let i = 0; i < salary.length; i++) {
      salary[i].isSelected = false
    }
    salary[index].isSelected = true
    this.setData({
      index_salary: index,
      salary: salary
    })
    this.totalScreen()
  },

  //行业选择
  tradeSelect(e) {
    let index = e.currentTarget.dataset.index
    let trade = this.data.trade
    for (let i = 0; i < trade.length; i++) {
      trade[i].isSelected = false
    }
    trade[index].isSelected = true
    this.setData({
      index_trade: index,
      trade: trade
    })
    this.totalScreen()
  },

  //统计筛选的条件数
  totalScreen() {
    let education = this.data.education
    let salary = this.data.salary
    let trade = this.data.trade
    var num = 0
    for (let i = 1; i < education.length; i++) {
      if (education[i].isSelected == true) {
        num++
      }
    }
    for (let i = 1; i < salary.length; i++) {
      if (salary[i].isSelected == true) {
        num++
      }
    }
    for (let i = 1; i < trade.length; i++) {
      if (trade[i].isSelected == true) {
        num++
      }
    }
    this.setData({
      selectNum: num
    })
  },

  //清除所有选择
  btnClear() {
    let education = this.data.education
    let salary = this.data.salary
    let trade = this.data.trade
    for (let i = 0; i < education.length; i++) {
      education[i].isSelected = false
    }
    for (let i = 0; i < salary.length; i++) {
      salary[i].isSelected = false
    }
    for (let i = 0; i < trade.length; i++) {
      trade[i].isSelected = false
    }
    education[0].isSelected = true
    salary[0].isSelected = true
    trade[0].isSelected = true
    this.setData({
      index_education: 0,
      index_salary: 0,
      index_trade: 0,
      selectNum: 0,
      education: education,
      salary: salary,
      trade: trade
    })
  },

  //确认选择
  btnConfirm() {
    let _this = this
    let animation = wx.createAnimation({
      duration: 500
    })
    animation.translateY(-700).opacity(0).step()
    this.setData({
      animation: animation
    })
    setTimeout(function () {
      _this.setData({
        screen_flag: 0,
        education_selected: _this.data.education[_this.data.index_education].name,
        salary_selected: _this.data.salary[_this.data.index_salary].name,
        trade_selected: _this.data.trade[_this.data.index_trade].name
      })
      _this.loadJobs()
    }, 500)
  },

  //关闭筛选弹窗
  close_screen() {
    let _this = this
    let animation = wx.createAnimation({
      duration: 500
    })
    animation.translateY(-700).opacity(0).step()
    this.setData({
      animation: animation
    })
    setTimeout(function () {
      _this.setData({
        screen_flag: 0
      })
      _this.btnClear()
    }, 500)
  },

  //加载职位
  loadJobs() {
    let _this = this
    let city = this.data.city  //城市选择
    let education_selected = this.data.education_selected  //学历要求选择
    let salary_selected = this.data.salary_selected  //薪资选择
    let trade_selected = this.data.trade_selected  //行业选择
    let jobWanted = this.data.jobWanted  //期望职位
    city[0] == '省份' ? city = undefined : city = this.data.city
    education_selected == '不限' ? education_selected = undefined : education_selected = this.data.education_selected
    salary_selected == '不限' ? salary_selected = undefined : salary_selected = this.data.salary_selected
    trade_selected == '不限' ? trade_selected = undefined : trade_selected = this.data.trade_selected
    jobWanted == '' ? jobWanted = undefined : jobWanted = this.data.jobWanted
    //对薪资选择进行拆分
    let salary_start = 0
    let salary_end = 0
    if (salary_selected == '3k以下') {
      salary_start = undefined
      salary_end = parseInt(salary_selected.substr('k', 1))
      wx.showLoading({
        title: '加载中'
      })
      db.collection('jobs_school').where({
        job: jobWanted,
        address: city,
        trade: trade_selected,
        education: education_selected,
        salary_start: salary_start,
        salary_end: _.lte(salary_end)
      })
        .orderBy('postTime', 'desc')
        .get({
          success(res) {
            wx.hideLoading()
            _this.setData({
              jobs: res.data,
              dataIndex: 0
            })
          }
        })
    } else {
      if (salary_selected != undefined) {
        let index = salary_selected.indexOf('-')
        salary_start = parseInt(salary_selected.slice(0, index))
        salary_end = parseInt(salary_selected.slice(index + 1))
        wx.showLoading({
          title: '加载中'
        })
        db.collection('jobs_school').where({
          job: jobWanted,
          address: city,
          trade: trade_selected,
          education: education_selected,
          salary_start: _.lte(salary_end),
          salary_end: _.gte(salary_start)
        })
          .orderBy('postTime', 'desc')
          .get({
            success(res) {
              wx.hideLoading()
              _this.setData({
                jobs: res.data,
                dataIndex: 0
              })
            }
          })
      } else {
        wx.showLoading({
          title: '加载中'
        })
        db.collection('jobs_school').where({
          job: jobWanted,
          address: city,
          trade: trade_selected,
          education: education_selected
        })
          .orderBy('postTime', 'desc')
          .get({
            success(res) {
              wx.hideLoading()
              _this.setData({
                jobs: res.data,
                dataIndex: 0
              })
            }
          })
      }
    }
  },

  //查看工作详情
  jobDetail(e) {
    wx.setStorageSync('jobDetail', e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/jobDetail/jobDetail',
    })
  },

  onLoad: function () {
    if (wx.getStorageSync('city')) {
      this.setData({
        city: wx.getStorageSync('city')
      })
    }
    if (wx.getStorageSync('jobWanted')) {
      this.setData({
        jobWanted: wx.getStorageSync('jobWanted')
      })
    }
    this.loadJobs()
    this.subscribeMsg()
  },

  onPullDownRefresh() {
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  //触底加载更多
  onReachBottom() {
    let _this = this
    let dataIndex = this.data.dataIndex + 20  //当前数据条数下标
    let jobs = this.data.jobs  //旧数组
    let city = this.data.city  //城市选择
    let education_selected = this.data.education_selected  //学历要求选择
    let salary_selected = this.data.salary_selected  //薪资选择
    let trade_selected = this.data.trade_selected  //行业选择
    let jobWanted = this.data.jobWanted  //期望职位
    city[0] == '省份' ? city = undefined : city = this.data.city
    education_selected == '不限' ? education_selected = undefined : education_selected = this.data.education_selected
    salary_selected == '不限' ? salary_selected = undefined : salary_selected = this.data.salary_selected
    trade_selected == '不限' ? trade_selected = undefined : trade_selected = this.data.trade_selected
    jobWanted == '' ? jobWanted = undefined : jobWanted = this.data.jobWanted
    //对薪资选择进行拆分
    let salary_start = 0
    let salary_end = 0
    if (salary_selected == '3k以下') {
      salary_start = undefined
      salary_end = parseInt(salary_selected.substr('k', 1))
      wx.showLoading({
        title: '加载中'
      })
      db.collection('jobs_school').where({
        job: jobWanted,
        address: city,
        trade: trade_selected,
        education: education_selected,
        salary_start: salary_start,
        salary_end: _.lte(salary_end)
      })
        .orderBy('postTime', 'desc')
        .skip(dataIndex)
        .get({
          success(res) {
            if (res.data.length != 0) {
              wx.hideLoading()
              _this.setData({
                jobs: jobs.concat(res.data),
                dataIndex: dataIndex
              })
            } else {
              wx.hideLoading()
              wx.showToast({
                title: '没有更多了',
                icon: 'none'
              })
              _this.setData({
                dataIndex: dataIndex - 20
              })
            }
          }
        })
    } else {
      if (salary_selected != undefined) {
        let index = salary_selected.indexOf('-')
        salary_start = parseInt(salary_selected.slice(0, index))
        salary_end = parseInt(salary_selected.slice(index + 1))
        wx.showLoading({
          title: '加载中'
        })
        db.collection('jobs_school').where({
          job: jobWanted,
          address: city,
          trade: trade_selected,
          education: education_selected,
          salary_start: _.lte(salary_end),
          salary_end: _.gte(salary_start)
        })
          .orderBy('postTime', 'desc')
          .skip(dataIndex)
          .get({
            success(res) {
              if (res.data.length != 0) {
                wx.hideLoading()
                _this.setData({
                  jobs: jobs.concat(res.data),
                  dataIndex: dataIndex
                })
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: '没有更多了',
                  icon: 'none'
                })
                _this.setData({
                  dataIndex: dataIndex - 20
                })
              }
            }
          })
      } else {
        wx.showLoading({
          title: '加载中'
        })
        db.collection('jobs_school').where({
          job: jobWanted,
          address: city,
          trade: trade_selected,
          education: education_selected
        })
          .orderBy('postTime', 'desc')
          .skip(dataIndex)
          .get({
            success(res) {
              if (res.data.length != 0) {
                wx.hideLoading()
                _this.setData({
                  jobs: jobs.concat(res.data),
                  dataIndex: dataIndex
                })
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: '没有更多了',
                  icon: 'none'
                })
                _this.setData({
                  dataIndex: dataIndex - 20
                })
              }
            }
          })
      }
    }
  },


  // 订阅消息
  subscribeMsg() {
    let tmplId = 'y8vrYkoTvdxoO8PFnPSEntC1o5yRRGFbykxbLWC_bcQ'
    wx.requestSubscribeMessage({
      tmplIds: [tmplId],
      success(res) {
        if (res[tmplId] == 'accept') {
          // that.cloudSendMsg();
        } else if (res[tmplId] == 'reject') { // 用户拒绝授权
          wx.showModal({
            title: '温馨提示',
            content: "您已关闭消息推送，如需要消息推送服务，请点击确定跳转设置页面打开授权后再次尝试。",
            success: function (modal) {
              if (modal.confirm) { // 点击确定
                wx.openSetting({ withSubscriptions: true })
              }
            }
          })
        }
      },
      fail(err) {
        if (err.errCode == '20004') {
          wx.showModal({
            title: '温馨提示',
            content: "您的消息订阅主开关已关闭，如需要消息推送服务，请点击确定跳转设置页面打开授权后再次尝试。",
            success: function (modal) {
              if (modal.confirm) { // 点击确定
                wx.openSetting({ withSubscriptions: true })
              }
            }
          })
        }
      }
    })
  },
  // 云函数-消息推送
  cloudSendMsg() {
    wx.cloud.callFunction({
      name: 'sendMsg',
      data: {
        // 要传的数据
        detail: '职位详情',
        time: '2020-1-1',
        sender: '梅生',
        remarks: '邀请'
      }
    }).then(res => {
      console.log('cloud res:', res)
    }).catch(err => {
      console.log('err:', err)
    })
  },
})
