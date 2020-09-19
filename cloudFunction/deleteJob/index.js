// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'sdb-0bdlv'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let _id = event._id
  return await db.collection('jobs_school').doc(_id).remove()
}