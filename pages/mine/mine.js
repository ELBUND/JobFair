const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasLogin: false,
    companyLogin: false,
    changePwd: false,
    isCompany: false,  //企业是否已登录
    status: '',  //输入框聚焦状态
    error_tip: '',
    animation: {},
  },

  login(e) {
    //点击授权
    if (e.detail.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      this.setData({
        userInfo: e.detail.userInfo,
        hasLogin: true
      })
    }
  },

  //跳转我的简历
  myCV() {
    //登录为企业时，不可查看
    if (this.data.isCompany == true) {
      wx.showToast({
        title: '当前登录状态为企业,无法查看该内容',
        icon: 'none',
        duration: 3000
      })
      return -1
    }
    if (this.data.hasLogin == false) {
      wx.showModal({
        title: '提示',
        content: '请先登录哦~',
        showCancel: false
      })
    } else {
      wx.navigateTo({
        url: '/pages/myCV/myCV',
      })
    }
  },

  //跳转管理求职意向
  jobWanted() {
    //登录为企业时，不可查看
    if (this.data.isCompany == true) {
      wx.showToast({
        title: '当前登录状态为企业,无法查看该内容',
        icon: 'none',
        duration: 3000
      })
      return -1
    }
    if (this.data.hasLogin == false) {
      wx.showModal({
        title: '提示',
        content: '请先登录哦~',
        showCancel: false
      })
    } else {
      wx.navigateTo({
        url: '/pages/jobWanted/jobWanted',
      })
    }
  },

  //跳转我的收藏
  myFavor() {
    //登录为企业时，不可查看
    if (this.data.isCompany == true) {
      wx.showToast({
        title: '当前登录状态为企业,无法查看该内容',
        icon: 'none',
        duration: 3000
      })
      return -1
    }
    if (this.data.hasLogin == false) {
      wx.showModal({
        title: '提示',
        content: '请先登录哦~',
        showCancel: false
      })
    } else {
      wx.navigateTo({
        url: '/pages/myFavor/myFavor',
      })
    }
  },

  //跳转已投递
  mySend() {
    //登录为企业时，不可查看
    if (this.data.isCompany == true) {
      wx.showToast({
        title: '当前登录状态为企业,无法查看该内容',
        icon: 'none',
        duration: 3000
      })
      return -1
    }
    if (this.data.hasLogin == false) {
      wx.showModal({
        title: '提示',
        content: '请先登录哦~',
        showCancel: false
      })
    } else {
      wx.navigateTo({
        url: '/pages/mySend/mySend',
      })
    }
  },

  //点击企业入口跳出弹窗
  companyEntrance() {
    this.setData({
      companyLogin: !this.data.companyLogin
    })
  },

  //我的企业跳转
  company() {
    wx.navigateTo({
      url: '/pages/company/company',
    })
  },

  //发布职位跳转
  post() {
    wx.navigateTo({
      url: '/pages/post/post',
    })
  },

  //信箱跳转
  mailbox() {
    wx.navigateTo({
      url: '/pages/mailbox/mailbox',
    })
  },

  //招纳贤士跳转
  looking() {
    wx.navigateTo({
      url: '/pages/looking/looking',
    })
  },

  //修改密码弹窗
  changePwd_modal() {
    this.setData({
      changePwd: true
    })
    let animation = wx.createAnimation({
      duration: 100
    })
    animation.translateY(70).opacity(1).step()
    this.setData({
      animation: animation.export()
    })
  },

  //修改密码
  changePwd(e) {
    //检查两次密码是否一致
    let value = e.detail.value
    if (value.newPwd != value.newPwdAgain) {
      wx.showToast({
        title: '两次密码不一致,请确认',
        icon: 'none'
      })
      return -1
    }
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认修改吗？',
      success(res) {
        if (res.confirm) {
          let company = wx.getStorageSync('company')
          wx.showLoading({
            title: '操作中'
          })
          //检查旧密码是否正确
          db.collection('company').where({
            companyid: company.companyid,
            password: value.oldPwd
          }).get({
            success(res) {
              //错误
              if (res.data.length == 0) {
                wx.hideLoading()
                _this.setData({
                  error_tip: '旧密码错误,请确认'
                })
              }
              //正确
              else {
                _this.setData({
                  error_tip: ''
                })
                wx.cloud.callFunction({
                  name: 'changePwd',
                  data: {
                    type: 'change',
                    _id: company._id,
                    newPwd: value.newPwd
                  }, success() {
                    wx.hideLoading()
                    wx.showToast({
                      title: '修改成功'
                    })
                    setTimeout(function () {
                      _this.setData({
                        changePwd: false
                      })
                    }, 2000)
                  }, fail(res) {
                    console.log(res)
                  }
                })
              }
            }
          })
        }
      }
    })
  },

  //关闭修改密码弹窗
  closeChangePwd() {
    let _this = this
    let animation = wx.createAnimation({
      duration: 100
    })
    animation.translateY(-70).opacity(0).step()
    this.setData({
      animation: animation.export()
    })
    setTimeout(function () {
      _this.setData({
        changePwd: false,
        status: '',
        error_tip: ''
      })
    }, 100)

  },

  //输入框聚焦时
  focus(e) {
    let current = e.currentTarget.dataset.current
    if (current == 'account') {
      this.setData({
        status: 'account'
      })
    } else if (current == 'password') {
      this.setData({
        status: 'password'
      })
    } else if (current == 'oldPwd') {
      this.setData({
        status: 'oldPwd'
      })
    } else if (current == 'newPwd') {
      this.setData({
        status: 'newPwd'
      })
    } else if (current == 'newPwdAgain') {
      this.setData({
        status: 'newPwdAgain'
      })
    }
  },

  //关闭弹窗
  close() {
    this.setData({
      companyLogin: !this.data.companyLogin,
      error_tip: '',
      status: ''
    })
  },

  //防止弹窗内点击关闭
  in() { },

  //企业登录
  companyLogin(e) {
    let _this = this
    let account = e.detail.value.account
    let password = e.detail.value.password
    if (account == '' || password == '') {
      wx.showModal({
        title: '提示',
        content: '请输入账号或密码',
        showCancel: false
      })
      return -1
    } else {
      wx.showLoading({
        title: '登录中...',
      })
      //首先检测账号或公司是否注册过
      db.collection('company').where({
        account: account
      }).get({
        success(res) {
          if (res.data.length == 0) {
            db.collection('company').where({
              name: account
            }).get({
              success(res) {
                if (res.data.length == 0) {
                  _this.setData({
                    error_tip: '此账号或公司还未注册'
                  })
                } else {
                  _this.setData({
                    error_tip: ''
                  })
                }
              }
            })
          } else {
            _this.setData({
              error_tip: ''
            })
          }
        }
      })
      //从云数据库中检验(账号登录)
      db.collection('company').where({
        account: account,
        password: password
      }).get({
        success(res) {
          //判断一下是否用公司名称登录
          if (res.data.length == 0) {
            db.collection('company').where({
              name: account,
              password: password
            }).get({
              success(res) {
                if (res.data.length == 0) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '密码错误',
                    icon: 'none',
                    duration: 2500
                  })
                }
                else {
                  wx.hideLoading()
                  wx.showToast({
                    title: '登录成功'
                  })
                  //缓存公司信息到本地
                  wx.setStorageSync('company', res.data[0])
                  setTimeout(function () {
                    _this.setData({
                      isCompany: true,
                      companyLogin: false
                    })
                  }, 2000)
                }
              }
            })
          }
          else {
            wx.hideLoading()
            wx.showToast({
              title: '登录成功'
            })
            //缓存公司信息到本地
            wx.setStorageSync('company', res.data[0])
            setTimeout(function () {
              _this.setData({
                isCompany: true,
                companyLogin: false
              })
            }, 2000)
          }
        }
      })
    }
  },

  //跳转企业账号注册页面
  toRegister() {
    wx.navigateTo({
      url: '/pages/companyRegister/companyRegister',
    })
  },

  //企业退出登录
  logout() {
    let _this = this
    wx.showModal({
      title: '注意',
      content: '确认登出吗？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('company')
          _this.setData({
            isCompany: false
          })
          wx.showToast({
            title: '已登出'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //检查用户是否登录
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        hasLogin: true
      })
    }
    //检查企业是否登录
    if (wx.getStorageSync('company')) {
      this.setData({
        isCompany: true
      })
    }
  },

  upload() {
    wx.chooseMessageFile({
      count: 1,
      success(res) {
        console.log(res)
        wx.cloud.uploadFile({
          cloudPath: res.tempFiles[0].time + '-' + res.tempFiles[0].name,
          filePath: res.tempFiles[0].path,
          success(res) {
            console.log(res)
            wx.showToast({
              title: '上传成功'
            })
          }
        })
      }
    })
  },

  download() {
    wx.cloud.getTempFileURL({
      fileList: ['cloud://sdb-0bdlv.7364-sdb-0bdlv-1259774460/1596854373-梅树正.pdf'],
      success(res) {
        wx.downloadFile({
          url: res.fileList[0].tempFileURL,
          success(res) {
            wx.showToast({
              title: '下载成功'
            })
            setTimeout(function () {
              //预览文件
              wx.openDocument({
                filePath: res.tempFilePath,
                fileType: 'pdf',
                showMenu: true
              })
            }, 500)
          }
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})