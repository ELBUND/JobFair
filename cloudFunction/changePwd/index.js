// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'sdb-0bdlv'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.type == 'change') {
    return await db.collection('company').doc(event._id).update({
      data: {
        password: event.newPwd
      }
    })
  }
}