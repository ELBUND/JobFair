const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentNum: 0,
    phone: '',
    photos: [],
    addmore: true,
    detail: ''
  },

  //监听输入字数
  currentNum(e) {
    this.setData({
      currentNum: e.detail.cursor,
      detail: e.detail.value
    })
  },

  //获取用户手机号码
  getPhoneNumber(e) {
    if (e.detail.cloudID) {
      let _this = this
      wx.showLoading({
        title: '操作中...',
      })
      wx.cloud.callFunction({
        name: 'getPhone',
        data: {
          cloudID: e.detail.cloudID
        },
        success(res) {
          wx.hideLoading()
          _this.setData({
            phone: res.result.list[0].data.phoneNumber
          })
        },
        fail() {
          wx.hideLoading()
          wx.showToast({
            title: '发生了错误,请重新授权',
            icon: 'noen'
          })
        }
      })
    }
  },

  //添加照片
  addPhoto() {
    let p = this.data.photos
    let _this = this
    let num = 9 - p.length
    wx.showActionSheet({
      itemList: ['手机相册选择', '拍照'],
      success(res) {
        //手机相册选择
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: num,
            sourceType: ['album'],
            success(res) {
              let tempFilePaths = res.tempFilePaths //本地相片文件路径
              for (let i = 0; i < tempFilePaths.length; i++) {
                p.push({
                  url: tempFilePaths[i]
                })
              }
              _this.setData({
                photos: p
              })
            }
          })
        }
        //拍照
        else if (res.tapIndex == 1) {
          wx.chooseImage({
            count: num,
            sourceType: ['camera'],
            success(res) {
              let tempFilePaths = res.tempFilePaths //本地相片文件路径
              for (let i = 0; i < tempFilePaths.length; i++) {
                p.push({
                  url: tempFilePaths[i]
                })
              }
              _this.setData({
                photos: p
              })
            }
          })
        }
      }
    })
  },

  //删除照片
  delPhoto(e) {
    let p = this.data.photos
    let index = e.currentTarget.dataset.index
    p.splice(index, 1)
    this.setData({
      photos: p,
      addmore: true
    })
  },

  //确认举报
  confirm() {
    //检查信息是否输入完整
    if (this.data.currentNum = 0) {
      wx.showToast({
        title: '请输入举报原因'
      })
      return -1
    }
    if (this.data.phone == '') {
      wx.showToast({
        title: '请输入手机号码'
      })
      return -1
    }
    let _this = this
    let photos = this.data.photos
    let photoArray = []
    let job = wx.getStorageSync('jobDetail')
    wx.showModal({
      title: '提示',
      content: '确认举报吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中'
          })
          //上传照片
          if (photos.length > 0) {
            for (let i = 0; i < photos.length; i++) {
              photoArray.push(new Promise((reslove, reject) => {
                wx.cloud.uploadFile({
                  cloudPath: 'report/' + job.companyid + '/' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000) + '.png',
                  filePath: photos[i].url,
                  success(res) {
                    reslove(res.fileID)
                  },fail(res){
                    console.log(res)
                  }
                })
              }))
            }
            //等待上传完所有
            Promise.all(photoArray).then(fileIDs => {
              db.collection('report').add({
                data: {
                  reporterOpenid: wx.getStorageSync('openid'),  //举报者openid
                  phone: _this.data.phone,  //举报者电话
                  detail: _this.data.detail,  //举报原因
                  photos: fileIDs,  //照片
                  companyid: job.companyid  //举报的公司id
                },
                success() {
                  wx.hideLoading()
                  wx.showToast({
                    title: '举报成功'
                  })
                }
              })
            })
          } else {
            db.collection('report').add({
              data: {
                reporterOpenid: wx.getStorageSync('openid'),  //举报者openid
                phone: _this.data.phone,  //举报者电话
                detail: _this.data.detail,  //举报原因
                companyid: job.companyid  //举报的公司id
              },
              success() {
                wx.hideLoading()
                wx.showToast({
                  title: '举报成功'
                })
              }
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})