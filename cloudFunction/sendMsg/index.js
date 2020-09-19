// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'sdb-0bdlv'
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event); // 云函数中的console在云开发控制台-日志中查看
  return sendTemplateMessage(event);
}

//小程序模版消息推送
async function sendTemplateMessage(event) {
  const { OPENID } = cloud.getWXContext(); // 用户的openId
  const templateId = 'y8vrYkoTvdxoO8PFnPSEntC1o5yRRGFbykxbLWC_bcQ';
  const data = { // 这里根据自己实际订阅的消息模板来写
    'thing1': {
      value: event.detail,
    },
    'date3': {
      value: event.time,
    },
    'name5': {
      value: event.sender,
    },
    'thing4': {
      value: event.remarks,
    }
  };
  const sendResult = await cloud.openapi.subscribeMessage.send({
    touser: 'oIVJH42__BAUfXgYl7rJCWxWKz5A',
    templateId: templateId,
    data: data,
    page: 'pages/home/home', // 点击消息跳转的小程序页面，非必填
    miniprogramState: 'developer' // 开发版/体验版/正式版
  })

  return sendResult;
}