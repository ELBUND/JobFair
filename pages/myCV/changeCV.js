const city = require("../../utils/allcity")
const db = wx.cloud.database()
const Time = require("../../utils/util")
const major = require("../../utils/major")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoUrl: [],
    hasChangePhoto: false,
    name: '',
    phone: '',
    weixin: '',
    email: '',
    major: '',
    index_edu: 0,
    education: ['点击选择学历', '中专', '大专', '本科', '硕士', '博士'],
    index_college: 0,
    college: major.college,
    index_major: 0,
    major: ['请选择专业'],
    projectList: [],  //项目经历
    workList: [],  //工作经历
    citys: city,  //组件所需的城市数据
    city_selected: '',
    city_flag: 0,
    hasSelected: false,  //未选择城市
    summaryList: [],  //个人总结
    otherList: [], //其他
  },

  //添加照片
  addPhoto() {
    let _this = this
    wx.showActionSheet({
      itemList: ['从手机相册选择', '拍照'],
      success(res) {
        console.log(res.tapIndex)
        //点击'从手机相册选择'
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sourceType: ['album'],
            success(res) {
              let tempFilePaths = res.tempFilePaths //本地相片文件路径
              console.log(res)
              _this.setData({
                photoUrl: tempFilePaths,
                hasChangePhoto: true
              })
            }
          })
        }
        //点击'拍照'
        else if (res.tapIndex == 1) {
          wx.chooseImage({
            count: 1,
            sourceType: ['camera'],
            success(res) {
              let tempFilePaths = res.tempFilePaths //本地相片文件路径
              console.log(res)
              _this.setData({
                photoUrl: tempFilePaths,
                hasChangePhoto: true
              })
            }
          })
        }
      }
    })
  },

  //性别选择
  sex_select(e) {
    console.log(e)
  },

  //学历选择
  education(e) {
    this.setData({
      index_edu: e.detail.value
    })
  },

  //院系选择
  college(e) {
    let index = e.detail.value
    this.setData({
      index_college: index
    })
    let m = ['请选择专业']
    let array = major.major
    for (let i = 0; i < array.length; i++) {
      if (array[i].college == this.data.college[index]) {
        m.push(...array[i].major)
        break
      }
    }
    this.setData({
      major: m,
      index_major: 0
    })
  },

  //专业选择
  major(e) {
    this.setData({
      index_major: e.detail.value
    })
  },

  //添加项目经历
  addProject() {
    let p = this.data.projectList
    p.push({
      pname: '',
      ptime: '',
      pjob: '',
      pdetail: ''
    })
    this.setData({
      projectList: p
    })
  },

  //输入项目标题
  input_pname(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    setTimeout(function () {
      _this.data.projectList[index].pname = e.detail.value
    }, 500)
  },

  //监听担任工作输入
  input_pjob(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    setTimeout(function () {
      _this.data.projectList[index].pjob = e.detail.value
    }, 500)
  },

  //输入项目完成时间
  input_ptime(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    setTimeout(function () {
      _this.data.projectList[index].ptime = e.detail.value
    }, 500)
  },

  //输入项目详情
  input_pdetail(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    setTimeout(function () {
      _this.data.projectList[index].pdetail = e.detail.value
    }, 500)
  },

  //删除项目经历
  delProject(e) {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该项目经历吗？',
      success(res) {
        if (res.confirm) {
          let p = _this.data.projectList
          let index = e.currentTarget.dataset.index
          p.splice(index, 1)
          _this.setData({
            projectList: p
          })
        }
      }
    })
  },

  //添加工作经历
  addWorkExp() {
    let w = this.data.workList
    w.push({
      wname: '', //公司名称
      wjob: '',  //所在职位
      wcity: '',  //所在城市
      wtime: '',  //任职时间
      wdetail: '' //工作内容
    })
    this.setData({
      workList: w
    })
  },

  //监听公司名称输入
  input_wname(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    setTimeout(function () {
      _this.data.workList[index].wname = e.detail.value
    }, 500)
  },

  //监听所在职位输入
  input_wjob(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    setTimeout(function () {
      _this.data.workList[index].wjob = e.detail.value
    }, 500)
  },

  //监听所在城市输入
  input_wcity(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    setTimeout(function () {
      _this.data.workList[index].wcity = e.detail.value
    }, 500)
  },

  //监听任职时间输入
  input_wtime(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    setTimeout(function () {
      _this.data.workList[index].wtime = e.detail.value
    }, 500)
  },

  //监听工作内容输入
  input_wdetail(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    setTimeout(function () {
      _this.data.workList[index].wdetail = e.detail.value
    }, 500)
  },

  //删除工作经历
  delWork(e) {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认要删除该工作经历吗?',
      success(res) {
        if (res.confirm) {
          let w = _this.data.workList
          let index = e.currentTarget.dataset.index
          w.splice(index, 1)
          _this.setData({
            workList: w
          })
        }
      }
    })
  },

  //弹出城市选择窗口
  city() {
    this.setData({
      city_flag: 1
    })
  },

  //弹窗中选择城市
  citySelected(e) {
    this.setData({
      city_selected: e.detail.name
    })
  },

  //确认选择城市
  confirmCtiy() {
    if (this.data.city_selected != '') {
      this.setData({
        city_flag: 0,
        hasSelected: true
      })
    } else {
      wx.showToast({
        title: '请选择城市',
        icon: 'none'
      })
    }
    this.onLoad()
  },

  //求职意向选择
  jobWanted(e) {
    this.setData({
      index_jobWanted: e.detail.value
    })
  },

  //添加个人总结
  addSummary() {
    let s = this.data.summaryList
    s.push({
      sdetail: ''
    })
    this.setData({
      summaryList: s
    })
  },

  //监听个人总结输入
  input_sdetail(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    setTimeout(function () {
      _this.data.summaryList[index].sdetail = e.detail.value
    }, 500)
  },

  //删除个人总结
  delSummary(e) {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认删除该条总结吗?',
      success(res) {
        if (res.confirm) {
          let s = _this.data.summaryList
          let index = e.currentTarget.dataset.index
          s.splice(index, 1)
          _this.setData({
            summaryList: s
          })
        }
      }
    })
  },

  //添加其他
  addOther() {
    let o = this.data.otherList
    o.push({
      odetail: ''
    })
    this.setData({
      otherList: o
    })
  },

  //监听其他输入
  input_odetail(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    setTimeout(function () {
      _this.data.otherList[index].odetail = e.detail.value
    }, 500)
  },

  //删除其他
  delOther(e) {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确认删除该项吗?',
      success(res) {
        if (res.confirm) {
          let o = _this.data.otherList
          let index = e.currentTarget.dataset.index
          o.splice(index, 1)
          _this.setData({
            otherList: o
          })
        }
      }
    })
  },

  //保存简历
  save(e) {
    let _this = this
    let info = e.detail.value
    let city = this.data.city_selected
    let projectList = this.data.projectList
    let workList = this.data.workList
    let photoUrl = this.data.photoUrl
    let summaryList = this.data.summaryList
    let otherList = this.data.otherList
    //检查是否填全信息
    //判断是否添加头像照片
    if (photoUrl == "") {
      wx.showModal({
        title: '提示',
        content: '请添加头像照片',
        showCancel: false
      })
      return -1;
    }
    //判断是否填写项目经历，有就判断，没有则不判断
    if (projectList.length > 0) {
      for (let i = 0; i < projectList.length; i++) {
        for (let key in projectList[i]) {
          if (projectList[i][key] == '') {
            wx.showToast({
              title: '请将项目经历填写完整，不能留空',
              icon: 'none'
            })
            return -1;
          }
        }
      }
    }
    //判断是否填写完整工作经历，有就判断，没有则不判断
    if (workList.length > 0) {
      for (let i = 0; i < workList.length; i++) {
        for (let key in workList[i]) {
          if (workList[i][key] == '') {
            wx.showToast({
              title: '请将工作经历填写完整，不能留空',
              icon: 'none'
            })
            return -1;
          }
        }
      }
    }
    //判断是否选择城市
    if (city == "") {
      wx.showModal({
        title: '提示',
        content: '请选择所在城市',
        showCancel: false
      })
      return -1;
    }
    for (let i in info) {
      if (info[i] == '点击选择学历') {
        wx.showToast({
          title: '请选择学历',
          icon: 'none'
        })
        return -1
      }
      if (info[i] == '请选择院系') {
        wx.showToast({
          title: '请选择院系',
          icon: 'none'
        })
        return -1
      }
      if (info[i] == '请选择专业') {
        wx.showToast({
          title: '请选择专业',
          icon: 'none'
        })
        return -1
      }
      if (info[i] == '') {
        wx.showModal({
          title: '提示',
          content: '请将信息填写完整',
          showCancel: false
        })
        return -1;
      }
    }
    //判断是否填写完整个人总结，有就判断，没有则不判断
    if (summaryList.length > 0) {
      for (let i = 0; i < summaryList.length; i++) {
        for (let key in summaryList[i]) {
          if (summaryList[i][key] == '') {
            wx.showToast({
              title: '请将个人总结填写完整，不能留空',
              icon: 'none'
            })
            return -1;
          }
        }
      }
    }
    //判断是否填写完整其他，有就判断，没有则不判断
    if (otherList.length > 0) {
      for (let i = 0; i < otherList.length; i++) {
        for (let key in otherList[i]) {
          if (otherList[i][key] == '') {
            wx.showToast({
              title: '请将其他项填写完整，不能留空',
              icon: 'none'
            })
            return -1;
          }
        }
      }
    }
    wx.showModal({
      title: '请确认',
      content: '是否保存修改',
      confirmText: '保存',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中...',
          })
          //将照片存储到云后台
          //是否为修改操作
          let hasChangePhoto = _this.data.hasChangePhoto
          let cloudPhotoID = wx.getStorageSync('myCV').photo
          //首次添加，则直接上传照片到云存储
          if (cloudPhotoID == undefined) {
            wx.cloud.uploadFile({
              cloudPath: "CV-photo/" + new Date().getTime() + '-' + Math.floor(Math.random() * 1000) + ".png",  //云存储路径以及文件名
              filePath: photoUrl[0],
              success(res) {
                console.log(res)
                let cloudPhotoFile = res.fileID
                //检查云数据库是否有该用户的记录，有就覆盖更新，没有则添加
                db.collection('CV').where({
                  _openid: wx.getStorageSync('openid')
                }).get({
                  success(res) {
                    console.log(res)
                    if (res.data.length == 0) {  //新添加
                      db.collection('CV').add({
                        data: {
                          photo: cloudPhotoFile,
                          name: info.name,
                          sex: info.sex,
                          school: info.school,
                          school_city: info.school_city,
                          education: info.education,
                          graduation_time: info.graduation_time,
                          major: info.major,
                          college: info.college,
                          projectList: projectList,
                          workList: workList,
                          summaryList: summaryList,
                          otherList: otherList,
                          city: city,
                          weixin: info.weixin,
                          phone: info.phone,
                          email: info.email,
                          creatTime: Time.formatTime(new Date())
                        },
                        success(res) {
                          console.log('添加成功---', res)
                          wx.hideLoading()
                          wx.showToast({
                            title: '保存成功',
                          })
                          setTimeout(function () {
                            //返回上一页并刷新
                            let pages = getCurrentPages()
                            let prePage = pages[pages.length - 2]
                            prePage.searchCV()
                            wx.navigateBack({
                              delta: 1,
                            })
                          }, 2000)
                        }, fail(res) {
                          console.log(res)
                        }
                      })
                    }
                    //数据库已经有该用户记录则覆盖
                    else {
                      db.collection('CV').doc(res.data[0]._id).update({
                        data: {
                          photo: cloudPhotoFile,
                          name: info.name,
                          sex: info.sex,
                          school: info.school,
                          school_city: info.school_city,
                          education: info.education,
                          graduation_time: info.graduation_time,
                          major: info.major,
                          college: info.college,
                          projectList: projectList,
                          workList: workList,
                          summaryList: summaryList,
                          otherList: otherList,
                          city: city,
                          weixin: info.weixin,
                          phone: info.phone,
                          email: info.email,
                        },
                        success(res) {
                          console.log('更新成功---', res)
                          wx.hideLoading()
                          wx.showToast({
                            title: '保存成功',
                          })
                          setTimeout(function () {
                            //返回上一页并刷新
                            let pages = getCurrentPages()
                            let prePage = pages[pages.length - 2]
                            prePage.searchCV()
                            wx.navigateBack({
                              delta: 1,
                            })
                          }, 2000)
                        }
                      })
                    }
                  }
                })
              },
              fail(res) {
                wx.hideLoading()
                console.log(res)
              }
            })
          }
          //修改操作，同时判断用户是否重新选择照片
          else {
            //重新选择了照片
            if (hasChangePhoto == true) {
              //删除用户云存储原有的照片
              wx.cloud.deleteFile({
                fileList: [cloudPhotoID],
                success(res) {
                  console.log("云存储删除文件成功", res)
                }
              })
              //重新上传
              wx.cloud.uploadFile({
                cloudPath: "CV-photo/" + new Date().getTime() + '-' + Math.floor(Math.random() * 1000) + ".png",  //云存储路径以及文件名
                filePath: photoUrl[0],
                success(res) {
                  console.log(res)
                  let cloudPhotoFile = res.fileID
                  let _id = wx.getStorageSync('myCV')._id  //用户对应记录的_id
                  db.collection('CV').doc(_id).update({
                    data: {
                      photo: cloudPhotoFile,
                      name: info.name,
                      sex: info.sex,
                      school: info.school,
                      school_city: info.school_city,
                      education: info.education,
                      graduation_time: info.graduation_time,
                      major: info.major,
                      college: info.college,
                      projectList: projectList,
                      workList: workList,
                      summaryList: summaryList,
                      otherList: otherList,
                      city: city,
                      weixin: info.weixin,
                      phone: info.phone,
                      email: info.email,
                    },
                    success(res) {
                      console.log('更新成功---', res)
                      wx.hideLoading()
                      wx.showToast({
                        title: '保存成功',
                      })
                      setTimeout(function () {
                        //返回上一页并刷新
                        let pages = getCurrentPages()
                        let prePage = pages[pages.length - 2]
                        prePage.searchCV()
                        wx.navigateBack({
                          delta: 1,
                        })
                      }, 2000)
                    },
                    fail(res) {
                      wx.hideLoading()
                      console.log(res)
                    }
                  })
                },
                fail(res) {
                  wx.hideLoading()
                  console.log(res)
                }
              })
            }
            //没有重新选择照片，则不作任何操作，对其他数据进行覆盖上传
            else {
              let _id = wx.getStorageSync('myCV')._id  //用户对应记录的_id
              db.collection('CV').doc(_id).update({
                data: {
                  name: info.name,
                  sex: info.sex,
                  school: info.school,
                  school_city: info.school_city,
                  education: info.education,
                  graduation_time: info.graduation_time,
                  major: info.major,
                  college: info.college,
                  projectList: projectList,
                  workList: workList,
                  summaryList: summaryList,
                  otherList: otherList,
                  city: city,
                  weixin: info.weixin,
                  phone: info.phone,
                  email: info.email,
                },
                success(res) {
                  console.log('更新成功---', res)
                  wx.hideLoading()
                  wx.showToast({
                    title: '保存成功',
                  })
                  setTimeout(function () {
                    //返回上一页并刷新
                    let pages = getCurrentPages()
                    let prePage = pages[pages.length - 2]
                    prePage.searchCV()
                    wx.navigateBack({
                      delta: 1,
                    })
                  }, 2000)
                },
                fail(res) {
                  wx.hideLoading()
                  console.log(res)
                }
              })
            }
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isChange()
    let c = ['请选择院系']
    let college = major.college
    c.push(...college)
    this.setData({
      college: c
    })
  },

  //是否从修改跳转到此页面
  isChange() {
    if (wx.getStorageSync('myCV')) {
      let myCV = wx.getStorageSync('myCV')
      wx.setNavigationBarTitle({
        title: '简历修改'
      })
      this.setData({
        photoUrl: [myCV.photo],
        name: myCV.name,
        school: myCV.school,
        school_city: myCV.school_city,
        graduation_time: myCV.graduation_time,
        major: myCV.major,
        college: myCV.college,
        projectList: myCV.projectList,
        city_selected: myCV.city,
        hasSelected: true,
        phone: myCV.phone,
        email: myCV.email,
        weixin: myCV.weixin,
        summaryList: myCV.summaryList,
        otherList: myCV.otherList
      })
    }
  },

  onUnload() {
    //关闭页面时清除缓存
    wx.removeStorageSync('myCV')
  }
})