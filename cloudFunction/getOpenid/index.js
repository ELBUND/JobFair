// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'sdb-0bdlv'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  return openid
}