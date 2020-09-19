// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'sdb-0bdlv'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let oldlogo = event.oldlogo
  if (oldlogo == undefined || oldlogo == null) {
    return await db.collection('company').doc(event._id).update({
      data: {
        logo: event.newlogo
      }
    })
  } else {
    //云存储删除旧logo
    await cloud.deleteFile({
      fileList: [event.oldlogo]
    })
    return await db.collection('company').doc(event._id).update({
      data: {
        logo: event.newlogo
      }
    })
  }
}