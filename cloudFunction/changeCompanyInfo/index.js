// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init({
  env: 'sdb-0bdlv'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let _id = event._id  //获取相应记录的id
  let oldlicense = event.oldlicense  //旧营业执照存储id
  let newlicense = event.newlicense //新营业执照id
  //营业执照没有变动
  if (oldlicense == undefined || newlicense == undefined) {
    try {
      //对指定_id的记录进行更新
      return await db.collection('company').doc(_id).update({
        data: {
          name: event.name,
          legalPerson: event.legalPerson,
          phone: event.phone,
          address: event.address,
          introduction: event.introduction,
          duration: event.duration,
          capital: event.capital,
          scale: event.scale
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
  //营业执照发生变动
  else {
    try {
      //在云存储中删除旧执照
      await cloud.deleteFile({
        fileList: [oldlicense]
      })
      //更新信息
      return await db.collection('company').doc(_id).update({
        data: {
          name: event.name,
          legalPerson: event.legalPerson,
          phone: event.phone,
          address: event.address,
          introduction: event.introduction,
          duration: event.duration,
          capital: event.capital,
          scale: event.scale,
          license: newlicense
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
}

