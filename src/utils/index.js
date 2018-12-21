let GetUrlParam = function(url) {
  let thisParam = {}
  // 判断是否存在请求的参数
  if (url.indexOf("?") !== -1) {
    let str = url.substr(1);
    // 截取所有请求的参数，以数组方式保存
    let strs = str.split("&");
    for(var i = 0; i < strs.length; i ++) {
      // 获取该参数名称，值。
      thisParam[strs[i].split("=")[0]]=strs[i].split("=")[1]
    }
  }
  // 返回改参数列表对象
  return thisParam
}

let wsServer = 'ws://127.0.0.1:45679/'
let imageServer = 'http://127.0.0.1:45679/'
let ws = new WebSocket(wsServer)
export {GetUrlParam,ws,imageServer}
