// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'sdb-0bdlv'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  //增加投递数
  if (event.type == 'deliver') {
    return await db.collection('jobs_school').doc(event._id).update({
      data: {
        deliverNum: _.inc(1)
      }
    })
  }
  //增加浏览数
  else if (event.type == 'browse') {
    return await db.collection('jobs_school').doc(event._id).update({
      data: {
        browseNum: _.inc(1)
      }
    })
  }

}