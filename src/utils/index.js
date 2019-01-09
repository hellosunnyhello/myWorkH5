let GetUrlParam = function(url) {
  let thisParam = {}
  // 判断是否存在请求的参数
  if (url.indexOf("?") !== -1) {
    let str = url.substr(1);
    // 截取所有请求的参数，以数组方式保存
    let strs = str.split("&");
    for(var i = 0; i < strs.length; i ++) {
      // 获取该参数名称，值。
      thisParam[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1])
    }
  }
  // 返回改参数列表对象
  return thisParam
}

let getArrayKey = function (array,item) {
  for(let i=0;i<array.length;i++){
    if(array[i].item === item){
      return array[i]
    }
  }
}

let getArrayIndex = function (array,item) {
  for(let i=0;i<array.length;i++){
    if(array[i].item === item){
      return i
    }
  }
}

let computedInfo = function (array) {
  let info = []
  array.forEach((item,index)=>{
    let infoItem = {}
    for(let str in item){
      if(str==='value'||str==='item'){
        infoItem[str] = item[str]
      }
    }
    info.push(infoItem)
  })
  return info
}
let computedDetails = function (array) {
  let details = []
  array.forEach((detail,index)=>{
    let detailArray = []
    detail.forEach((item,index)=>{
      let detailItem = {}
      for(let str in item){
        if(str==='value'||str==='item'||str==='id'){
          detailItem[str] = item[str]
        }
      }
      detailArray.push(detailItem)
    })
    details.push(detailArray)
  })
  return details
}
let wsServer = 'ws://127.0.0.1:45679/'
let imageServer = 'http://127.0.0.1:45679/'

export {GetUrlParam,wsServer,imageServer,getArrayKey,getArrayIndex,computedInfo,computedDetails}
