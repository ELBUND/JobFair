const db = wx.cloud.database()
const time = require("../../utils/util")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    animation: {},
    address: ['选择省', '选择市', '选择区'],
    license: '',
    chooseTrade: false,
    trades: ['电子商务', '游戏', '媒体', '广告营销', '数据服务', '医疗健康', '生活服务', 'O2O', '旅游', '分类信息', '教育', '社交网络', '人力资源服务', '企业服务', '信息安全', '智能硬件', '移动互联网', '互联网', '计算机软件', '通信', '金融', '物流', '贸易', '汽车生产', '其他行业'],
    current: -1,
    selectTrade: '',
    success: false,
    name: '',
    account: '',
    password: '',
    isChange: false,
    company: {}
  },

  //选择地址
  address(e) {
    this.setData({
      address: e.detail.value
    })
  },

  //添加营业执照
  addPhoto() {
    let _this = this
    wx.showActionSheet({
      itemList: ['从手机相册选择', '拍照'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album'],
            success(res) {
              let tempFilePath = res.tempFilePaths[0]
              _this.setData({
                license: tempFilePath
              })
            }
          })
        } else if (res.tapIndex == 1) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['camera'],
            success(res) {
              let tempFilePath = res.tempFilePaths[0]
              _this.setData({
                license: tempFilePath
              })
            }
          })
        }
      }
    })
  },

  //营业执照放大
  preview() {
    wx.previewImage({
      current: [this.data.license],
      urls: [this.data.license],
    })
  },

  //选择行业弹窗
  trade() {
    this.setData({
      chooseTrade: true
    })
    this.animation.translateY(70).opacity(1).step()
    this.setData({
      animation: this.animation.export()
    })
  },

  //选择一个行业
  selectTrade(e) {
    let trade = e.currentTarget.dataset.trade
    let index = e.currentTarget.dataset.index
    this.setData({
      current: index,
      selectTrade: trade
    })
  },

  //确认选择行业
  tradeConfirm(){
    if(this.data.selectTrade==''){
      wx.showToast({
        title: '请选择行业',
        icon: 'none'
      })
      return -1
    } else {
      this.close()
    }
  },

  //关闭弹窗
  close() {
    let _this = this
    this.animation.translateY(-70).opacity(0).step()
    this.setData({
      animation: this.animation.export()
    })
    setTimeout(function () {
      _this.setData({
        chooseTrade: false
      })
    }, 200)
  },

  //提交申请
  submit(e) {
    let value = e.detail.value
    //检查信息是否填写完整
    for (let key in value) {
      if (value['address'][0] == '选择省') {
        wx.showToast({
          title: '请将信息填写完整',
          icon: 'none',
          duration: 2500
        })
        return -1
      }
      if (value[key] == '') {
        wx.showToast({
          title: '请将信息填写完整',
          icon: 'none',
          duration: 2500
        })
        return -1
      }
    }
    //检查是否添加营业执照
    if (this.data.license == '') {
      wx.showToast({
        title: '请添加营业执照',
        icon: 'none',
        duration: 2500
      })
      return -1
    }
    //检查是否选择行业
    if (this.data.selectTrade == '') {
      wx.showToast({
        title: '请选择所属行业',
        icon: 'none',
        duration: 2500
      })
      return -1
    }
    //判断是首次申请还是修改
    if (this.data.isChange == false) {  //首次申请
      this.register(value)
    } else {  //修改信息
      this.change(value)
    }
  },

  //随机生成一个公司的id号
  randomCompanyID() {
    let a = []
    let char = "0123456789abcdef"
    for (let i = 0; i < 16; i++) {
      a[i] = char.substr(Math.floor(Math.random() * 16), 1)
    }
    a[10] = char.substr((a[10] & 3) | 8, 1)
    a[8] = a[12] = '-'
    let id = a.join("")
    return id
  },

  //首次申请
  register(value) {
    let _this = this
    let id = this.randomCompanyID()  //公司分配的id
    wx.showLoading({
      title: '提交中...'
    })
    //检查账号有无重复
    db.collection('company').where({
      account: value.account
    }).get({
      success(res) {
        if (res.data.length > 0) {
          wx.showModal({
            title: '提示',
            content: '此账号已被注册,请填写其他账号',
            showCancel: false
          })
          return -1
        } else {
          //将营业执照上传到云存储
          wx.cloud.uploadFile({
            cloudPath: id + "/" + new Date().getTime() + '-' + Math.floor(Math.random() * 1000) + ".png",  //云存储路径以及文件名
            filePath: _this.data.license,
            success(res) {
              //将信息上传到云数据库
              db.collection('company').add({
                data: {
                  companyid: id,  //企业分配的id
                  account: value.account,  //企业账号
                  password: value.password,  //企业密码
                  name: value.name, //企业名称 
                  legalPerson: value.legalPerson,  //企业法人
                  phone: value.phone,  //联系电话
                  address: value.address,  //公司地址
                  addressDetail: value.addressDetail, //详细地址
                  introduction: value.introduction,  //公司简介
                  trade: value.trade,  //所属行业
                  duration: parseInt(value.duration) + '年',  //注册时长
                  capital: parseInt(value.capital) + '万',  //注册资金
                  scale: parseInt(value.scale) + '人',  //公司规模
                  license: res.fileID,  //营业执照的云存储ID
                  photos: [],  //公司环境照片
                  logo: ''  //公司logo
                }, success() {
                  _this.setData({
                    success: true,
                    account: value.account,
                    password: value.password,
                    name: value.name
                  })
                  wx.hideLoading()
                }
              })
            },
            fail(res) {
              wx.hideLoading()
              console.log(res)
            }
          })
        }
      }
    })
  },

  //修改信息
  change(value) {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认提交本次修改吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中...'
          })
          //检查营业执照是否发生变动
          let company = wx.getStorageSync('company')
          let _id = company._id
          let companyid = company.companyid
          let oldlicense = company.license
          let newlicense = _this.data.license
          if (oldlicense == newlicense) {  //未变动
            //调用云函数更新记录
            wx.cloud.callFunction({
              name: 'changeCompanyInfo',
              data: {
                _id: _id,
                name: value.name,
                legalPerson: value.legalPerson,
                phone: value.phone,
                address: value.address,
                addressDetail: value.addressDetail,
                introduction: value.introduction,
                trade: value.trade, 
                duration: parseInt(value.duration) + '年',
                capital: parseInt(value.capital) + '万',
                scale: parseInt(value.scale) + '人'
              }
            })
          } else {  //变动,在云存储中原执照删除,重新上传
            //上传新执照
            wx.cloud.uploadFile({
              cloudPath: companyid + "/" + new Date().getTime() + '-' + Math.floor(Math.random() * 1000) + ".png",  //云存储路径以及文件名
              filePath: _this.data.license,
              success(res) {
                //调用云函数更新记录
                wx.cloud.callFunction({
                  name: 'changeCompanyInfo',
                  data: {
                    _id: _id,
                    name: value.name,
                    legalPerson: value.legalPerson,
                    phone: value.phone,
                    address: value.address,
                    addressDetail: value.addressDetail,
                    introduction: value.introduction,
                    trade: value.trade,  
                    duration: parseInt(value.duration) + '年',
                    capital: parseInt(value.capital) + '万',
                    scale: parseInt(value.scale) + '人',
                    oldlicense: oldlicense,  //旧执照
                    newlicense: res.fileID  //新执照
                  },
                  success() {
                    wx.hideLoading()
                    wx.showToast({
                      title: '修改成功'
                    })
                    //修改本地缓存信息
                    wx.setStorage({
                      key: 'company',
                      data: {
                        _id: _id,
                        _openid: company._openid,
                        account: company.account,
                        password: company.password,
                        companyid: company.companyid,
                        logo: company.logo,
                        photos: company.photos,
                        capital: parseInt(value.capital) + '万',
                        duration: parseInt(value.duration) + '年',
                        introduction: value.introduction,
                        legalPerson: value.legalPerson,
                        license: res.fileID,
                        name: value.name,
                        phone: value.phone,
                        scale: parseInt(value.scale) + '人',
                        address: value.address,
                        addressDetail: value.addressDetail,
                        trade: value.trade 
                      }
                    })
                    setTimeout(function () {
                      //上一页刷新
                      let pages = getCurrentPages()
                      let beforePage = pages[pages.length - 2]
                      beforePage.onLoad()
                      wx.navigateBack({
                        delta: 1,
                      })
                    }, 2500)
                  }
                })
              }
            })
          }
        }
      }
    })
  },

  //返回个人中心
  back() {
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断当前是否为修改信息
    if (wx.getStorageSync('company')) {
      let company = wx.getStorageSync('company')
      this.setData({
        isChange: true,
        company: company,
        license: company.license,
        selectTrade: company.trade
      })
      wx.setNavigationBarTitle({
        title: '修改信息'
      })
    }
  },

  onReady() {
    this.animation = wx.createAnimation({
      duration: 200
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})