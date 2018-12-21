<template>
  <div id="app">
    <!--主页-->
    <div class="main-wrapper">
      <div class="nav-tree">
        <div class="tree-con">
          <div class="tree-header">
            <span>{{pageData.imageList && pageData.imageList.title}}</span>
          </div>
          <div class="img-tree" >
            <el-tree ref="imageTree"
                     :data="treeData"
                     node-key="id"
                     default-expand-all
                     :expand-on-click-node='false'>
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <img :src="data.icon" class="node-icon" />
              <span class="node-title">{{ node.label }}</span>
              <input type="text" :value="node.label" class="node-edit">
            </span>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="main-con">
        <div class="img-con">
          <div class="img-body">
            <div class="prev-btn">
              <img src="../../assets/img/images/left.png" alt="">
            </div>
            <div class="showImg">
              <img src="../../assets/img/images/ocrBg4.jpg" alt="" class="displayImg">
            </div>
            <div class="next-btn">
              <img src="../../assets/img/images/right.png" alt="">
            </div>
          </div>
          <div class="img-footer">
            <div class="function-setting setting">
              <span>功能设置</span>
              <img src="../../assets/img/images/settings/function1.png" alt="">
            </div>
            <div class="line">
              <i class="iconfont icon-vertical_line"></i>
            </div>
            <div class="function-setting setting">
              <span>扫描设置</span>
              <img src="../../assets/img/images/settings/function1.png" alt="">
            </div>
            <div class="line">
              <i class="iconfont icon-vertical_line"></i>
            </div>
            <div class="function-setting setting">
              <span>ocr设置</span>
              <img src="../../assets/img/images/settings/function1.png" alt="">
            </div>
            <div class="line">
              <i class="iconfont icon-vertical_line"></i>
            </div>
            <div class="function-setting setting">
              <span>左旋</span>
              <img src="../../assets/img/images/settings/function1.png" alt="">
            </div>
            <div class="line">
              <i class="iconfont icon-vertical_line"></i>
            </div>
            <div class="function-setting setting">
              <span>右旋</span>
              <img src="../../assets/img/images/settings/function1.png" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="right-btn">
        <div class="device-btn btn-item">
          <img src="../../assets/img/images/rightBtn/device.png" alt="">
          <span>设备</span>
        </div>
        <div class="device-btn btn-item">
          <img src="../../assets/img/images/rightBtn/scan.png" alt="">
          <span>扫描</span>
        </div>
        <div class="device-btn btn-item">
          <img src="../../assets/img/images/rightBtn/import.png" alt="">
          <span>导入</span>
        </div>
        <div class="device-btn btn-item">
          <img src="../../assets/img/images/rightBtn/qrcode.png" alt="">
          <span>移动扫描</span>
        </div>
        <div class="device-btn btn-item">
          <img src="../../assets/img/images/rightBtn/thumbnail.png" alt="">
          <span>缩略图</span>
        </div>
        <div class="device-btn btn-item">
          <img src="../../assets/img/images/rightBtn/ocr.png" alt="">
          <span>ocr识别</span>
        </div>
        <div class="device-btn btn-item">
          <img src="../../assets/img/images/rightBtn/save.png" alt="">
          <span>上传</span>
        </div>
        <div class="device-btn btn-item">
          <img src="../../assets/img/images/rightBtn/commit.png" alt="">
          <span>提交</span>
        </div>
        <div class="device-btn btn-item">
          <img src="../../assets/img/images/rightBtn/print.png" alt="">
          <span>打印</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {GetUrlParam,ws,imageServer} from '../../utils'
import chData from '../../json/ch.json'
import enData from '../../json/en.json'
import hkData from '../../json/hk.json'
import axios from 'axios'
export default {
  name: 'App',
  data() {
    return {
      pageData:{},
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      websocketFlag: 0, //websocket连接标识，0未连接，1建立连接
      /* =====websocket通讯状态标志位，0表示从未连接，1表示websocket已经连接。若为1，websocket断开连接，提示重启客户端，若为0，websocket断开连接，提示下载客户端===== */
      websocketDid: 0,
      initParameterObj: {}, //websocket初始化对象
      isShowLoading: true,
      loadingMessage: "",
      parentData: null,
      myTree: null
    };
  },
  mounted (){
    //console.log(GetUrlParam(location.search))
    this._initData ()
    this._initWS ()
  },
  methods: {
    _initWS (){
      try{
        ws.onopen = function (evt) {//打开websocket
          if(ws.readyState===1){//websocket状态判断，readyState为1连接成功，readyState为0连接失败
            this.websocketFlag = 1;//此时readyState为1，表示连接成功
            const basePath = "http://192.168.36.88:8199/";
            //向服务器后台请求初始化参数
            axios.get(basePath + "scanParms/getScanParmsByDepartnum?departnum=global")
              //请求成功建立websocket初始化连接
              .then(response => {
                console.log(response)
                this.initParameterObj = response.data
                const searchUrl = GetUrlParam(location.search);
                //遍历searchUrl参数对象
                for (let str in searchUrl){
                  if(str === 'loginUser' || str === 'nextbillname'){
                    continue
                  }
                  this.initParameterObj[str] = searchUrl[str]
                }
                console.log(this.initParameterObj)
                console.log("INIT&" + JSON.stringify(this.initParameterObj))
                ws.send("INIT&" + JSON.stringify(this.initParameterObj))
              })
              //请求失败报错
              .catch(response => {
                alert('请求失败，请稍后再试')
              })
          }
        }
        /*ws.onclose = function (evt) {//websocket断开连接处理
          if(websocketDid == 0){//websocket一次都没有连接上，即刷新页面之后
            if(connectCount < 20){//websocket第一次连接失败，尝试启动客户端
              connectCount++;//
              var t = setTimeout(function(){
                websocketinit();
              },1000);
            }else{//websocket第20次连接失败，弹出提示：“请点击确定进入程序下载页面”
              $("#websocketModalInfo").empty();
              $("#websocketModalInfo").append("<p>"+downloadProgram+"</p>");
              $("#websocketModal-btn").click();
              $("#websocketModal-ok").on("click",function(){
                if(LanguageIndex == 0){
                  window.open("download.html","_blank");
                }else if(LanguageIndex == 1){
                  window.open("downloadHK.html","_blank");
                }else if(LanguageIndex == 2){
                  window.open("downloadEN.html","_blank");
                }else{
                  console.log("download file not found");
                }
              });
            }
          }else{//websocket连接成功，突然断开，此时需要用户点击确定，刷新页面
            $("#websocketModalInfo").empty();
            $("#websocketModalInfo").append("<p>"+websocketConnection+"</p>");
            $("#websocketModal-btn").click();
            $("#websocketModal-ok").on("click",function(){
              var t = setTimeout(function(){
                window.location.reload();
              },1000);
            });
          }
        };*/
        /*ws.onmessage = function (evt) {  //websocket正在通讯
          evt.stopPropagation();
          evt.preventDefault();
          this.websocketDid = 1;//websocket正在通讯，表示已经连接，给websocket已经连接过的标志置1，为用户退出当前客户端做准备
          json_obj = JSON.parse(evt.data);//获取的信息为字符串，此时将其转换为json格式
          switch(json_obj.Operation){
            case "INIT":    //case中的字符串为接口，详细请看接口文档
              console.log(json_obj)
              console.log(json_obj.RstMesg);
              initMadal_remove(); //此时初始化完成，移除初始化模态窗
              init(json_obj); //初始化处理
              break;
            case "UpdateSetup"://1更新设备信息，包括扫描单双面，颜色，dpi，文件格式，传输模式，版面；2更新ocr识别信息
              console.log(json_obj);
              UpdateSetupDo(json_obj);
              break;
            case "importfile":  //case中的字符串为接口，详细请看接口文档
              console.log(json_obj);
              importMadal_remove();
              if(json_obj){
                importFiles = json_obj.Total;
                console.log(importFiles)
                if(json_obj.RstCode === "0000"){
                  if(importFiles){
                    ocrModal(); //弹出模态窗，进度条展示
                    saveFlag = 0;
                    //console.log(json_obj.RstMesg);
                  }
                }else{
                  promptModal(promptModalTitle,'<p>' + json_obj.RstMesg + '</p>');
                }
                totalFiles = totalFiles + importFiles;
                scantypeScan = 1;
                // websocket.send("Refresh");//刷新接口"Refresh"
                websocket.send("Refresh");//刷新接口"Refresh"
                interval = setInterval(function(){
                  console.log(refreshFlag);
                  if(refreshFlag == 1){//如果刷新成功
                    refreshFlag = 0;//将刷新成功标志位清零
                    // reseiveRefresh = 0;
                    clearInterval(interval);//关闭定时器，停止刷新
                  }else{
                    console.log(refreshFlag);
                    websocket.send("Refresh");//刷新接口"Refresh"
                  }
                },2000);
              }
              break;
            case "QueryGroup": //case中的字符串为接口，详细请看接口文档
              console.log('QueryGroup',json_obj);
              QueryGroupDo(json_obj);
              break;
            case "imagefinish": //case中的字符串为接口，详细请看接口文档
              console.log('imagefinish',json_obj)
              rotate_fullname = json_obj.fullname;
              break;
            case "Refresh":
              // reseiveRefresh = 1;
              console.log(json_obj);
              fileCounts = 0;
              group(json_obj);
              if(deleteFlag == 1){
                deleteFlag = 0;
                if(new_import_obj.length == 0){//删除所有图像后，清除图像中的点
                  $("#showImg").removeAttr("src");
                  $('#prev-page').css('display','none');
                  $('#next-page').css('display','none');
                }
              }
              break;
            case "GetInfo": //case中的字符串为接口，详细请看接口文档
              console.log(json_obj,json_obj.ocr);
              //处理接受到的OCR信息，json_obj接口传递所有信息，json_obj.RstCode接口传递成功失败码，
              //RstCode,json_obj.fullname ocr解析的全路径，json_obj.ocr ocr解析的详细信息
              getOcrMessage(json_obj,json_obj.RstCode,json_obj.fullname,json_obj.ocr);
              break;
            case "GetDevice": //case中的字符串为接口，详细请看接口文档
              console.log('GetDevice',json_obj)
              getDeviceDo(json_obj);
              break;
            case "SCAN": //case中的字符串为接口，详细请看接口文档
              console.log('SCAN',json_obj);
              if(json_obj){
                if(json_obj.RstCode == "0000"){
                  scanFiles = json_obj.Total;
                  saveFlag = 0;
                }
              }
              totalFiles = totalFiles + scanFiles;
              scantypeScan = 1;
              websocket.send("Refresh");//刷新接口"Refresh"
              interval = setInterval(function(){
                if(refreshFlag == 1){//如果刷新成功
                  refreshFlag = 0;//将刷新成功标志位清零
                  // reseiveRefresh = 0;
                  clearInterval(interval);//关闭定时器，停止刷新
                }else{
                  websocket.send("Refresh");//刷新接口"Refresh"
                }
              },2000);
              SCANDo(json_obj);
              break;
            case "SAVE": //case中的字符串为接口，详细请看接口文档
              saveMadal_remove();
              console.log(json_obj);
              SAVEDo(json_obj);
              break;
            case "Commit": //case中的字符串为接口，详细请看接口文档
              console.log(json_obj);
              CommitDo(json_obj);
              break;
            case "APPRegister":
              console.log(json_obj);
              getQRcode(json_obj);
              break;
            case "APPisMobileScan":
              console.log(json_obj);
              APPisMobileScanDo(json_obj);
              break;
            case "APPMobileScan":
              console.log(json_obj);
              APPMobileScanDo(json_obj);
              break;
            case "APPDown":
              console.log(json_obj);
              ddFalg = 1;
              APPDownDo(json_obj);
              break;
            case "CommitOCR": //case中的字符串为接口，详细请看接口文档
              console.log('CommitOCR',json_obj)
              CommitOCRDo(json_obj);
              break;
            case "DeleteOCR": //case中的字符串为接口，详细请看接口文档
              console.log(json_obj);
              DeleteOCRDo(json_obj);
              break;
            case "Synchronize": //case中的字符串为接口，详细请看接口文档
              console.log('Synchronize',json_obj)
              SynchronizeDo(json_obj);
              break;
            case "Rotate": //case中的字符串为接口，详细请看接口文档
              console.log(json_obj);
              RotateDo(json_obj);
              break;
            case "DeleteNode": //case中的字符串为接口，详细请看接口文档
              console.log(json_obj);
              DeleteNodeDo(json_obj);
              break;
            case "UpdateTree": //case中的字符串为接口，详细请看接口文档
              console.log(json_obj);
              UpdateTreeDo(json_obj);
              break;
            case "InvoiceCheck":
              console.log(json_obj);
              GetInvoiceCheckDo(json_obj);
              break;
            case "InterventionGroup":
              console.log("InterventionGroup",json_obj);
              InterventionGroupDo(json_obj);
              break;
            case "SetDevice":
              console.log("SetDevice",json_obj);
              SetDeviceDo(json_obj);
              break;
          }
        };*/
        ws.onerror = function (evt) {
          console.log("websocket发生错误");
        };
      }catch(e){
        alert(e + "\n当前浏览器版本太低,请升级浏览器版本");
      }
    },
    /*初始化显示页面数据，默认中文简体*/
    _initData (){
      this.myTree = this.$refs.imageTree
      const searchUrl = GetUrlParam(location.search)
      console.log(searchUrl)
      switch (searchUrl.LanguageIndex){
        case '0':
          this.pageData = chData
          console.log(this.pageData)
          break
        case '1':
          this.pageData = hkData
          break
        case '2':
          this.pageData = enData
          break
        default:
          this.pageData = chData
          break
      }
      if(searchUrl.billtypename){
        this.parentData = {
          id: '0',
          label: searchUrl.billtypename,
          icon: imageServer + 'images/tree/parentNode.png'
        }
        this.myTree.append(this.parentData,this.myTree.root)
      }else if(searchUrl.nextbillname){
        if(nextbillname.indexOf('@')!==-1){

        }else {
          const nextTreeData = {
            id: '01',
            label: searchUrl.nextbillname,
            icon: imageServer + 'images/tree/parentNode.png'
          }
          const parent = this.myTree.getNode(this.parentData)
          this._addNextTreeNode(parent,nextTreeData)
        }
      }
    },

    /*添加二级树节点*/
    _addNextTreeNode (parent,data){
      this.myTree.append(data,parent)
    }

  }
}
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  #app
    width 100%
    height 100%
    background url('../../assets/img/images/background/bg2.png')
    background-size cover
    background-attachment fixed
    position relative
    .main-wrapper
      position absolute
      top: 50px
      bottom 50px
      left 0px
      right 0px
      display flex
      .nav-tree
        width 25%
        height 100%
        .tree-con
          height 100%
          margin-left 50px
          background-color rgba(99,118,194,0.5)
          .tree-header
            width 100%
            text-align center
            font-size 18px
            font-weight bold
            color white
            padding 10px 0px
            border-bottom 1px solid #000
          .img-tree
            padding 10px 10px
            .el-tree
              background none
              color white
              .node-edit
                display none
              .is-current
                &>.el-tree-node__content
                  color #999
              .el-tree-node
                .custom-tree-node
                  >img
                    width 16px
                    vertical-align middle
                .el-tree-node__content
                  background-color rgba(99,118,194,0)
                  &:hover
                    background-color rgba(99,118,194,0.5)
      .main-con
        width 75%
        height 100%
        .img-con
          height 100%
          margin-left 20px
          margin-right 80px
          position relative
          .img-body
            position absolute
            left 0
            bottom 50px
            top 0
            right 0
            padding 10px 10px
            .prev-btn
              width 30px
              height 100%
              float left
              display flex
              justify-content center
              align-items center
              >img
                width 30px
            .next-btn
              width 30px
              height 100%
              float right
              display flex
              justify-content center
              align-items center
              >img
                width 30px
            .showImg
              position absolute
              top 10px
              bottom 10px
              left 60px
              right 60px
              display flex
              justify-content center
              align-items center
              .displayImg
                max-height 100%
                max-width 100%
          .img-footer
            position absolute
            left 0px
            bottom 0px
            height 50px
            width 100%
            display flex
            justify-content center
            align-items center
            color white
            .line
              margin 0 8px
            .setting
              display flex
              align-items center
              img
                width 14px
                height 14px
                vertical-align middle
                margin-left 5px
      .right-btn
        position fixed
        right 0
        top 0
        width 60px
        height 100%
        z-index 20
        background-color rgba(99,118,194,0.5)
        display flex
        flex-direction column
        justify-content center
        flex-shrink
        .btn-item
          width 100%
          height 60px
          display flex
          flex-direction column
          align-items center
          color white
          margin-bottom  3px
          font-size 12px
          justify-content space-around
          &:last-child
            margin-bottom 0
          >img
            width 40px
</style>
