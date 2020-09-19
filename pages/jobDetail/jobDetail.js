const db = wx.cloud.database()
const time = require("../../utils/util")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    job: {},
    address: '',
    hasFavor: false,
    company: {},
    isCompany: false
  },

  //查看公司详情跳转
  companyDetail() {
    wx.navigateTo({
      url: '/pages/companyDetail/companyDetail?companyid=' + this.data.company.companyid,
    })
  },

  //拨打电话
  makecall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },

  //复制文本
  copy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success() {
        wx.getClipboardData({
          success() { }
        })
      }
    })
  },

  //检查该职位是否已收藏
  isFavor(job) {
    let _this = this
    db.collection('favor').where({
      _openid: wx.getStorageSync('openid'),
      name: job.name,
      postTime: job.postTime,
      companyid: job.companyid,
    }).count({
      success(res) {
        if (res.total != 0) {
          _this.setData({
            hasFavor: true
          })
        }
      }
    })
  },

  //添加收藏
  addFavor() {
    //判断是否登录为公司
    if (wx.getStorageSync('company')) {
      wx.showToast({
        title: '当前登录状态为企业,无法进行此操作',
        icon: 'none'
      })
      return -1
    }
    //判断是否登录
    if (!(wx.getStorageSync('userInfo'))) {
      wx.showToast({
        title: '请先登录哦~',
        icon: 'none'
      })
      return -1
    }
    let _this = this
    let job = this.data.job
    wx.showLoading({
      title: '操作中'
    })
    //判断是否已添加收藏
    if (this.data.hasFavor == true) {
      wx.hideLoading()
      wx.showToast({
        title: '已经添加过收藏了',
        icon: 'none'
      })
      return -1
    }
    db.collection('favor').add({
      data: {
        name: job.name,
        company: job.company,
        companyid: job.companyid,
        postTime: job.postTime,
        salary_start: job.salary_start,
        salary_end: job.salary_end,
        welfares: job.welfares,
        address: job.address,
        addressDetail: job.addressDetail,
        hr: job.hr,
        phone: job.phone,
        email: job.email,
        points: job.points,
        position: job.position,
        weixin: job.weixin,
        favorTime: time.formatTime(new Date())  //收藏时间
      },
      success() {
        wx.hideLoading()
        wx.showToast({
          title: '已加入收藏'
        })
        _this.setData({
          hasFavor: true
        })
      }, fail() {
        wx.hideLoading()
        wx.showToast({
          title: '出错了,请稍后重试',
          icon: 'none'
        })
      }
    })
  },

  //取消收藏
  cancelFavor() {
    //判断是否登录为公司
    if (wx.getStorageSync('company')) {
      wx.showToast({
        title: '当前登录状态为企业,无法进行此操作',
        icon: 'none'
      })
      return -1
    }
    //判断是否登录
    if (!(wx.getStorageSync('userInfo'))) {
      wx.showToast({
        title: '请先登录哦~',
        icon: 'none'
      })
      return -1
    }
    let _this = this
    let job = this.data.job
    wx.showLoading({
      title: '操作中'
    })
    db.collection('favor').where({
      _openid: wx.getStorageSync('openid'),
      name: job.name,
      postTime: job.postTime,
      companyid: job.companyid
    }).get({
      success(res) {
        if (res.data.length != 0) {
          db.collection('favor').doc(res.data[0]._id).remove({
            success() {
              wx.hideLoading()
              wx.showToast({
                title: '已取消收藏'
              })
              _this.setData({
                hasFavor: false
              })
            }, fail() {
              wx.hideLoading()
              wx.showToast({
                title: '出错了,请稍后重试',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  //投递简历
  sendCV() {
    //判断是否登录为公司
    if (wx.getStorageSync('company')) {
      wx.showToast({
        title: '当前登录状态为企业,无法进行此操作',
        icon: 'none'
      })
      return -1
    }
    //判断是否登录
    if (!(wx.getStorageSync('userInfo'))) {
      wx.showToast({
        title: '请先登录哦~',
        icon: 'none'
      })
      return -1
    }
    let _this = this
    let job = this.data.job
    let openid = wx.getStorageSync('openid')
    wx.showModal({
      title: '提示',
      content: '确认投递吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中'
          })
          //查询用户的简历
          db.collection('CV').where({
            _openid: openid
          }).get({
            success(res) {
              //检查是否已创建简历
              if (res.data.length != 0) {
                //添加到公司的投递箱
                db.collection('company_mailbox').add({
                  data: {
                    deliverer: res.data[0],  //投递者简历
                    companyid: job.companyid,  //公司id
                    name: job.name,  //职位名称
                    deliveryTime: time.formatTime(new Date()),  //投递时间
                    status: 'wait'
                  },
                  success() {
                    wx.hideLoading()
                    wx.showToast({
                      title: '投递成功',
                      duration: 3000
                    })
                    //增加投递数
                    wx.cloud.callFunction({
                      name: 'incNum',
                      data: {
                        _id: job._id,
                        type: 'deliver'
                      }
                    })
                  }, fail() {
                    wx.hideLoading()
                    wx.showToast({
                      title: '出错了,请稍后重试',
                      icon: 'none'
                    })
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '您还没创建简历哦~先去创建吧',
                  success(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/myCV/myCV'
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },

  //判断是否为发布者查看详情
  isCompany(value) {
    if (value == 'yes') {
      this.setData({
        isCompany: true
      })
    }
  },

  //删除职位
  delJob() {
    let _this = this
    wx.showModal({
      title: '确定要删除该职位吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中'
          })
          wx.cloud.callFunction({
            name: 'deleteJob',
            data: {
              _id: _this.data.job._id
            },
            success() {
              wx.hideLoading()
              wx.showToast({
                title: '删除成功'
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
                let pages = getCurrentPages()
                let beforepage = pages[pages.length - 2]
                beforepage.searchJobs(_this.data.company.companyid)
              }, 2000)
            },
            fail(res) {
              console.log(res)
              wx.hideLoading()
              wx.showToast({
                title: '出错了,请稍后重试',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let job = wx.getStorageSync('jobDetail')
    let address = job.address.join('') + job.addressDetail
    //获取公司信息
    if (wx.getStorageSync('company')) {
      this.setData({
        job: job,
        address: address,
        company: wx.getStorageSync('company')
      })
    } else {
      db.collection('company').where({
        companyid: job.companyid
      }).get({
        success(res) {
          _this.setData({
            job: job,
            address: address,
            company: res.data[0]
          })
        }
      })
      //增加浏览数(用户状态下增加,企业登录后不增加)
      wx.cloud.callFunction({
        name: 'incNum',
        data: {
          _id: job._id,
          type: 'browse'
        }
      })
    }
    this.isCompany(options.isCompany)
    this.isFavor(job)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('jobDetail')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})