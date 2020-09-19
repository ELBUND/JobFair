// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'sdb-0bdlv'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  //通过操作
  if (event.op == 'pass') {
    return await db.collection('company_mailbox').doc(event._id).update({
      data: {
        status: 'pass'
      }
    })
  }
  //撤销操作
  else if (event.op == 'wait') {
    return await db.collection('company_mailbox').doc(event._id).update({
      data: {
        status: 'wait'
      }
    })
  }
}