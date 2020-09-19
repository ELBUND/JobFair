const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: '',
    company: {},
    address: '',
    readmore: {
      show: false,
      status: false,
      tip: '查看更多'
    },
    addPhoto: false,
    pic: [],
    jobs: [],
    dataIndex: 0
  },

  //查询公司logo
  companyLogo() {
    let _this = this
    db.collection('company').doc(this.data.company._id).get({
      success(res) {
        if (res.data.logo != '') {
          _this.setData({
            logo: res.data.logo
          })
          _this.updateStorage()
        }
      }
    })
  },

  //上传logo
  uploadLogo() {
    let _this = this
    let company = this.data.company
    wx.showActionSheet({
      itemList: ['从手机相册选择', '拍照'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album'],
            success(res) {
              wx.showLoading({
                title: '上传中...'
              })
              let fileID = new Promise((reslove, reject) => {
                wx.cloud.uploadFile({
                  cloudPath: company.companyid + '/' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000) + '.png',
                  filePath: res.tempFilePaths[0],
                  success(res) {
                    reslove(res.fileID)
                  }
                })
              })
              fileID.then(res => {
                //首次上传logo
                if (_this.data.logo == '') {
                  wx.cloud.callFunction({
                    name: 'editCompanyLogo',
                    data: {
                      _id: company._id,
                      newlogo: res
                    }, success() {
                      wx.hideLoading()
                      wx.showToast({
                        title: '上传成功'
                      })
                      _this.setData({
                        logo: res
                      })
                      _this.companyLogo()
                    }
                  })
                }
                //修改logo
                else {
                  wx.cloud.callFunction({
                    name: 'editCompanyLogo',
                    data: {
                      _id: company._id,
                      newlogo: res,
                      oldlogo: _this.data.logo
                    }, success() {
                      wx.hideLoading()
                      wx.showToast({
                        title: '上传成功'
                      })
                      _this.setData({
                        logo: res
                      })
                      _this.companyLogo()
                    }
                  })
                }
              })
            }
          })
        } else if (res.tapIndex == 1) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['camera'],
            success(res) {
              wx.showLoading({
                title: '上传中...'
              })
              let fileID = new Promise((reslove, reject) => {
                wx.cloud.uploadFile({
                  cloudPath: company.companyid + '/' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000) + '.png',
                  filePath: res.tempFilePaths[0],
                  success(res) {
                    reslove(res.fileID)
                  }
                })
              })
              fileID.then(res => {
                //首次上传logo
                if (_this.data.logo == '') {
                  wx.cloud.callFunction({
                    name: 'editCompanyLogo',
                    data: {
                      _id: company._id,
                      newlogo: res
                    }, success() {
                      wx.hideLoading()
                      wx.showToast({
                        title: '上传成功'
                      })
                      _this.setData({
                        logo: res
                      })
                      _this.companyLogo()
                    }
                  })
                }
                //修改logo
                else {
                  wx.cloud.callFunction({
                    name: 'editCompanyLogo',
                    data: {
                      _id: company._id,
                      newlogo: res,
                      oldlogo: _this.data.logo
                    }, success() {
                      wx.hideLoading()
                      wx.showToast({
                        title: '上传成功'
                      })
                      _this.setData({
                        logo: res
                      })
                      _this.companyLogo()
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  //修改信息
  change() {
    wx.navigateTo({
      url: '/pages/companyRegister/companyRegister',
    })
  },

  //点击放大营业执照
  prelicense() {
    wx.previewImage({
      current: [this.data.company.license],
      urls: [this.data.company.license]
    })
  },

  //点击添加照片
  addPhoto() {
    this.setData({
      addPhoto: true
    })
  },

  //添加公司照片
  addPic() {
    let p = this.data.pic
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
                p.push(tempFilePaths[i])
              }
              _this.setData({
                pic: p
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
                p.push(tempFilePaths[i])
              }
              _this.setData({
                pic: p
              })
            }
          })
        }
      }
    })
  },

  //照片放大
  prePic(e) {
    wx.previewImage({
      current: this.data.pic[e.currentTarget.dataset.index],
      urls: this.data.pic,
    })
  },

  //删除照片
  delPic(e) {
    let p = this.data.pic
    let index = e.currentTarget.dataset.index
    p.splice(index, 1)
    this.setData({
      pic: p
    })
  },

  //确认添加
  addConfirm() {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确定进行本次修改吗？',
      success(res) {
        if (res.confirm) {
          let _id = _this.data.company._id
          let companyid = _this.data.company.companyid
          let pic = _this.data.pic
          let oldphotos = []
          let newphotos = []
          wx.showLoading({
            title: '操作中...'
          })
          //上传到云存储对应的公司文件夹里
          for (let i = 0; i < pic.length; i++) {
            newphotos.push(new Promise((reslove, reject) => {
              wx.cloud.uploadFile({
                cloudPath: companyid + '/' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000) + '.png',
                filePath: pic[i],
                success(res) {
                  reslove(res.fileID)
                }
              })
            }))
          }
          //等待所有图片上传完成
          Promise.all(newphotos).then(fileIDs => {
            console.log('上传完图片后', fileIDs)
            //获取旧照片存储id
            db.collection('company').doc(_id).get({
              success(res) {
                console.log(res)
                if (res.data.photos.length != 0) {
                  console.log('有旧照片')
                  oldphotos = res.data.photos
                  //对数据库对应的记录进行更新
                  wx.cloud.callFunction({
                    name: 'editCompanyPhoto',
                    data: {
                      _id: _id,
                      oldphotos: oldphotos,
                      newphotos: fileIDs
                    },
                    success() {
                      wx.hideLoading()
                      wx.showToast({
                        title: '操作成功'
                      })
                      setTimeout(function () {
                        _this.close()
                        _this.companyPhoto()
                      }, 1500)
                    }, fail(res) {
                      console.log(res)
                    }
                  })
                } else {
                  console.log('没有旧照片')
                  //对数据库对应的记录进行更新
                  wx.cloud.callFunction({
                    name: 'editCompanyPhoto',
                    data: {
                      _id: _id,
                      newphotos: fileIDs
                    },
                    success() {
                      wx.hideLoading()
                      wx.showToast({
                        title: '操作成功'
                      })
                      setTimeout(function () {
                        _this.close()
                        _this.companyPhoto()
                      }, 1500)
                    }, fail(res) {
                      console.log(res)
                    }
                  })
                }
              }
            })
          })
        }
      }
    })
  },

  //关闭添加照片弹窗
  close() {
    this.setData({
      addPhoto: false
    })
  },

  //查询公司环境的照片
  companyPhoto() {
    let _this = this
    wx.showLoading({
      title: '加载中...'
    })
    db.collection('company').doc(this.data.company._id).get({
      success(res) {
        Promise.all(res.data.photos.map((item) => {
          return wx.cloud.downloadFile({
            fileID: item
          })
        })).then((res) => {
          let p = []
          for (let i = 0; i < res.length; i++) {
            p.push(res[i].tempFilePath)
          }
          _this.setData({
            pic: p
          })
          _this.updateStorage()
          wx.hideLoading()
        })
      }
    })
  },

  //放大照片
  prephoto(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.current,
      urls: this.data.pic
    })
  },

  //查询公司发布的职位
  searchJobs(companyid) {
    let _this = this
    wx.showLoading({
      title: '加载中'
    })
    db.collection('jobs_school').where({
      companyid: companyid
    })
      .orderBy('postTime', 'desc')
      .get({
        success(res) {
          wx.hideLoading()
          if (res.data.length != 0) {
            _this.setData({
              jobs: res.data,
              dataIndex: 0
            })
          } else {
            _this.setData({
              jobs: []
            })
          }
        }
      })
  },

  //跳转详情
  jobDetail(e) {
    wx.setStorageSync('jobDetail', e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/jobDetail/jobDetail?isCompany=yes',
    })
  },

  //跳转发布职位
  toCreat() {
    wx.navigateTo({
      url: '/pages/post/post',
    })
  },

  //更新本地缓存
  updateStorage() {
    let company = this.data.company
    company.logo = this.data.logo
    company.photos = this.data.pic
    wx.setStorageSync('company', company)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从缓存中读取公司信息
    let company = wx.getStorageSync('company')
    let address = company.address.join('') + company.addressDetail
    this.setData({
      company: company,
      address: address
    })
    this.companyLogo()
    this.companyPhoto()
    this.searchJobs(company.companyid)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const query = wx.createSelectorQuery()
    let _this = this
    query.select("#introduction").boundingClientRect(function (rect) {
      const lineHeight = 18
      const height = rect.height  //获取文字显示的高度
      const status = 'readmore.status'
      const show = 'readmore.show'
      _this.setData({
        [show]: (height / lineHeight) > 4,
        [status]: (height / lineHeight) > 4
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
    let _this = this
    let jobs = this.data.jobs
    let dataIndex = this.data.dataIndex + 20
    //大于等于20条数据时查询加载更多
    if (jobs.length >= 20) {
      wx.showLoading({
        title: '加载中'
      })
      let company = wx.getStorageSync('company')
      db.collection('jobs_school').where({
        companyid: company.companyid
      })
        .orderBy('postTime', 'desc')
        .skip(dataIndex)
        .get({
          success(res) {
            wx.hideLoading()
            if (res.data.length != 0) {
              _this.setData({
                jobs: jobs.concat(res.data),
                dataIndex: dataIndex
              })
            } else {
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})