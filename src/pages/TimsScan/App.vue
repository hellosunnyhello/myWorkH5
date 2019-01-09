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
                     :indent="8"
                     default-expand-all
                     @node-click = 'nodeClickHandle'
                     @current-change = 'currentNodeChange'
                     @node-contextmenu = "rightMenuHandler"
                     @node-expand = "resetRightMenu"
                     @node-collapse = "resetRightMenu"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <img :src="data.icon" class="node-icon" />
                <span class="node-title">{{ node.label }}</span>
                <input type="text" class="node-edit"
                  ref="editInput" v-model="testEdit" @click.stop="clickEditInput">
              </span>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="main-con">
        <div class="img-con">
          <div class="img-body">
            <div class="prev-btn" v-if="mainImgSrc" @click="showPrevImg" ref="prev">
              <img src="../../assets/img/images/left.png" alt="">
            </div>
            <div class="showImg" v-viewer="{navbar: false}" ref="mainImgCon">
              <vue-easy-print ref="easyPrint" tableShow>
                <img :src="mainImgSrc" alt="" class="displayImg" title="影像展示图" ref="mainImg">
              </vue-easy-print>
            </div>
            <div class="next-btn" v-if="mainImgSrc" @click="showNextImg" ref="next">
              <img src="../../assets/img/images/right.png" alt="">
            </div>
          </div>
          <div class="img-footer">
            <div class="function-setting setting" @click="functionSet">
              <span>功能设置</span>
              <img src="../../assets/img/images/settings/function1.png" alt="">
            </div>
            <div class="line">
              <i class="iconfont icon-vertical_line"></i>
            </div>
            <div class="function-setting setting" @click="scanSet">
              <span>扫描设置</span>
              <img src="../../assets/img/images/settings/function1.png" alt="">
            </div>
            <div class="line">
              <i class="iconfont icon-vertical_line"></i>
            </div>
            <div class="function-setting setting"  @click="ocrSet">
              <span>ocr设置</span>
              <img src="../../assets/img/images/settings/function1.png" alt="">
            </div>
            <div class="line">
              <i class="iconfont icon-vertical_line"></i>
            </div>
            <div class="function-setting setting" :class="{grey:isGreyRotateBtn}"
              @click="rotateHandler(0)">
              <span>左旋</span>
              <img src="../../assets/img/images/settings/function1.png" alt="">
            </div>
            <div class="line">
              <i class="iconfont icon-vertical_line"></i>
            </div>
            <div class="function-setting setting" :class="{grey:isGreyRotateBtn}"
                 @click="rotateHandler(1)">
              <span>右旋</span>
              <img src="../../assets/img/images/settings/function1.png" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="right-btn" v-if="isShowRightTab">
        <div class="device-btn btn-item" v-if="initSysParams.Device === '1'"
          @click="getDeviceHandle">
          <img src="../../assets/img/images/rightBtn/device.png" alt="">
          <span>设备</span>
        </div>
        <div class="device-btn btn-item" v-if="initSysParams.doubleScan === '1' || initSysParams.singleScan === '1'"
          @click="scanHandler">
          <img src="../../assets/img/images/rightBtn/scan.png" alt="">
          <span>扫描</span>
        </div>
        <div class="device-btn btn-item" v-if="initSysParams.Import === '1'"
          @click="importHandler">
          <img src="../../assets/img/images/rightBtn/import.png" alt="">
          <span>导入</span>
        </div>
        <div class="device-btn btn-item" v-if="initSysParams.PhoneScan === '1'">
          <img src="../../assets/img/images/rightBtn/qrcode.png" alt="">
          <span>移动扫描</span>
        </div>
        <div class="device-btn btn-item" v-if="initSysParams.Thumbnail === '1'">
          <img src="../../assets/img/images/rightBtn/thumbnail.png" alt="">
          <span>缩略图</span>
        </div>
        <div class="device-btn btn-item" v-if="initSysParams.OCRShow === '1'"
          @click="ocrShowHandler">
          <img src="../../assets/img/images/rightBtn/ocr.png" alt="">
          <span>ocr识别</span>
        </div>
        <div class="device-btn btn-item" v-if="initSysParams.Save === '1'"
          @click="saveHandler" :class="{grey: isGreyCommit}">
          <img src="../../assets/img/images/rightBtn/save.png" alt="">
          <span>上传</span>
        </div>
        <div class="device-btn btn-item" v-if="initSysParams.Commit === '1'"
          @click="commitHandler" :class="{grey: isGreyCommit}">
          <img src="../../assets/img/images/rightBtn/commit.png" alt="">
          <span>提交</span>
        </div>
        <div class="device-btn btn-item" v-if="initSysParams.printBtn === '1'"
          @click="printHandler">
          <img src="../../assets/img/images/rightBtn/print.png" alt="">
          <span>打印</span>
        </div>
      </div>
    </div>
    <ul class="right-menu" v-show="isShowRightMenu" ref="rightMenu">
      <li class="menu-item ocr-item" v-show="isImage && OCRShow">
        <span class="menu-icon">
          <i class="iconfont icon-saomiaoshibie380"></i>
        </span>
        <span class="menu-title">OCR识别</span>
      </li>
      <li class="menu-item intervention-item" v-show="isImage && scanType==='2'"
        @click="rightIntervention">
        <span class="menu-icon">
          <i class="iconfont icon-wenjianjia1"></i>
        </span>
        <span class="menu-title">干预分组</span>
      </li>
      <li class="menu-item save-item" v-show="initSysParams.saveAs === '1'"
        @click="rightSaveAs">
        <span class="menu-icon">
          <i class="iconfont icon-lingcunwei"></i>
        </span>
        <span class="menu-title">另存为</span>
      </li>
      <li class="menu-item edit-item" v-show="isImage && Rename"
        @click.stop="rightRename">
        <span class="menu-icon">
          <i class="iconfont icon-iconset0137"></i>
        </span>
        <span class="menu-title">重命名</span>
      </li>
      <li class="menu-item delete-item" v-show="DeleteNode" @click="rightDelete">
        <span class="menu-icon">
          <i class="iconfont icon-shanchu2"></i>
        </span>
        <span class="menu-title">删除</span>
      </li>
    </ul>
    <!--正在加载页面-->
    <div class="is-loading my-model" v-if="isShowLoading">
      <div class="import-inner model-inner">
        <div>
          <img src="../../assets/img/images/222.gif" alt="">
        </div>
        <div class="title">{{loadingMessage}}</div>
      </div>
    </div>
    <!--确定取消对话框页面-->
    <div class="dialog-box my-model" v-if="isShowDialog">
      <div class="dialog-inner model-inner">
        <div class="setting-header">{{dialogTitle}}
          <i class="iconfont icon-bangzhu"></i>
        </div>
        <div class="setting-body">
          <select name="device-name" v-if="isDeviceDialog" @change="changeDevice"
              v-model="deviceActive">
            <option v-for="(device,index) in deviceArr" >{{device.drvName}}</option>
          </select>
          <div class="intervention-box" v-if="isInterventionDialog">
            <span>请输入条码信息：</span>
            <input type="text" v-model="interventionInput" />
            <span class="original-tips" v-show="interventionInput.length === 0">(请输入20位条码信息)</span>
            <span class="continue-tips" v-show="interventionInput.length > 0 && interventionInput.length < 20">(请继续输入)</span>
            <span class="right-tips" v-show="interventionInput.length === 20">(输入字符等于20)</span>
            <span class="wrong-tips" v-show="interventionInput.length > 20">(输入字符超过20)</span>
          </div>
          <div class="title">{{dialogMessage}}</div>
        </div>
        <div class="setting-footer">
          <el-row>
            <el-button @click='isShowDialog = false'>{{pageData.dialog.cancelBtn}}</el-button>
            <el-button type="primary" @click="dialogConfirmHandle">{{pageData.dialog.confirmBtn}}</el-button>
          </el-row>
        </div>
      </div>
    </div>
    <!--提示消息页面-->
    <div class="prompt-box my-model" v-if="isShowPrompt">
      <div class="prompt-inner model-inner">
        <div class="setting-header">{{pageData.prompt && pageData.prompt.defaultTitle}}
          <i class="iconfont icon-bangzhu"></i>
          <div class="close-btn" @click="isShowPrompt = !isShowPrompt">
            <i class="iconfont icon-guanbi"></i>
          </div>
        </div>
        <div class="setting-body">
          <div class="title">{{promptMessage}}</div>
        </div>
      </div>
    </div>
    <!--导入进度条页面-->
    <div class="import-model my-model" v-if="showImportModel">
      <div class="import-inner model-inner">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="importProgress" color="rgba(99,118,194,.9)"></el-progress>
        <div class="title">{{pageData.import.title}}</div>
      </div>
    </div>
    <!--确定框页面-->
    <div class="confirm-box my-model" v-if="isShowConfirm">
      <div class="confirm-inner model-inner">
        <div class="setting-header">{{pageData.confirm && pageData.confirm.defaultTitle}}
          <i class="iconfont icon-bangzhu"></i>
          <div class="close-btn" @click="confirmHandler">
            <i class="iconfont icon-guanbi"></i>
          </div>
        </div>
        <div class="setting-body">
          <div class="title">{{confirmMessage}}</div>
        </div>
        <div class="setting-footer">
          <el-button type="primary" @click="confirmHandler">{{pageData.confirm && pageData.confirm.confirmBtn}}</el-button>
        </div>
      </div>
    </div>
    <!--OCR人工干预页面-->
    <div class="ocr-wrapper" v-show="isShowOcrInfo">
      <div class="ocr-con">
        <div class="ocr-img">
          <div class="img-cut">
            <div class="img-part" ref="canvasBox">
              <canvas id="cut-canvas">你的浏览器不支持，请升级你的浏览器</canvas>
              <img src="../../assets/img/images/ocr/canvas_cut.png" alt="">
            </div>
            <div class="input-check">
              <input type="text" ref="inputCheck" v-model="infoManual"
                @input="checkInput">
              <img src="../../assets/img/images/ocr/ocrMessage.png" alt="">
            </div>
          </div>
          <div class="img-main" ref="ocrImgBox">
            <img :src="ocrImageSrc" alt="" class="showOcrImg" ref="myOcrImg">
            <canvas id="ocr-canvas">你的浏览器不支持，请升级你的浏览器</canvas>
          </div>
          <div class="ocr-btns">
            <div class="left-btns">
              <div class="left-inner-con">
                <div class="check-btn" @click="checkInvoice">
                  <span>查验</span>
                </div>
                <div class="page-btn" :class="{inactive:currentOcrIndex===0}"
                  @click="ocrFirstPage">
                  <i class="iconfont icon-diyiye"></i>
                </div>
                <div class="page-btn" :class="{inactive:currentOcrIndex===0}"
                  @click="ocrPrevPage">
                  <i class="iconfont icon-lunbozuofangun"></i>
                </div>
                <div class="middle-btn page-btn">
                  <span v-if="ocrFiles">{{currentOcrIndex+1}}/{{ocrFiles.length}}</span>
                </div>
                <div class="page-btn" :class="{inactive:currentOcrIndex===ocrFiles.length-1}"
                  @click="ocrNextPage">
                  <i class="iconfont icon-lunboyoufangun"></i>
                </div>
                <div class="page-btn" :class="{inactive:currentOcrIndex===ocrFiles.length-1}"
                  @click="ocrLastPage">
                  <i class="iconfont icon-zuihouyiye"></i>
                </div>
              </div>

            </div>
            <div class="right-btns">
              <select name="imgType" v-model="ocrPattern" @change="changePattern">
                <option class="test-select">增值税专用发票</option>
                <option class="test-select">增值税普通发票</option>
                <option class="test-select">银行承兑汇票</option>
              </select>
            </div>
          </div>
        </div>
        <div class="ocr-data">
          <div ref="ocrInfoList">
            <div class="data">
              <div class="data-header">
                <span>基本信息</span>
              </div>
              <div class="data-body">
                <ul class="data-list">
                  <li class="list-item" v-for="(info,index) in basicInfo" ref="info.item"
                      v-if="isPatternAllSelect || (!isPatternAllSelect && info.k === '1')">
                    <span class="item-icon" v-if="info.k === '0'">-</span>
                    <span class="item-icon" v-if="info.k === '1'">
                    <img src="../../assets/img/images/ocr/dot.png" alt="">
                  </span>
                    <span class="item-name">{{info.description}}</span>
                    <span class="item-value">
                    <input type="text" :value="info.value" @click="showCutCanvas(info.item,basicInfo,'basicInfo')"
                           @input="changeInfoHandler">
                  </span>
                    <span class="item-check">
                    <i class="iconfont icon-tijiaochenggongduigou check-right"></i>
                    <i class="iconfont icon-jingshigantanhao check-wrong"></i>
                  </span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="data" v-if="isPatternAllSelect">
              <div class="data-header">
                <span>购方信息</span>
              </div>
              <div class="data-body">
                <ul class="data-list">
                  <li class="list-item"  v-for="(info,index) in buyer" ref="info.item">
                    <span class="item-icon" v-if="info.k === '0'">-</span>
                    <span class="item-icon" v-if="info.k === '1'">
                    <img src="../../assets/img/images/ocr/dot.png" alt="">
                  </span>
                    <span class="item-name">{{info.description}}</span>
                    <span class="item-value">
                    <input type="text" :value="info.value" @click="showCutCanvas(info.item,buyer,'buyer')"
                           @input="changeInfoHandler">
                  </span>
                    <span class="item-check">
                    <i class="iconfont icon-tijiaochenggongduigou check-right"></i>
                    <i class="iconfont icon-jingshigantanhao check-wrong"></i>
                  </span>
                  </li>
                </ul>
                <div class="sync-btn">
                  <img src="../../assets/img/images/ocr/sync.png" alt="">
                </div>
              </div>
            </div>
            <div class="data" v-if="isPatternAllSelect">
              <div class="data-header">
                <span>售方信息</span>
              </div>
              <div class="data-body">
                <ul class="data-list">
                  <li class="list-item"  v-for="(info,index) in seller" ref="info.item">
                    <span class="item-icon" v-if="info.k === '0'">-</span>
                    <span class="item-icon" v-if="info.k === '1'">
                    <img src="../../assets/img/images/ocr/dot.png" alt="">
                  </span>
                    <span class="item-name">{{info.description}}</span>
                    <span class="item-value">
                    <input type="text" :value="info.value" @click="showCutCanvas(info.item,seller,'seller')"
                           @input="changeInfoHandler">
                  </span>
                    <span class="item-check">
                    <i class="iconfont icon-tijiaochenggongduigou check-right"></i>
                    <i class="iconfont icon-jingshigantanhao check-wrong"></i>
                  </span>
                  </li>
                </ul>
                <div class="sync-btn">
                  <img src="../../assets/img/images/ocr/sync.png" alt="">
                </div>
              </div>
            </div>
            <div class="data" v-if="isPatternAllSelect">
              <div class="data-header">
                <span>密码区域</span>
              </div>
              <div class="data-body">
                <ul class="data-list">
                  <li class="list-item"  v-for="(info,index) in passwdInfo" ref="info.item">
                    <span class="item-icon" v-if="info.k === '0'">-</span>
                    <span class="item-icon" v-if="info.k === '1'">
                    <img src="../../assets/img/images/ocr/dot.png" alt="">
                  </span>
                    <span class="item-name">{{info.description}}</span>
                    <span class="item-value">
                    <input type="text" :value="info.value" @click="showCutCanvas(info.item,passwdInfo,'passwdInfo')"
                           @input="changeInfoHandler">
                  </span>
                    <span class="item-check">
                    <i class="iconfont icon-tijiaochenggongduigou check-right"></i>
                    <i class="iconfont icon-jingshigantanhao check-wrong"></i>
                  </span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="data" v-if="isPatternAllSelect">
              <div class="data-header">
                <span>发票明细</span>
              </div>
              <div class="data-body">
                <div class="detail-btn" >
                  <div class="page-num" v-for="(detail,index) in details" :class="{active:detailIndex===index}"
                       @click="detailIndex=index">
                    <span>{{index+1}}</span>
                  </div>
                  <div class="page-num" @click="addDetails">
                    <span>+</span>
                  </div>
                  <div class="page-num"  @click="reduceDetails">
                    <span>-</span>
                  </div>
                </div>
                <div class="data-list" v-for="(detail,index) in details" v-if="index === detailIndex">
                  <li class="list-item" ref="info.item"  v-for="(info,i) in detail">
                    <span class="item-icon" v-if="info.k === '0'">-</span>
                    <span class="item-icon" v-if="info.k === '1'">
                      <img src="../../assets/img/images/ocr/dot.png" alt="">
                    </span>
                    <span class="item-name">{{info.description}}</span>
                    <span class="item-value">
                      <input type="text" :value="info.value" @click="showCutCanvas(info.item,details,'details')"
                             @input="changeInfoHandler">
                    </span>
                    <span class="item-check">
                    <i class="iconfont icon-tijiaochenggongduigou check-right"></i>
                    <i class="iconfont icon-jingshigantanhao check-wrong"></i>
                  </span>
                  </li>


                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="ocr-right-tab">
        <div class="close-btn" @click="isShowOcrInfo = false">
          <i class="iconfont icon-guanbi"></i>
        </div>
        <div class="all-tab">
          <div class="info-tab tab-item" @click="switchInfoTab(0)"
            :class="{active:infoIndex===0}">
            <div class="info">基本信息</div>
          </div>
          <div class="buyer-tab tab-item" @click="switchInfoTab(1)"
            :class="{active:infoIndex===1}">
            <div class="buyer">购方信息</div>
          </div>
          <div class="sell-tab tab-item" @click="switchInfoTab(2)"
               :class="{active:infoIndex===2}">
            <div class="sell" >售方信息</div>
          </div>
          <div class="passwd-tab tab-item" @click="switchInfoTab(3)"
               :class="{active:infoIndex===3}">
            <div class="passwd" >密码区域</div>
          </div>
          <div class="details-tab tab-item" @click="switchInfoTab(4)"
               :class="{active:infoIndex===4}">
            <div class="details" >发票明细</div>
          </div>
        </div>
      </div>
    </div>
    <!--缩略图页面-->
    <div class="thumbnail-wrapper">
      <div class="thumbnail-inner">
        <ul class="thumbnail-list">
          <li class="thumbnail-item">
            <img src="../../assets/img/testdata/test.jpg" alt="">
          </li>
          <li class="thumbnail-item">
            <img src="../../assets/img/testdata/test.jpg" alt="">
          </li>
          <li class="thumbnail-item">
            <img src="../../assets/img/testdata/test.jpg" alt="">
          </li>
          <li class="thumbnail-item">
            <img src="../../assets/img/testdata/test.jpg" alt="">
          </li>
          <li class="thumbnail-item">
            <img src="../../assets/img/testdata/test.jpg" alt="">
          </li>
          <li class="thumbnail-item">
            <img src="../../assets/img/testdata/test.jpg" alt="">
          </li>
          <li class="thumbnail-item">
            <img src="../../assets/img/testdata/test.jpg" alt="">
          </li>
          <li class="thumbnail-item">
            <img src="../../assets/img/testdata/test.jpg" alt="">
          </li>
          <li class="thumbnail-item">
            <img src="../../assets/img/testdata/test.jpg" alt="">
          </li>
        </ul>
        <div class="thumbnail-right-tab">
          <div class="close-btn">
            <i class="iconfont icon-guanbi"></i>
          </div>
          <ul class="tab-list">
            <li class="tab-item">
              <span class="label">原图</span>
              <input type="radio" class="radio-type" name="imageType" value="yuantu">
            </li>
            <li class="tab-item">
              <span class="label">原图</span>
              <input type="radio" class="radio-type" name="imageType" value="yuantu">
            </li>
            <li class="tab-item">
              <span class="label">原图</span>
              <input type="radio" class="radio-type" name="imageType" value="yuantu">
            </li>
            <li class="tab-item">
              <span class="label">原图</span>
              <input type="radio" class="radio-type" name="imageType" value="yuantu">
            </li>

          </ul>
        </div>
      </div>

    </div>
    <!--功能设置页面-->
    <div class="function-setting my-model" v-if="isShowFunctionSettings">
      <div class="function-setting-inner model-inner">
        <div class="setting-header">
          <h4>功能设置</h4>
        </div>
        <div class="function-setting-body">
          <div class="select-type">
            <h4>可选功能</h4>
            <div class="switch-box">
              <div class="switch-item">
                <span>重命名</span>
                <el-switch v-model="Rename">
                </el-switch>
              </div>
              <div class="switch-item">
                <span>小角度转正</span>
                <el-switch v-model="TurnCorrect">
                </el-switch>
              </div>
              <div class="switch-item">
                <span>去黑边</span>
                <el-switch v-model="Mvblack">
                </el-switch>
              </div>
              <div class="switch-item">
                <span>删除</span>
                <el-switch v-model="DeleteNode">
                </el-switch>
              </div>

            </div>
          </div>
          <div class="select-type">
            <h4>不可选功能</h4>
            <div class="switch-box">
              <div class="switch-item">
                <span>查验</span>
                <el-switch v-model="BeCheck" disabled>
                </el-switch>
              </div>
              <div class="switch-item">
                <span>移动扫描</span>
                <el-switch v-model="PhoneScan" disabled>
                </el-switch>
              </div>
              <div class="switch-item">
                <span>文档转正</span>
                <el-switch v-model="DocAutoRatate" disabled>
                </el-switch>
              </div>
              <div class="switch-item">
                <span>OCR识别</span>
                <el-switch v-model="OCRShow" disabled>
                </el-switch>
              </div>
              <div class="switch-item">
                <span>文件加密</span>
                <el-switch v-model="Encryption" disabled>
                </el-switch>
              </div>

            </div>
          </div>
        </div>
        <div class="setting-footer">
          <el-row>
            <el-button @click.stop="cancelUpdateFun">取消</el-button>
            <el-button type="primary" @click.stop="updateFunSetting">确认</el-button>
          </el-row>
        </div>
      </div>
    </div>
    <!--扫描设置页面-->
    <div class="scan-setting my-model" v-if="isShowScanSettings">
      <div class="scan-setting-inner model-inner">
        <div class="setting-header">
          <h4>扫描参数设置</h4>
        </div>
        <div class="scan-body">
          <div class="scan-option">
            <div class="title">
              分辨率
            </div>
            <div class="option">
              <el-radio v-model="scanRate" label="1">200dpi</el-radio>
              <el-radio v-model="scanRate" label="2">300dpi</el-radio>
            </div>
          </div>
          <div class="scan-option">
            <div class="title">
              颜色
            </div>
            <div class="option">
              <el-radio v-model="scanColor" label="2">彩色</el-radio>
              <el-radio v-model="scanColor" label="1">灰度</el-radio>
              <el-radio v-model="scanColor" label="0">黑白</el-radio>
            </div>
          </div>
          <div class="scan-option">
            <div class="title">
              扫描方式
            </div>
            <div class="option">
              <el-radio v-model="scanWay" label="1" >单面</el-radio>
              <el-radio v-model="scanWay" label="2" >双面</el-radio>
            </div>
          </div>

        </div>
        <div class="setting-footer">
          <el-row>
            <el-button @click.stop = "cancelUpdateScan">取消</el-button>
            <el-button type="primary" @click.stop = "updateScanSettings">确认</el-button>
          </el-row>
        </div>
      </div>
    </div>
    <!--OCR设置页面-->
    <div class="ocr-setting my-model" v-if="isShowOcrSettings">
      <div class="ocr-setting-inner model-inner">
        <div class="setting-header">
          <h4>扫描参数设置</h4>
        </div>
        <div class="ocr-body">
          <div class="left-tab">
            <div :class="{active:activePattern==='pattern1'}"
              @click.stop="setPattern1">
              增值税专用发票
            </div>
            <div :class="{active:activePattern==='pattern2'}"
              @click="setPattern2">
              增值税普通发票
            </div>
          </div>
          <div class="right-tab">
            <div class="ocr-btn">
              <el-button type="primary" @click="toggleShow">全选/取消全选</el-button>
            </div>
            <div class="ocr-img">
              <img :src="ocrSetImg" alt="">
            </div>
          </div>
        </div>
        <div class="setting-footer">
          <el-row>
            <el-button @click="cancelOcrSet">取消</el-button>
            <el-button type="primary" @click="updateOcrSet">确认</el-button>
          </el-row>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {
  GetUrlParam,
  wsServer,
  imageServer,
  getArrayKey,
  getArrayIndex,
  computedInfo,
  computedDetails} from '../../utils'
import vueEasyPrint from "vue-easy-print"
import chData from '../../json/ch.json'
import enData from '../../json/en.json'
import hkData from '../../json/hk.json'
import axios from 'axios'
import BScroll from 'better-scroll'
export default {
  name: 'App',
  data() {
    return {
      pageData:{},  //多语言的页面展示json对象
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },  //树形结构默认属性
      websocketFlag: 0, //websocket连接标识，0未连接，1建立连接
      /* 0表示从未连接，1表示websocket已经连接。若为1，websocket断开连接，提示重启客户端，若为0，websocket断开连接，提示下载客户端*/
      websocketDid: 0,
      connectCount: 0,
      initParameterObj: {}, //websocket初始化对象
      isShowLoading: false,     //是否展示加载框
      loadingMessage: "",       //加载框提示信息
      languageIndex: 0,         //语言类型
      isShowRightTab: false,    //是否展示右侧选项栏
      parentData: null,         //树形结构一级目录
      myTree: null,           //树对象
      scanType: "1",          //扫描类型
      isShowDialog: false,  //是否展示对话框
      dialogMessage: "",  //对话框的提示信息
      isDeviceDialog: false,  //是否是设备驱动的对话框
      isInterventionDialog: false, //是否是干预分组的对话框
      dialogTitle: "",        //对话框标题
      dialogType: 0, //对话框类型 0是否下载exe，1是否重启exe,2是获取扫描设备,3是干预分组对话框
      isShowPrompt: false,
      promptMessage: "",
      initSysParams:{},
      initBillParams:{},
      ws: null,
      historyFiles: [],    //所有历史文件
      ocrFiles: [],        //所有非历史文件，提供OCR人工干预
      allImageFiles: [],   //所有导入文件
      importProgress: 0,
      showImportModel: false,
      refreshFlag: false,     //是否有新的影像更新
      mainImgSrc: '',
      deviceArr: [],
      deviceActive: '',
      isShowConfirm: false,
      confirmMessage: '',
      isGreyCommit: false,  //置灰上传和提交按钮
      //功能设置
      isShowFunctionSettings: false,
      oldFunSetUp: {},
      Rename: false,
      DeleteNode: false,
      TurnCorrect: false,
      Mvblack: false,
      BeCheck: false,
      PhoneScan: false,
      DocAutoRatate: false,
      OCRShow:false,
      Encryption: false,
      //扫描设置
      isShowScanSettings: false,
      oldScanSettings: {},
      scanRate: '2',
      scanColor: '1',
      scanWay: '2',
      //ocr设置
      isShowOcrSettings: false,
      pattern: {},
      oldPattern: {},
      activePattern: 'pattern1',
      ocrSetImg: '',
      //旋转按钮是否置灰
      isGreyRotateBtn: false,
      //影像树右键菜单
      isShowRightMenu: false,
      isImage: true,
      isEditMode: false,
      rightNode: null,
      rightNodeComponent: null,
      testEdit: '',
      interventionInput: '',
      //ocr设置页面
      isShowOcrInfo: false,
      currentOcrIndex: 0,
      ocrPattern: '', //当前ocr识别的发票模式
      ocrImageSrc: '',  //当前ocr图片的地址
      currentOcrFullName: '', //当前ocr的fullname
      basicInfo: null,
      buyer: null,
      seller: null,
      details: null,
      passwdInfo: null,
      infoManual: '',    //正在人工干预发票信息
      currentItem: '',   //正在干预的input项名
      currentInfoName: '', //正在干预的是哪个信息下的选项
      detailIndex: 0,    //当前展示的商品详情的下标
      isPatternAllSelect: true,
      //ocr识别消息的滚动
      //infoIndex: 0,    //当前消息的下标
      infoTops: [],
      infoScrollY: 0
    };
  },
  mounted (){
    this._initData ()
    this._initWS ()
    console.log(this.ocrFiles,this.historyFiles,this.allImportFiles,this.scanType)
  },
  components: {
    vueEasyPrint
  },
  methods: {
    /*初始化websocket通信*/
    _initWS (){
      this.ws = new WebSocket(wsServer)
      this.isShowLoading = true
      try{
        this.ws.onopen = (evt) => {
          if(this.ws.readyState !== 0){  //websocket状态判断，readyState为1连接成功，readyState为0连接失败
            this.websocketFlag = 1    //此时readyState为1，表示连接成功
            const basePath = "http://192.168.36.88:8199/"
            //向服务器后台请求初始化参数
            axios.get(basePath + "scanParms/getScanParmsByDepartnum?departnum=global")
            //请求成功建立websocket初始化连接
              .then(response => {
                this.initParameterObj = response.data
                const searchUrl = GetUrlParam(location.search);
                //遍历searchUrl参数对象
                for (let str in searchUrl){
                  this.initParameterObj[str] = searchUrl[str]
                }
                this._addFirstNode()
                this._addNextNode()
                //console.log("INIT&" + JSON.stringify(this.initParameterObj))
                this.ws.send("INIT&" + JSON.stringify(this.initParameterObj))
              })
              //请求失败报错
              .catch(response => {
                alert('请求失败，请稍后再试')
              })
          }
        }
        this.ws.onclose = (evt) => {//websocket断开连接处理
          if(this.websocketDid === 0){//websocket一次都没有连接上，即刷新页面之后
            if(this.connectCount < 5){//websocket第一次连接失败，尝试启动客户端
              this.connectCount++
              let timer = setTimeout(()=>{
                this._initWS()
              },1000);
            }else{//websocket第20次连接失败，弹出提示：“请点击确定进入程序下载页面”
              this.isShowDialog = true
              this.dialogTitle = this.pageData.dialog.defaultTitle
              this.dialogMessage = this.pageData.dialog.downloadExe
              this.dialogType = 0
            }
          }else{//websocket连接成功，突然断开，此时需要用户点击确定，刷新页面
            this.isShowDialog = true
            this.dialogTitle = this.pageData.dialog.defaultTitle
            this.dialogMessage = this.pageData.dialog.exeDisconnect
            this.dialogType = 1
            this.isInterventionDialog = false
            this.isDeviceDialog = false
          }
        }
        this.ws.onmessage = (evt) => {  //websocket正在通讯
          this.websocketDid = 1;//websocket正在通讯，表示已经连接，给websocket已经连接过的标志置1，为用户退出当前客户端做准备
          const json_obj = JSON.parse(evt.data);//获取的信息为字符串，此时将其转换为json格式
          switch(json_obj.Operation){
            case "INIT":    //case中的字符串为接口，详细请看接口文档
              this.isShowLoading = false //此时初始化完成，移除初始化模态窗
              this._initPort(json_obj); //初始化处理
              break;
            case "UpdateSetup"://1更新设备信息，包括扫描单双面，颜色，dpi，文件格式，传输模式，版面；2更新ocr识别信息
              console.log(json_obj);
              this._updateSetupDo(json_obj);
              break;
            case "importfile":  //case中的字符串为接口，详细请看接口文档
              console.log(json_obj)
              this._importDo(json_obj)
              break;
            case "QueryGroup": //case中的字符串为接口，详细请看接口文档
              this._queryGroupDo (json_obj)
              console.log('QueryGroup',json_obj);
              break;
            case "imagefinish": //case中的字符串为接口，详细请看接口文档
              console.log('imagefinish',json_obj)
              break;
            case "Refresh":
              this._refreshDo(json_obj)
              break;
            case "GetInfo": //case中的字符串为接口，详细请看接口文档
              //console.log(json_obj,json_obj.ocr);
              this._getInfoDo(json_obj)
              //getOcrMessage(json_obj,json_obj.RstCode,json_obj.fullname,json_obj.ocr);
              break;
            case "GetDevice": //case中的字符串为接口，详细请看接口文档
              console.log('GetDevice',json_obj)
              this._getDeviceDo(json_obj);
              break;
            case "SCAN": //case中的字符串为接口，详细请看接口文档
              console.log('SCAN',json_obj);
              //SCANDo(json_obj);
              break;
            case "SAVE": //case中的字符串为接口，详细请看接口文档
              console.log(json_obj);
              this._saveDo(json_obj);
              break;
            case "Commit": //case中的字符串为接口，详细请看接口文档
              console.log(json_obj);
              this._commitDo(json_obj);
              break;
            case "APPRegister":
              console.log(json_obj);
              break;
            case "APPisMobileScan":
              console.log(json_obj);
              break;
            case "APPMobileScan":
              console.log(json_obj);
              break;
            case "APPDown":
              console.log(json_obj);
              break;
            case "Rotate": //case中的字符串为接口，详细请看接口文档
              console.log(json_obj)
              this._rotateDo(json_obj);
              break;
            case "UpdateTree": //case中的字符串为接口，详细请看接口文档
              console.log(json_obj);
              this._updateTreeDo(json_obj);
              break;
            case "CommitOCR": //case中的字符串为接口，详细请看接口文档
              console.log('CommitOCR',json_obj)
              //CommitOCRDo(json_obj);
              break;
            case "DeleteOCR": //case中的字符串为接口，详细请看接口文档
              console.log(json_obj);
              //DeleteOCRDo(json_obj);
              break;
            case "Synchronize": //case中的字符串为接口，详细请看接口文档
              console.log('Synchronize',json_obj)
              //SynchronizeDo(json_obj);
              break;
            case "InvoiceCheck":
              console.log(json_obj);
              this._invoiceCheckDo(json_obj);
              break;
            case "DeleteNode": //case中的字符串为接口，详细请看接口文档
              console.log(json_obj);
              this._deleteNodeDo(json_obj);
              break;
            case "InterventionGroup":
              console.log("InterventionGroup",json_obj);
              this._InterventionGroupDo(json_obj);
              break;
            case "SetDevice":
              console.log("SetDevice",json_obj);
              this._setDeviceDo(json_obj);
              break;
          }
        };
        this.ws.onerror =  (evt) => {
          console.log("websocket发生错误");
        };
      }catch(e){
        alert(e + "当前浏览器版本太低,请升级浏览器版本");
      }
    },
    /*初始化显示页面数据，默认中文简体*/
    _initData (){
      const searchUrl = GetUrlParam(location.search)
      this.scanType = searchUrl.scanType
      /*修改语言*/
      switch (searchUrl.LanguageIndex){
        case '0':
          this.pageData = chData
          this.languageIndex = 0
          break
        case '1':
          this.pageData = hkData
          this.languageIndex = 1
          break
        case '2':
          this.pageData = enData
          this.languageIndex = 2
          break
        default:
          this.pageData = chData
          this.languageIndex = 0
          break
      }
      //初始化模态框的显示内容
      this.loadingMessage = this.pageData.loading.initTitle
     /* document.addEventListener('contextmenu',function (e) {
        e.preventDefault()
      })*/
      window.onresize = (e) => {
        this.$nextTick(() => {
          this._drawOcrCanvas ()
        })
      },
      document.onclick = (e) => {
        this.$nextTick(() => {
          this.isShowRightMenu = false
          this._resetEditMode ()
        })
      },
      document.oncontextmenu = (e) => {
        e.preventDefault()
        this.$nextTick(()=>{
          this.isShowRightMenu = false
          this._resetEditMode ()
        })
      }
    },
    /*添加一级树*/
    _addFirstNode (){
      const searchUrl = GetUrlParam(location.search)
      this.myTree = this.$refs.imageTree
      /*初始化创建一级菜单*/
      if(searchUrl.billtypename){
        this.parentData = {
          id: '0',
          label: searchUrl.billtypename,
          icon: imageServer + 'images/tree/parentNode.png'
        }
        this.myTree.append(this.parentData,this.myTree.root)
        this.myTree.setCurrentKey('0')
        this.isGreyRotateBtn = true
      }
    },
    /*添加二级树*/
    _addNextNode (){
      const searchUrl = GetUrlParam(location.search)
      this.myTree = this.$refs.imageTree
      /*初始化创建二级菜单*/
      if(searchUrl.nextbillname && this.scanType === '1'){
        const parent = this.myTree.getNode(this.parentData)
        if(searchUrl.nextbillname.indexOf('@')!==-1){
          const nextBills = searchUrl.nextbillname.split("@")
          for (let i=0;i<nextBills.length;i++){
            const nextTreeData = {
              id: '0' + i,
              label: nextBills[i],
              icon: imageServer + 'images/tree/parentNode.png'
            }
            this._addNextTreeNode(parent,nextTreeData)
            this.myTree.setCurrentKey('0'+ i)
          }
        }else {
          const nextTreeData = {
            id: '00',
            label: searchUrl.nextbillname,
            icon: imageServer + 'images/tree/parentNode.png'
          }
          this._addNextTreeNode(parent,nextTreeData)
          this.myTree.setCurrentKey('00')
        }
      }

      this.isGreyRotateBtn = true
    },
    /*添加二级树节点*/
    _addNextTreeNode (parent,data){
      this.myTree.append(data,parent)
    },
    //初始化接口函数
    _initPort (data){
      if(data){
        if(data.RstCode === '0000'){
          this._getParameterDo(JSON.parse(data.RstMesg));//返回参数展示信息后进行处理
          this.isShowRightTab = true
          this.ws.send("Refresh");//刷新接口"Refresh"
        }else {
          this.isShowPrompt = true
          this.promptMessage = data.RstMesg
        }
      }else {
        this.isShowPrompt = true
        this.promptMessage = this.pageData.prompt.initFail
      }
    },
    //初始化接口函数
    _getParameterDo (data){
      const sysParam = data.SysParam
      const billParam = data.BillParam
      for(let i=0;i<sysParam.length;i++){
        this.initSysParams[sysParam[i].name] = sysParam[i].value
      }
      for(let i=0;i<2;i++){
        this.initBillParams[billParam[i].pattern] = billParam[i].isshow
      }
      console.log(this.initSysParams,this.initBillParams)
      this._settingsInit()

    },
    //更新接口函数
    _refreshDo(data) {
      let parent = this.myTree.getNode(this.parentData)
      let nextBills = parent.childNodes
      let timer = null
      let historyFilesArr = []
      let ocrFilesArr = []
      let allFilesArr = []
      console.log(data)
      if(data){
        if(data.RSPCODE === '0000'){
          /*for(var s=0;s<nextBills.length;s++){
            console.log('aaaaold'+s,nextBills[s],nextBills.length)
            this.myTree.remove(nextBills[s])
          }*/
          if(data.BATCH){
            const updateBills = data.BATCH
            if(this.scanType === '2'){
              //批扫删除所有二级菜单，批扫含有多层二级菜单，且批扫是自动查询分组
              parent.childNodes = []
            }
            for(let i=0;i<updateBills.length;i++){
              if(updateBills[i].DOCNAME){
                if(this.scanType === '1'){
                  /*单扫查找原有的二级菜单，有相同的则删掉*/
                  for(let j=0;j<nextBills.length;j++){
                    let label = nextBills[j].data.label
                    if(label.indexOf('(') > 0){
                      label = label.substring(0,label.indexOf('('))
                    }
                    if(updateBills[i].DOCNAME === label){
                      this.myTree.remove(nextBills[j])
                    }
                  }
                }
                //新建refresh接口传递的二级菜单
                let appendBillData = {
                  id: '00' + i,
                  label: updateBills[i].DOCNAME + '(' + updateBills[i].FILES.length + ')',
                  icon: imageServer + 'images/tree/parentNode.png'
                }
                this.myTree.append(appendBillData,parent)
                this.myTree.setCurrentKey('00' + i)
                for(let k=0;k<updateBills[i].FILES.length;k++){
                  const filename = updateBills[i].FILES[k].filename
                  const fullname = updateBills[i].FILES[k].fullname
                  const history = updateBills[i].FILES[k].history
                  const imageType = filename.substring(filename.indexOf('.')+1)
                  const imageId = updateBills[i].FILES[k].sid + ''
                  const imageLabel = filename.substring(0,filename.indexOf('.'))
                  let imageIcon = ''
                  switch (imageType){
                    case 'jpg':
                      if(history === 0){
                        imageIcon = imageServer + 'images/tree/jpg0.png'
                      }else {
                        imageIcon = imageServer + 'images/tree/jpg.png'
                      }
                      break
                    case 'png':
                      if(history === 0){
                        imageIcon = imageServer + 'images/tree/png0.png'
                      }else {
                        imageIcon = imageServer + 'images/tree/png.png'
                      }
                      break
                    case 'bmp':
                      if(history === 0){
                        imageIcon = imageServer + 'images/tree/bmp0.png'
                      }else {
                        imageIcon = imageServer + 'images/tree/bmp.png'
                      }
                      break
                    case 'tiff':
                      if(history === 0){
                        imageIcon = imageServer + 'images/tree/tiff0.png'
                      }else {
                        imageIcon = imageServer + 'images/tree/tiff.png'
                      }
                      break
                    case 'pdf':
                      if(history === 0){
                        imageIcon = imageServer + 'images/tree/pdf0.png'
                      }else {
                        imageIcon = imageServer + 'images/tree/pdf.png'
                      }
                      break
                    default:
                      imageIcon = imageServer + 'images/tree/aaa.png'
                      break
                  }
                  this.myTree.append({
                    id: imageId,
                    label: imageLabel,
                    icon: imageIcon,
                    myDefine: updateBills[i].FILES[k],
                    imageType: imageType
                  },appendBillData)
                  this.myTree.setCurrentKey(imageId)
                  //保存数据
                  if(history === 0){
                    ocrFilesArr.push(updateBills[i].FILES[k])
                    this.mainImgSrc = imageServer + fullname
                    this.isGreyRotateBtn = false
                  }else if(history === 1) {
                    historyFilesArr.push(updateBills[i].FILES[k])
                    if(fullname.indexOf('.') === 0){
                      const subName = fullname.substring(6)
                      this.mainImgSrc = imageServer + subName
                    }else {
                      this.mainImgSrc = fullname
                    }
                    this.isGreyRotateBtn = true
                  }
                  allFilesArr.push({
                    'parent': updateBills[i].DOCNAME,
                    'imageItem': updateBills[i].FILES[k]
                  })

                }
              }
            }
          }
          this.importProgress = 100
          clearInterval(timer)
          let t = setTimeout(()=>{
            this.showImportModel = false
            if(this.scanType === '2' && this.refreshFlag){
              this.ws.send('QueryGroup')
            }
          },200)
        }else {
          if(data.RstCode == "0002"){
            this.importProgress = Math.round(data.Completed/(this.historyFiles.length + data.Total)*100)
          }
          timer = setTimeout(()=>{
            this.ws.send("Refresh")//刷新接口"Refresh"
          },300)
        }
      }else {
        console.log('正在刷新中，请稍后')
      }
      this.ocrFiles = ocrFilesArr
      this.historyFiles = historyFilesArr
      this.allImageFiles = allFilesArr
      //console.log(this.ocrFiles,this.historyFiles,this.allImportFiles)
    },
    //导入接口函数
    _importDo (data){
      console.log('import',data)
      if(data){
        if(data.RstCode === "0000"){
          if(data.Total > 0){
            this.refreshFlag = true
            this.showImportModel = true
          }
        }else{
          this.isShowPrompt = true
          this.promptMessage = data.RstMesg
        }
        this.ws.send("Refresh");//刷新接口"Refresh"
      }
    },
    _getDeviceDo (data){
      console.log(data)
      this.deviceArr = data.drivers
      if(!this.deviceActive){
        this.deviceActive = this.deviceArr[0].drvName
      }
    },
    _setDeviceDo (data){
      this.isShowPrompt = true
      this.promptMessage = data.RstMesg
    },
    _saveDo (data){
      console.log(data.RstCode)
      this.isShowLoading = false
      if(data){
        if(data.RstCode === "0000"){
          this.isShowConfirm = true
          this.confirmMessage = `共保存了${data.Completed}张影像`
          //this.ws.send('Refresh')
        }else {
          this.isShowPrompt = true
          this.promptMessage = data.RstMesg
        }
      }
    },
    _commitDo (data){
      this.isShowLoading = false
      if(data){
        if(data.RstCode === "0000"){
          this.isShowConfirm = true
          this.confirmMessage = "提交成功"
          this.isGreyCommit = true
        }else {
          this.isShowPrompt = true
          if(data.RstMesg){
            this.promptMessage = data.RstMesg
          }else {
            this.promptMessage = "提交失败，请稍后再试"
          }

        }
      }
    },
    _settingsInit (){
      for(let str in this.initSysParams){
        switch (str){
          case 'Rename':
            if(this.initSysParams[str] === '1'){
              this.Rename = true
            }
            break
          case 'DeleteNode':
            if(this.initSysParams[str] === '1'){
              this.DeleteNode = true
            }
            break
          case 'TurnCorrect':
            if(this.initSysParams[str] === '1'){
              this.TurnCorrect = true
            }
            break
          case 'Mvblack':
            if(this.initSysParams[str] === '1'){
              this.Mvblack = true
            }
            break
          case 'BeCheck':
            if(this.initSysParams[str] === '1'){
              this.BeCheck = true
            }
            break
          case 'PhoneScan':
            if(this.initSysParams[str] === '1'){
              this.PhoneScan = true
            }
            break
          case 'DocAutoRatate':
            if(this.initSysParams[str] === '1'){
              this.DocAutoRatate = true
            }
            break
          case 'OCRShow':
            if(this.initSysParams[str] === '1'){
              this.OCRShow = true
            }
            break
          case 'Encryption':
            if(this.initSysParams[str] === '1'){
              this.Encryption = true
            }
            break
          case 'DPI':
            if(this.initSysParams[str] === '200'){
              this.scanRate = '1'
            }
          break
          case 'scanColor':
            if(this.initSysParams[str] === '2'){
              this.scanColor = '2'
            }else if(this.initSysParams[str] === '0'){
              this.scanColor = '0'
            }
            break
          case 'singleScan':
            if(this.initSysParams[str] === '1'){
              this.scanWay = '1'
            }
            break
          case 'doubleScan':
            if(this.initSysParams[str] === '1'){
              this.scanWay = '2'
            }
            break
        }
      }
      for(let str in this.initBillParams){
        if(str === '1'){
          if(this.initBillParams[str] === '0'){
            this.pattern.pattern1 = false
          }else {
            this.pattern.pattern1 = true
          }
        }else {
          if(this.initBillParams[str] === '0'){
            this.pattern.pattern2 = false
          }else {
            this.pattern.pattern2 = true
          }
        }
      }
      this._ocrShow()
    },
    _updateSetupDo(data) {
      if(data){
        if(data.RstCode === '0000'){
          const {SysParam,BillParam} = JSON.parse(data.RstMesg)
          for(let str in SysParam){
            switch (str){
              case 'DeleteNode':
                if(SysParam[str]){
                  this.DeleteNode = true
                }else {
                  this.DeleteNode = false
                }
                break
              case 'Mvblack':
                if(SysParam[str]){
                  this.Mvblack = true
                }else {
                  this.Mvblack = false
                }
                break
              case 'Rename':
                if(SysParam[str]){
                  this.Rename = true
                }else {
                  this.Rename = false
                }
                break
              case 'TurnCorrect':
                if(SysParam[str]){
                  this.TurnCorrect = true
                }else {
                  this.TurnCorrect = false
                }
                break
              case 'doubleScan':
                console.log('doubleScan',SysParam[str])
                if(SysParam[str]){
                  this.scanWay = '2'
                }else {
                  this.scanWay = '1'
                }
              case 'dpi':
                if(SysParam[str] === 200){
                  this.scanRate = '1'
                }else {
                  this.scanRate = '2'
                }
                break
              case 'scanColor':
                if(SysParam[str] === 1){
                  this.scanColor = '1'
                }else if(SysParam[str] === 2){
                  this.scanColor = '2'
                }else {
                  this.scanColor = '0'
                }
                break
            }

          }
          for(let i=0;i<BillParam.length;i++){
            if(BillParam[i].pattern === '1'){
              if(BillParam[i].isshow === '1'){
                this.pattern.pattern1 = true
              }else {
                this.pattern.pattern1 = false
              }
            }else if(BillParam[i].pattern === '2') {
              if(BillParam[i].isshow === '1'){
                this.pattern.pattern2 = true
              }else {
                this.pattern.pattern2 = false
              }
            }
          }
          this._ocrShow()
        }else {
          this.isShowPrompt = true
          this.promptMessage = data.RstMesg
        }
      }
    },
    _rotateDo(data) {
      if(data){
        if(data.RstCode === '0000' && data.fullname){
          let date = new Date()
          console.log(date,Date.now())
          this.mainImgSrc = imageServer + data.fullname + '?' + Date.now()
        }else {
          /*this.isShowPrompt = true
          this.promptMessage = data.RstMesg*/
          console.log(data)
        }
      }
    },
    _updateTreeDo (data){
      console.log(data)
      if(data.RstCode == "0000"){
        this.ws.send("Refresh");//刷新接口"Refresh"
      }
    },
    _InterventionGroupDo(data) {
      if(data){
        if(data.RstCode === '0000'){
          this.ws.send("Refresh")
        }
        if(data.RstMesg){
          this.isShowPrompt = true
          this.promptMessage = data.RstMesg
        }
      }
    },
    _queryGroupDo(data) {
      if(data.RstCode){
        this.ws.send('Refresh')
        this.refreshFlag = false
      }
    },
    _deleteNodeDo(data) {
      if(data.RstCode == "0000"){
        this.ws.send('Refresh')
      }
      if(data.RstMesg){
        this.isShowPrompt = true
        this.promptMessage = data.RstMesg
      }
    },
    _invoiceCheckDo(data) {
      this.isShowPrompt = true
      this.promptMessage = data.RstMesg
    },
    _getInfoDo(data) {
      if(data){
        console.log(data.Pattern)
        switch (data.Pattern){
          case 1:
            this.ocrPattern = '增值税专用发票'
            if(!this.pattern.pattern1){
              this.isPatternAllSelect = false
            }
            break
          case 2:
            if(!this.pattern.pattern2){
              this.isPatternAllSelect = false
            }
            this.ocrPattern = '增值税普通发票'
            break
          case 3:
            this.ocrPattern = '银行承兑发票'
            break
        }
        if(data.RstCode === '0000'){
          const ocrInfo = JSON.parse(data.ocr)
          const ocrImg = this.$refs.myOcrImg
          this.isShowOcrInfo = true
          this.ocrImageSrc = imageServer + data.fullname
          this.currentOcrFullName = data.fullname
          this.basicInfo = ocrInfo.info
          this.buyer = ocrInfo.buyer
          this.seller = ocrInfo.seller
          this.passwdInfo = ocrInfo.passwd
          this.details = ocrInfo.details
          ocrImg.onload = ()=>{
            this._drawOcrCanvas ()
          }
          this.$nextTick(()=>{
            this.infoScroll = new BScroll('.ocr-data',{
              scrollY: true,
              click: true,
              mouseWheel: {
                speed: 20,
                invert: false,
                easeTime: 300
              },
              bounce: false
            })
            this.infoTops = []
            this.infoScrollY = 0
            // 给滚动对象绑定scroll监听
            this.infoScroll.on('scroll', ({x, y}) => {
              console.log('scroll', x, y)
              this.infoScrollY = Math.abs(y)
            })
            // 给滚动对象绑定scrollEnd监听
            this.infoScroll.on('scrollEnd', ({x, y}) => {
              console.log('scrollEnd', x, y)
              this.infoScrollY = Math.abs(y)
            })
            //获取各项info的高度
            this._getInfoDataHeight()
          })

        }else {
          this.isShowPrompt = true
          this.promptMessage = data.RstMesg
        }
      }
    },
    //人工干预页面主图canvas
    _drawOcrCanvas() {
      this.$nextTick(()=>{
        const ocrCanvas = document.getElementById('ocr-canvas')
        const ctx = ocrCanvas.getContext("2d")
        const ocrImgBox = this.$refs.ocrImgBox
        const imgBoxWidth = ocrImgBox.clientWidth
        const imgBoxHeight = ocrImgBox.clientHeight
        const ocrImg = this.$refs.myOcrImg
        const imgWidth = ocrImg.clientWidth
        const imgHeight = ocrImg.clientHeight
        ocrCanvas.setAttribute('width',imgWidth)
        ocrCanvas.setAttribute('height',imgHeight)
        ctx.drawImage(ocrImg,0,0,imgWidth,imgHeight)
      })

    },
    _getInfoDataHeight() {
      const tops = []
      let top = 0
      tops.push(top)
      const infoItem = this.$refs.ocrInfoList.getElementsByClassName('data')
      Array.from(infoItem).forEach(item => {
        top += item.clientHeight
        tops.push(top)
      })
      this.infoTops = tops
    },
    //点击影像树，切换展示影像图
    nodeClickHandle (data,node,component){
      console.log(data,node,component)
      this.isShowRightMenu = false
      if(data.myDefine){
        if(data.myDefine.history === 0){
          this.mainImgSrc = imageServer + data.myDefine.fullname + '?' + Date.now()
          this.isGreyRotateBtn = false
        }else if(data.myDefine.history === 1) {
          if(data.myDefine.fullname.indexOf('.') === 0){
            const subName = data.myDefine.fullname.substring(6)
            this.mainImgSrc = imageServer + subName + '?' + Date.now()
          }else {
            this.mainImgSrc = data.myDefine.fullname + '?' + Date.now()
          }

          this.isGreyRotateBtn = true
        }
      }else {
        this.mainImgSrc = ''
        this.isGreyRotateBtn = true
      }

      this._resetEditMode ()
    },
    //重命名编辑框点击事件禁止冒泡
    clickEditInput(e) {
      console.log(e.target)
    },
    /*对话框确认事件*/
    dialogConfirmHandle (e) {
      switch (this.dialogType) {
        case 0:
          this.isShowDialog = false
          window.open(`test2.html?languageIndex=${this.languageIndex}`,"_blank")
          break
        case 1:
          this.isShowDialog = false
          const timer = setTimeout(()=>{
            window.location.reload()
          },1000);
          break
        case 2:
          this.isShowDialog = false
          let currentDriverID = ''
          for(let i=0;i<this.deviceArr.length;i++){
            if(this.deviceArr[i].drvName === this.deviceActive){
              currentDriverID = this.deviceArr[i].drvID
            }
          }
          this.ws.send(`SetDevice&${currentDriverID}`)
        case 3:
          if(this.interventionInput.length === 20){
            this.isShowDialog = false
            const sids = []
            const siblings = this.rightNode.parent.childNodes
            //console.log(this.ocrFiles[i],this.rightNode)
            for(let i=0;i<siblings.length;i++){
              if(siblings[i].data.myDefine.sid >= this.rightNode.data.myDefine.sid){
                sids.push({
                  'sid': siblings[i].data.myDefine.sid
                })
              }
            }

            const sidsObj = {
              'sids': sids
            }
            console.log(`InterventionGroup&${this.interventionInput}&${JSON.stringify(sidsObj)}`)
            this.ws.send(`InterventionGroup&${this.interventionInput}&${JSON.stringify(sidsObj)}`)
            this.rightNode = null
            this.rightNodeComponent = null
            this.interventionInput = ''
          }
      }
    },
    //导入事件，导入接口传入
    importHandler (e){
      const currentData = this.myTree.getCurrentNode()
      const currentNode = this.myTree.getNode(currentData)
      console.log(currentData,currentNode)
      this.importProgress = 0
      if(this.scanType === '2'){
        this.ws.send('importfile')
      }else if(this.scanType === '1'){
        if(currentData.id === '0'){
          //跟节点images,待确定是否导入
          //this.ws.send(`importfile&${currentData.label}`)
          console.log('这是根目录')
          this.$message({
            message: '当前目录不支持传入影像，请选择单据类型',
            center:true,
          });

        }else {
          if(currentNode.data.myDefine){
            const currentTitle = currentNode.parent.data.label
            this.ws.send(`importfile&${currentNode.parent.parent.data.label}/${currentNode.parent.data.label}`)
            console.log(currentTitle)
          }else {
            const currentTitle = currentNode.data.label
            this.ws.send(`importfile&${currentNode.parent.data.label}/${currentData.label}`)
          }
        }
      }

    },
    //首页展示图上一张切换事件
    showPrevImg (e){
      const currentData = this.myTree.getCurrentNode()
      const currentNode = this.myTree.getNode(currentData)
      const prevNode = currentNode.previousSibling
      if(prevNode){
        const fullname = prevNode.data.myDefine.fullname
        const history = prevNode.data.myDefine.history
        this.myTree.setCurrentKey(prevNode.data.id)
        if(history === 0){
          this.mainImgSrc = imageServer + fullname + '?' + Date.now()
        }else if(history === 1){
          if(fullname.indexOf('.') === 0){
            const subName = fullname.substring(6)
            this.mainImgSrc = imageServer + subName + '?' + Date.now()
          }else {
            this.mainImgSrc = fullname + '?' + Date.now()
          }
        }
      }else {
        this.$message({
          message: '这是当前分类下第一张影像',
          center:true,
          duration: 2000
        });
      }
    },
    //首页展示图下一张切换事件
    showNextImg (e){
      const currentData = this.myTree.getCurrentNode()
      const currentNode = this.myTree.getNode(currentData)
      const nextNode = currentNode.nextSibling
      //console.log(nextNode)
      if(nextNode){
        const fullname = nextNode.data.myDefine.fullname
        const history = nextNode.data.myDefine.history
        this.myTree.setCurrentKey(nextNode.data.id)
        if(history === 0){
          this.mainImgSrc = imageServer + fullname + '?' + Date.now()
        }else if(history === 1){
          if(fullname.indexOf('.') === 0){
            const subName = fullname.substring(6)
            this.mainImgSrc = imageServer + subName + '?' + Date.now()
          }else {
            this.mainImgSrc = fullname + '?' + Date.now()
          }
        }

      }else {
        this.$message({
          message: '这是当前分类下最后一张影像',
          center:true,
          duration: 2000
        });
      }
    },
    //右侧设备按钮点击事件，获取设备
    getDeviceHandle(e){
      this.ws.send('GetDevice')
      this.isShowDialog = true
      this.dialogMessage = ''
      this.dialogType = 2
      this.isDeviceDialog = true
      this.dialogTitle = this.pageData.dialog.device
    },
    //当前树节点改变的点击事件
    currentNodeChange (data,node){
      console.log(data.node)
    },
    //改变当前设备
    changeDevice(e){
      console.log(e.target.value)
      this.deviceActive = e.target.value
    },
    //上传按钮点击事件
    saveHandler (e){
      if(this.isGreyCommit){
        return
      }
      this.ws.send('SAVE')
      this.isShowLoading = true
      this.loadingMessage = this.pageData.loading.isSaving
    },
    //确定模态框的确定事件，确定上传影像
    confirmHandler(e){
      this.isShowConfirm = false
      this.ws.send('INIT&'+ JSON.stringify(this.initParameterObj))
      //this.ws.send('Refresh')
    },
    //提交按钮点击事件
    commitHandler(e){
      if(this.isGreyCommit){
        return
      }
      this.ws.send('Commit')
      this.isShowLoading = true
      this.loadingMessage = this.pageData.loading.isCommitting
    },
    //打印按钮点击事件
    printHandler(e){
      console.log('print')
      if(this.mainImgSrc){
        console.log(this.$refs.easyPrint)
        this.$refs.easyPrint.print()
      }
    },
    //扫描按钮点击事件
    scanHandler(e){
      console.log(e)
    },
    //功能设置点击事件
    functionSet (e){
      this.isShowFunctionSettings = true
      //记录打开设置页面开关的状态，为取消事件使用
      this.oldFunSetUp.Rename = this.Rename
      this.oldFunSetUp.DeleteNode = this.DeleteNode
      this.oldFunSetUp.TurnCorrect = this.TurnCorrect
      this.oldFunSetUp.Mvblack = this.Mvblack
    },
    //功能设置页面确认按钮点击事件
    updateFunSetting(e){
      this.isShowFunctionSettings = false
      let funSettings = {}
      if(this.DeleteNode){
        funSettings.DeleteNode = '1'
      }else {
        funSettings.DeleteNode = '0'
      }
      if(this.Rename){
        funSettings.Rename = '1'
      }else {
        funSettings.Rename = '0'
      }
      if(this.TurnCorrect){
        funSettings.TurnCorrect = '1'
      }else {
        funSettings.TurnCorrect = '0'
      }
      if(this.Mvblack){
        funSettings.Mvblack = '1'
      }else {
        funSettings.Mvblack = '0'
      }
      this.ws.send('UpdateSetup&2&'+ JSON.stringify(funSettings))

      //将打开页面的记录的就事件用作取消后的数据
      this.Rename = this.oldFunSetUp.Rename
      this.DeleteNode = this.oldFunSetUp.DeleteNode
      this.TurnCorrect  = this.oldFunSetUp.TurnCorrect
      this.Mvblack = this.oldFunSetUp.Mvblack
    },
    //功能设置页面取消按钮点击事件
    cancelUpdateFun(e){
      this.isShowFunctionSettings = false
      //将打开页面的记录的就事件用作取消后的数据
      this.Rename = this.oldFunSetUp.Rename
      this.DeleteNode = this.oldFunSetUp.DeleteNode
      this.TurnCorrect  = this.oldFunSetUp.TurnCorrect
      this.Mvblack = this.oldFunSetUp.Mvblack
    },
    //扫描设置点击事件
    scanSet(e){
      this.isShowScanSettings = true
        //记录打开设置页面开关的状态，为取消事件使用
      this.oldScanSettings.scanRate = this.scanRate
      this.oldScanSettings.scanColor = this.scanColor
      this.oldScanSettings.scanWay = this.scanWay
    },
    //扫描设置页面确认按钮点击事件
    updateScanSettings(e){
      this.isShowScanSettings = false
      let scanSettings = {}
      if(this.scanRate === '1'){
        scanSettings.DPI = '200'
      }else if(this.scanRate === '2'){
        scanSettings.DPI = '300'
      }
      if(this.scanColor === '1'){
        scanSettings.scanColor = '1'
      }else if(this.scanColor === '2'){
        scanSettings.scanColor = '2'
      }else if(this.scanColor === '0'){
        scanSettings.scanColor = '0'
      }
      if(this.scanWay === '1'){
        scanSettings.scanWay = '1'
      }else if(this.scanWay === '2'){
        scanSettings.scanWay = '2'
      }
      this.ws.send('UpdateSetup&1&'+ JSON.stringify(scanSettings))

      //将打开页面的记录的就事件用作取消后的数据
      this.scanRate = this.oldScanSettings.scanRate
      this.scanColor = this.oldScanSettings.scanColor
      this.scanWay  = this.oldScanSettings.scanWay
    },
    //扫描设置页面取消按钮点击事件
    cancelUpdateScan(e){
      this.isShowScanSettings = false
      //将打开页面的记录的就事件用作取消后的数据
      this.scanRate = this.oldScanSettings.scanRate
      this.scanColor = this.oldScanSettings.scanColor
      this.scanWay  = this.oldScanSettings.scanWay
    },
    //ocr设置点击事件
    ocrSet(e){
      this.isShowOcrSettings = true
      //this.oldPattern = this.pattern
      for(let str in this.pattern){
        this.oldPattern[str] = this.pattern[str]
      }
      console.log(this.oldPattern,this.pattern)
    },
    //ocr设置全选/全不选的切换
    toggleShow(e){
      if(this.activePattern === 'pattern1'){
        this.pattern.pattern1 = !this.pattern.pattern1
      }else {
        this.pattern.pattern2 = !this.pattern.pattern2
      }
      this._ocrShow()
      console.log(this.oldPattern,this.pattern)
    },
    //ocr设置页面更新展示函数
    _ocrShow() {
      if(this.activePattern === 'pattern1'){
        if(this.pattern.pattern1){
          this.ocrSetImg = imageServer + 'images/ocr/pattern1-1.jpg'
        }else {
          this.ocrSetImg = imageServer + 'images/ocr/pattern1-0.jpg'
        }
      }else {
        if(this.pattern.pattern2){
          this.ocrSetImg = imageServer + 'images/ocr/pattern2-1.jpg'
        }else {
          this.ocrSetImg = imageServer + 'images/ocr/pattern2-0.jpg'
        }
      }
    },
    //增值税专用
    setPattern1(){
      this.activePattern = 'pattern1'
      this._ocrShow()
    },
    //增值税普通
    setPattern2(){
      this.activePattern = 'pattern2'
      this._ocrShow()
    },
    //ocr设置页面取消按钮事件
    cancelOcrSet() {
      this.isShowOcrSettings = false
      for(let str in this.oldPattern){
        this.pattern[str] = this.oldPattern[str]
      }
      console.log(this.pattern,this.oldPattern)
      this._ocrShow()
    },
    //ocr设置页面确认按钮事件
    updateOcrSet() {
      this.isShowOcrSettings = false
      let ocrSettings = []
      for (let str in this.pattern){
        if(str === 'pattern1'){
          if(this.pattern[str]){
            ocrSettings.push(
            {
              'pattern': '1',
              'isShow': '1'
            })
          }else {
            ocrSettings.push(
              {
                'pattern': '1',
                'isShow': '0'
              })
          }
        }else {
          if(this.pattern[str]){
            ocrSettings.push(
              {
                'pattern': '2',
                'isShow': '1'
              })
          }else {
            ocrSettings.push(
              {
                'pattern': '2',
                'isShow': '0'
              })
          }
        }
      }
      console.log('UpdateSetup&3&'+ JSON.stringify({"BillParam":ocrSettings}))
      this.ws.send('UpdateSetup&3&'+ JSON.stringify({"BillParam":ocrSettings}))

      //通过接口返回数据更新，这里还置回原始状态
      for(let str in this.oldPattern){
        this.pattern[str] = this.oldPattern[str]
      }
      console.log(this.pattern,this.oldPattern)
    },
    //左旋右旋点击韩式
    rotateHandler(type) {
      console.log(type)
      const currentData = this.myTree.getCurrentNode()
      console.log(currentData)
      if(currentData.myDefine){
        this.ws.send(`Rotate&${currentData.myDefine.fullname}&${type}`)
      }
    },
    rightMenuHandler(event,data,node,component) {
      console.log(event,data,node,component.$el)
      this._resetEditMode ()
      const currentData = this.myTree.getCurrentNode()
      const editTitle = component.$el.querySelector('.node-title')
      const title = editTitle.innerText
      this.testEdit = title
      console.log(currentData)
      if(!data.myDefine){
        this.isImage = false
      }else {
        this.isImage = true
      }
      this.isShowRightMenu = true
      this.$refs.rightMenu.style.left = event.clientX + 'px'
      this.$refs.rightMenu.style.top = event.clientY + 'px'
      this.rightNode = node
      this.rightNodeComponent = component
    },
    //点击树形目录的三角图标时，将右键菜单隐藏
    resetRightMenu(){
      this.isShowRightMenu = false
    },
    //右键菜单重命名点击函数，若点击影像为历史影响，则不支持右键重命名
    rightRename (e) {
      console.log('rightRename')
      this.isEditMode = true
      this.isShowRightMenu = false
      const editInput = this.rightNodeComponent.$el.querySelector('.node-edit')
      const editTitle = this.rightNodeComponent.$el.querySelector('.node-title')
      if(this.rightNode.data.myDefine.history === 1){
        this.isShowPrompt = true
        this.promptMessage = '历史影像不支持重命名功能'
        return
      }
      editInput.style.display = 'inline'
      editInput.style.width = editTitle.offsetWidth +'px'
      editTitle.style.display = 'none'
      editInput.select()

    },
    //退出重命名编辑模式
    _resetEditMode() {
      if(this.rightNodeComponent && this.isEditMode){
        const editInput = this.rightNodeComponent.$el.querySelector('.node-edit')
        const editTitle = this.rightNodeComponent.$el.querySelector('.node-title')
        editInput.style.display = 'none'
        editTitle.style.display = 'inline'
        if(this.testEdit === ''){
          console.log('重命名不能为空')
        }else if(this.testEdit === this.rightNode.data.label){
          console.log('无更改')
        }else {
          //editTitle.innerHTML = this.testEdit
          let treeNodesInfo = []
          //1 查看是否存在重名影像
          //const parent = this.rightNode.parent
          //var siblings = parent.childNodes
          for(let i=0;i<this.allImageFiles.length;i++){
            let fileName = this.allImageFiles[i].imageItem.filename
            let subFileName = fileName.substring(0,fileName.indexOf('.'))
            if(subFileName === this.testEdit){
              //重名则弹窗提示
              this.isShowPrompt = true
              this.promptMessage = this.pageData.prompt.renameFail
              this.rightNodeComponent = null
              this.rightNode = null
              this.testEdit = ''
              return
            }else {
              //2 查看是否存在重名影像，不重名则更新接口
              let nodeInfo = {}
              //当前更新节点
              if(this.allImageFiles[i].imageItem.sid === this.rightNode.data.myDefine.sid){
                nodeInfo._filename = this.testEdit + '.' + this.rightNode.data.imageType
              }else {
                nodeInfo._filename = this.allImageFiles[i].imageItem.filename
              }
              nodeInfo._sid = this.allImageFiles[i].imageItem.sid
              nodeInfo._filePath = this.parentData.label + '/' + this.allImageFiles[i].parent + '/'
              console.log('else')
              treeNodesInfo.push(nodeInfo)
            }
          }
          console.log('send')
          const nodesInfoObj = {
            'info': treeNodesInfo
          }
          console.log(JSON.stringify(nodesInfoObj))
          this.ws.send('UpdateTree&'+ JSON.stringify(nodesInfoObj))
        }

        this.isEditMode = false
        //退出编辑后将保存的右键对象清空
        this.rightNodeComponent = null
        this.rightNode = null
        this.testEdit = ''
      }

    },
    //右键干预分组
    rightIntervention() {
      this.isInterventionDialog = true
      this.isShowDialog = true
      this.dialogTitle = this.pageData.dialog.interventionTitle
      this.dialogType = 3
    },
    //右键删除
    rightDelete(e) {
      console.log(this.rightNode)
      let deleteNodeObj = {}
      if(this.rightNode){
        if(this.rightNode.data.myDefine){
          deleteNodeObj.dType = '1'
          deleteNodeObj.sid = this.rightNode.data.myDefine.sid
          deleteNodeObj.docName = ''
          console.log('1',deleteNodeObj)
        }else {
          if(this.rightNode.data.id === '0'){
            deleteNodeObj.dType = '0'
            deleteNodeObj.sid = ''
            deleteNodeObj.docName = this.rightNode.data.label
            console.log('0',deleteNodeObj)
          }else {
            deleteNodeObj.dType = '2'
            deleteNodeObj.sid = ''
            deleteNodeObj.docName = `${this.parentData.label}/${this.rightNode.data.label}`
            console.log('2',deleteNodeObj)
          }
        }
        console.log(`DeleteNode&${JSON.stringify(deleteNodeObj)}`)
        this.ws.send(`DeleteNode&${JSON.stringify(deleteNodeObj)}`)
        deleteNodeObj = {}
        this.rightNode = null
        this.rightNodeComponent = null
      }
    },
    //右键另存为
    rightSaveAs(e) {
      let SaveAsObj = {}
      if(this.rightNode){
        if(this.rightNode.data.myDefine){
          SaveAsObj.dType = '1'
          SaveAsObj.sid = this.rightNode.data.myDefine.sid
          SaveAsObj.docName = ''
          console.log('1',SaveAsObj)
        }else {
          if(this.rightNode.data.id === '0'){
            SaveAsObj.dType = '0'
            SaveAsObj.sid = ''
            SaveAsObj.docName = this.rightNode.data.label
            console.log('0',SaveAsObj)
          }else {
            SaveAsObj.dType = '2'
            SaveAsObj.sid = ''
            SaveAsObj.docName = `${this.parentData.label}/${this.rightNode.data.label}`
            console.log('2',SaveAsObj)
          }
        }
        console.log(`SaveAs&${JSON.stringify(SaveAsObj)}`)
        this.ws.send(`SaveAs&${JSON.stringify(SaveAsObj)}`)
        SaveAsObj = {}
        this.rightNode = null
        this.rightNodeComponent = null
      }
    },
    //右侧选项ocr识别点击事件
    ocrShowHandler(e) {
      let currentData = this.myTree.getCurrentNode()
      let currentNode = this.myTree.getNode(currentData)
      if(this.ocrFiles.length){
        if(!currentData.myDefine){
          this.currentOcrIndex = 0
        }else {
          if(currentData.myDefine.history === 1){
            this.currentOcrIndex = 0
          }else {
            for(let i=0;i<this.ocrFiles.length;i++){
              if(this.ocrFiles[i].sid === currentData.myDefine.sid){
                this.currentOcrIndex = i
              }
            }
          }
        }
        this. _ocrGetInfo()
      }else {
        this.isShowPrompt = true
        this.promptMessage = this.pageData.ocr.noOcrData
      }
    },
    //getInfo接口传入
    _ocrGetInfo() {
      //console.log(this.ocrFiles,this.currentOcrIndex)
      const fullname = this.ocrFiles[this.currentOcrIndex].fullname
      //console.log(fullname)
      this.ws.send('INFO&' + fullname)
    },
    //修改当前ocr干预页面的发票模式
    changePattern(e) {
      console.log(e.target.value)
      this.ocrPattern = e.target.value
      if(this.ocrPattern === '增值税专用发票'){
        if(!this.pattern.pattern1){
          this.isPatternAllSelect = false
        }else {
          this.isPatternAllSelect = true
        }
      }else if(this.ocrPattern === '增值税普通发票'){
        if(!this.pattern.pattern2){
          this.isPatternAllSelect = false
        }else {
          this.isPatternAllSelect = true
        }
      }
    },
    //发票查验按钮的点击事件
    checkInvoice(e) {
      const sid = this.ocrFiles[this.currentOcrIndex].sid
      const invoiceData = getArrayKey(this.basicInfo,'date').value.replace(/[^0-9]/g,'-')
      const invoiceInfo = {}
      console.log(this.basicInfo,typeof this.basicInfo)
      if(invoiceData){
        invoiceInfo.invoice_code = getArrayKey(this.basicInfo,'code').value
        invoiceInfo.invoice_number = getArrayKey(this.basicInfo,'No').value
        invoiceInfo.invoice_date = invoiceData.substring(0,invoiceData.length - 1)
        invoiceInfo.total_tax = getArrayKey(this.basicInfo,'sumTax').value
        invoiceInfo.total_sum = getArrayKey(this.basicInfo,'sumAmount').value
        invoiceInfo.jym = getArrayKey(this.basicInfo,'digitalCode').value
        console.log(`InvoiceCheck&${sid}&${JSON.stringify(invoiceInfo)}`)
        this.ws.send(`InvoiceCheck&${sid}&${JSON.stringify(invoiceInfo)}`)
      }else {
        this.isShowPrompt = true
        this.promptMessage = this.pageData.prompt.invoiceCheck
      }


    },
    //点击input展示局部ocr图片信息
    showCutCanvas(item,info,infoName) {
      console.log(item,info,infoName)
      const cutCanvas = document.getElementById('cut-canvas')
      const canvasBox = this.$refs.canvasBox
      const ocrImg = this.$refs.myOcrImg
      const ctx = cutCanvas.getContext("2d")
      const maxWidth = canvasBox.clientWidth - 50
      let canvasInfo = ''

      if(infoName === 'details'){
        const detail = this.details[this.detailIndex]
        canvasInfo = getArrayKey(detail,item).p
        this.infoManual = getArrayKey(detail,item).value
        this.currentItem = item
        this.currentInfoName = infoName
      }else {
        canvasInfo = getArrayKey(info,item).p
        this.infoManual = getArrayKey(info,item).value
        this.currentItem = item
        this.currentInfoName = infoName
      }

      if(canvasInfo){
        const siteArr = canvasInfo.split(',')
        cutCanvas.setAttribute('width',siteArr[2])
        cutCanvas.setAttribute('height',siteArr[3])
        cutCanvas.style.maxWidth = maxWidth+'px'
        ctx.drawImage(ocrImg,siteArr[0],siteArr[1],siteArr[2],siteArr[3],0,0,siteArr[2],siteArr[3])
      }
    },
    //ocr信息的输入改变事件
    changeInfoHandler(e) {
      console.log('change',e.target.value)
      this.infoManual = e.target.value
      this._setOcrInfo()
    },
    //局部校验的输入改变事件
    checkInput(e) {
      console.log(e)
      this._setOcrInfo()
    },
    //修改ocr信息
    _setOcrInfo(){
      let currentArray = []
      if(this.currentInfoName === 'details'){
        currentArray = this.details[this.detailIndex]
      }else {
        currentArray = this[this.currentInfoName]
      }
      const currentIndex = getArrayIndex(currentArray,this.currentItem)
      const currentInfo = getArrayKey(currentArray,this.currentItem)
      this.$set(currentArray,currentIndex,{
        "value": this.infoManual,
        "p":currentInfo.p,
        "k": currentInfo.k,
        "item": currentInfo.item,
        "description": currentInfo.description
      })
    },
    addDetails() {
      const detailInfo = this.details[this.detailIndex]
      let addDetail = []
      console.log(detailInfo,typeof detailInfo)
      for(let i=0;i<detailInfo.length;i++){
        console.log(detailInfo[i])
        const info = detailInfo[i]
        let addInfo = {}
        for(let str in info){
          if(str === 'id'){
            addInfo[str] = -1
          }else if(str === 'description' || str === 'k'){
            addInfo[str] = info[str]
          }else {
            addInfo[str] = ''
          }
        }
        console.log(addInfo)
        addDetail.push(addInfo)
      }
      console.log(addDetail)
      this.details.push(addDetail)
    },
    reduceDetails() {
      this.details.splice(this.detailIndex,1)
    },
    switchInfoTab(index) {
      // 得到目标位置的top值
      const top = this.infoTops[index]
      console.log(index,this.infoTops)
      // 立即更新scrollY值目标坐标值
      this.infoScrollY = top
      // 平滑滚动到对应位置
      //this.infoScroll.scrollTo(0, -top, 300)
      this.infoScroll.scrollTo(0,-top,300)
    },
    ocrFirstPage() {
      const {turnOcrPageMessage,promptTitle,cancelSave,confirmSave} = this.pageData.ocr
      if(this.currentOcrIndex > 0){
        this.$confirm(turnOcrPageMessage, promptTitle, {
          confirmButtonText: confirmSave,
          cancelButtonText: cancelSave,
        }).then(() => {
          this._commitOcr()
          this.currentOcrIndex = 0
          this._ocrGetInfo()
        }).catch(action => {
          console.log(action)
          this.currentOcrIndex = 0
          this._ocrGetInfo()
        });

      }
    },
    ocrPrevPage() {
      const {turnOcrPageMessage,promptTitle,cancelSave,confirmSave} = this.pageData.ocr
      if(this.currentOcrIndex > 0){
        this.$confirm(turnOcrPageMessage, promptTitle, {
          confirmButtonText: confirmSave,
          cancelButtonText: cancelSave,
        }).then(() => {
          this._commitOcr()
          this.currentOcrIndex --
          this._ocrGetInfo()
        }).catch(() => {
          this.currentOcrIndex --
          this._ocrGetInfo()
        });

      }

    },
    ocrNextPage() {
      const {turnOcrPageMessage,promptTitle,cancelSave,confirmSave} = this.pageData.ocr
      if(this.currentOcrIndex < this.ocrFiles.length - 1){
        this.$confirm(turnOcrPageMessage, promptTitle, {
          distinguishCancelAndClose: true,
          confirmButtonText: confirmSave,
          cancelButtonText: cancelSave,
        }).then(() => {
          this._commitOcr()
          this.currentOcrIndex ++
          this._ocrGetInfo()
        }).catch(() => {
          this.currentOcrIndex ++
          this._ocrGetInfo()
        });

      }
    },
    ocrLastPage() {
      const {turnOcrPageMessage,promptTitle,cancelSave,confirmSave} = this.pageData.ocr
      if(this.currentOcrIndex < this.ocrFiles.length - 1){
        this.$confirm(turnOcrPageMessage, promptTitle, {
          confirmButtonText: confirmSave,
          cancelButtonText: cancelSave,
        }).then(() => {
          this._commitOcr()
          this.currentOcrIndex = this.ocrFiles.length - 1
          this._ocrGetInfo()
        }).catch(() => {
          this.currentOcrIndex = this.ocrFiles.length - 1
          this._ocrGetInfo()
        });

      }
    },
    _commitOcr() {
      const {basicInfo,buyer,seller,passwdInfo,details} = this
      const info = computedInfo(basicInfo)
      const buyerInfo = computedInfo(buyer)
      const sellInfo = computedInfo(seller)
      const passInfo = computedInfo(passwdInfo)
      const detailsInfo = computedDetails(details)
      let imagePattern = ''
      let commitObj = {}
      console.log(this.ocrPattern)
      if(this.ocrPattern === '增值税专用发票'){
        imagePattern = '1'
      }else if(this.ocrPattern === '增值税普通发票'){
        imagePattern = '2'
      }else if(this.ocrPattern === '银行承兑汇票'){
        imagePattern = '3'
      }
      commitObj.pattern = imagePattern
      commitObj.info = info
      commitObj.buyer = buyerInfo
      commitObj.seller = sellInfo
      commitObj.passwd = passInfo
      commitObj.details = detailsInfo
      console.log(`CommitOCR&${this.currentOcrFullName}&${JSON.stringify(commitObj)}`)
      this.ws.send(`CommitOCR&${this.currentOcrFullName}&${JSON.stringify(commitObj)}`)

    }
  },
  computed: {
    infoIndex() {
      const {infoScrollY, infoTops} = this
      //获取index
      const index = infoTops.findIndex((top, index) => {
        return (infoScrollY>top) && (infoScrollY<=infoTops[index+1])
      })
      console.log(infoScrollY, infoTops,index)
      return index+1
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
        width 20%
        height 100%
        .tree-con
          height 100%
          margin-left 50px
          background-color rgba(99,118,194,0.5)
          display flex
          flex-direction column
          .tree-header
            width 100%
            text-align center
            font-size 18px
            font-weight bold
            color white
            padding 10px 0px
            border-bottom 1px solid #000
          .img-tree
            width 100%
            height 100%
            padding 10px 0px
            margin-bottom 10px
            overflow-y auto
            /*overflow-x hidden*/
            .el-tree
              background none
              color rgba(255,255,255,1)
              .node-edit
                min-width 40px
                display none
              .is-current
                &>.el-tree-node__content
                  color #ffd450
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
        width 80%
        height 100%
        .img-con
          height 100%
          margin-left 20px
          margin-right 80px
          position relative
          .img-body
            position absolute
            left 0
            bottom 30px
            top 0
            right 0
            padding 0px 10px
            .prev-btn
              width 30px
              height 100%
              float left
              display flex
              justify-content center
              align-items center
              >img
                width 30px
              &:hover
                background rgba(255,255,255,.15)
            .next-btn
              width 30px
              height 100%
              float right
              display flex
              justify-content center
              align-items center
              >img
                width 30px
              &:hover
                background rgba(255,255,255,.15)
            .showImg
              position absolute
              top 0px
              bottom 10px
              left 60px
              right 60px
              >div
                position absolute
                left 0px
                top 0px
                right 0px
                bottom 0px
                >div
                  position absolute
                  left 0px
                  top 0px
                  right 0px
                  bottom 0px
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
            height 30px
            width 100%
            display flex
            justify-content center
            align-items flex-end
            color white
            .line
              margin 0 8px
            .setting
              display flex
              align-items center
              &.grey
                opacity .5
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
          &.grey
            opacity .5
          &:last-child
            margin-bottom 0
          >img
            width 40px
    .right-menu
      color white
      background-color pink
      position absolute
      left 0px
      top 0px
      z-index 8888
      .menu-item
        padding 6px 10px
        &:hover
          background-color #42b983
        .menu-title
          margin 0 10px
    .ocr-wrapper
      position fixed
      top 0
      left 0
      bottom 0
      right 0
      background-image url("../../assets/img/images/background/bg.png")
      background-size cover
      background-attachment fixed
      z-index 20
      padding 10px 10px
      /*display none*/
      .ocr-con
        position absolute
        left 50px
        right 50px
        top 40px
        bottom 30px
        display flex
        .ocr-img
          width 60%
          height 100%
          position relative
          margin-right 10px
          .img-main
            position absolute
            left 0
            right 0
            top 100px
            bottom 40px
            /*border 1px solid #8a6d3b
            box-sizing border-box
            padding 5px*/
            display flex
            justify-content center
            align-items center
            .showOcrImg
              max-height 100%
              max-width 100%
              opacity 0
            #ocr-canvas
              /*display none*/
              position absolute
              max-height 100%
              max-width 100%
          .img-cut
            width 100%
            height 100px
            .img-part
              width 100%
              height 46px
              border 1px solid #8a6d3b
              position relative
              background-color white
              display flex
              align-items center
              >img
                position absolute
                right 0
                bottom 0
                top 0
                margin auto
                height 43px
              #cut-canvas
                /*max-width 100%*/
                max-height 100%
            .input-check
              width 100%
              height 46px
              border-left 1px solid #8a6d3b
              border-right 1px solid #8a6d3b
              border-bottom 1px solid #8a6d3b
              position relative
              >img
                position absolute
                right 0
                top 0
                height 43px
              >input
                width 100%
                height 44px
                outline none
                line-height 44px
                font-size 20px
          .ocr-btns
            width 100%
            height 30px
            position absolute
            left 0
            bottom 0
            display flex
            justify-content flex-end
            .left-btns
              height 100%
              flex-grow 1
              .left-inner-con
                height 100%
                display flex
                justify-content center
                align-items center
                .check-btn
                  background-color #5cb85c
                  border 1px solid #4cae4c
                  /*height 100%*/
                  box-sizing border-box
                  width 60px
                  color white
                  font-size 18px
                  display flex
                  justify-content center
                  align-items center
                  border-radius 4px
                  /*margin-left 5px*/
                  >span
                    padding 5px 0
                .page-btn
                  height 100%
                  color white
                  box-sizing border-box
                  width 30px
                  background-color #909aa6
                  /*border 1px solid #ccc*/
                  display flex
                  justify-content center
                  align-items center
                  border-radius 4px
                  margin-left 15px
                  >.iconfont
                    color white
                  &.inactive
                    opacity 0.4
                .middle-btn
                  background-color #6d86bf
                  color #fff
                  border none
                  border-radius 0
                  position relative
                  margin-left 25px
                  margin-right 10px
                  &::before
                    content: "";
                    width: 0;
                    height: 0;
                    position: absolute;
                    top: 0;
                    right: -10px;
                    border-top: 15px solid transparent;
                    border-bottom: 15px solid transparent;
                    border-left: 10px solid #6d86bf
                  &::after
                    content: "";
                    width: 0;
                    height: 0;
                    position: absolute;
                    top: 0;
                    left: -10px;
                    border-top: 15px solid transparent;
                    border-bottom: 15px solid transparent;
                    border-right: 10px solid #6d86bf
            .right-btns
              height 100%
              >select
                height 100%
                border-radius 4px
                font-size 14px
                background-color rgba(0,0,0,0)
                color white
                .test-select
                  background-color #7c838e

        .ocr-data
          width 40%
          height 100%
          overflow hidden
          margin-left 30px
          padding-right 20px
          .data
            width 100%
            padding-bottom 25px
            .data-header
              width 100%
              margin-bottom 15px
              background url("../../assets/img/images/background/guanjian_fengge.png") no-repeat center
              display flex
              justify-content center
              >span
                color: #fff;
                text-align: center;
                display: block;
                padding 8px
                background: #4163c3
                font-size 16px
            .data-body
              width 100%
              padding-right 40px
              position relative
              .data-list
                .list-item
                  display flex
                  align-items center
                  color #d6d6d6
                  font-size 15px
                  margin-top 7px
                  height 30px
                  >span
                    margin-left 10px
                  .item-name
                    min-width 100px
                  .item-value
                    flex-grow 1
                    >input
                      width 100%
                      min-width 20px
                      height 23px
                      line-height 23px
                      background-color #7b8197
                      color white
                      padding 0 8px
                  .item-check
                    width 20px
                    height 20px
                    >.check-right
                      display none
                      color #0f0
                      font-size 20px
                    >.check-wrong
                      display none
                      color yellow
                      font-size 20px
              .sync-btn
                position absolute
                right 0px
                top 50%
                transform translateY(-50%)
                >img
                  width 30px
              .detail-btn
                width 100%
                padding 0px 10px 10px 0px
                border-bottom 1px solid #bbb
                display flex
                flex-wrap wrap
                /*justify-content space-between*/
                .page-num
                  margin-left 10px
                  margin-top 10px
                  width 30px
                  height 30px
                  display flex
                  justify-content center
                  align-items center
                  color white
                  /*background-color #909aa6*/
                  border-radius 4px
                  &.active
                    background-color #909aa6
                  &:hover
                    background-color #909aa6

      .ocr-right-tab
        width 30px
        position fixed
        right 0
        top 0
        .close-btn
          padding 5px
          >.iconfont
            font-size 20px
            color white
        .all-tab
          margin-top 10px
          position relative
          .tab-item
            width 30px
            height 110px
            display flex
            justify-content center
            align-items center
            position absolute
            left 0px
            opacity .5
            background-size:cover
            >div
              width 15px
              color white
            &.active
              opacity 1
            &.info-tab
              background-image url("../../assets/img/images/ocr/ocrTab/fapiao.png")
              top 0px
            &.buyer-tab
              background-image url("../../assets/img/images/ocr/ocrTab/goufang.png")
              top 100px
            &.sell-tab
              background-image url("../../assets/img/images/ocr/ocrTab/xiaofang.png")
              top 200px
            &.passwd-tab
              background-image url("../../assets/img/images/ocr/ocrTab/fapiao.png")
              top 300px
            &.details-tab
              background-image url("../../assets/img/images/ocr/ocrTab/fapiao2.png")
              top 400px
    .thumbnail-wrapper
      position absolute
      left 0px
      top 0px
      width 100%
      height 100%
      background-color rgba(0,0,0,.6)
      z-index 20
      display none
      .thumbnail-inner
        position absolute
        left 20px
        top 20px
        bottom 20px
        right 30px
        background-image url("../../assets/img/images/background/bg1.png")
        overflow auto
        .thumbnail-list
          padding-right 40px
          display flex
          flex-wrap wrap
          .thumbnail-item
            width 50%
            padding 15px
            display flex
            justify-content center
            align-items center
            >img
              width 100%
              transition all 1s
              &:hover
                box-shadow 1px -1px 30px 1px #eee
                transform translateY(-5px)
        .thumbnail-right-tab
          width 30px
          height 96%
          position fixed
          top 20px
          right 40px
          z-index: 30
          padding-top 10px
          display flex
          flex-direction column
          align-items center
          .tab-list
            margin-top 10px
            width 100%
            height 100%
            display flex
            flex-direction column
            .tab-item
              font-size 16px
              text-align center
              display flex
              flex-direction column
              align-items center
              color white
              margin-bottom 20px
              .radio-type
                min-width 15px
                min-height 15px
                margin-top 5px
          .close-btn
            width: 100%;
            height: 40px;
            text-align: center;
            >.iconfont
              font-size 20px
              color white
              opacity .5
              &:hover
                font-size 22px
              opacity 1
    .my-model
      position fixed
      left 0px
      top 0px
      width 100%
      height 100%
      background-color rgba(0,0,0,.6)
      .model-inner
        position absolute
        top: 50%
        left 50%
        transform translate(-50%,-50%)
        text-align center
        .setting-footer
          padding 15px
          .el-row
            display flex
            justify-content flex-end
        .setting-header
          padding 15px 0
          font-size 20px
          background #eeeeee
          border-bottom 1px solid #e5e5e5
          border-top-left-radius 15px
          border-top-right-radius 15px
          font-weight bold
          color #333
          .close-btn
            float right
            display flex
            margin-right 10px
            >.iconfont
              color #999
              font-size 12px
              font-weight 900
            &:hover
              transform scale(1.5)
          >.iconfont
            color #428bca
            font-size 20px
          >h4
            font-weight 600
      &.import-model
        z-index 40
        .import-inner
          width 60%
          line-height 80px
          color white
          font-size 16px
      &.function-setting
        z-index 20
        .function-setting-inner
          width 560px
          height 425px
          background white
          color black
          border-radius 15px
          .function-setting-body
            padding 0 20px
            border-bottom 1px solid #e5e5e5
            .select-type
              &>h4
                padding 15px 0
                font-size 18px
                border-bottom 1px solid #e5e5e5
                text-align start
                font-weight 600
              .switch-box
                display flex
                flex-wrap wrap
                padding 10px
                .switch-item
                  padding 10px 0
                  margin-right 40px
                  font-size 18px
                  display flex
                  align-items center
                  &>span
                    margin-right 15px

      &.scan-setting
        z-index 20
        .scan-setting-inner
          width 560px
          background-color white
          color black
          border-radius 15px
          .scan-body
            .scan-option
              padding 15px
              border-bottom 1px solid #e5e5e5
              display flex
              align-items center
              .title
                width 20%
                font-size 18px
                margin-right 30px
                font-weight 600
              .el-radio__inner
                width 16px
                height 16px
              .el-radio__label
                font-size 16px
      &.ocr-setting
        z-index 20
        .ocr-setting-inner
          width 860px
          display flex
          flex-direction column
          background-color white
          .ocr-body
            display flex
            padding 10px
            .left-tab
              width 40px
              font-size 25px
              >div
                height 50%
                display flex
                justify-content center
                align-items center
                color #428bca
                background-color #eeeeee
                padding 20px 0
                &.active
                  background-color #c4e8fa
                &:hover
                  background-color #c4e8fa
            .right-tab
              padding 0 40px
              display flex
              flex-direction column
              .ocr-btn
                display flex
                justify-content flex-start
              .ocr-img
                display flex
                justify-content center
                align-items center
                >img
                  width 720px
      &.is-loading
        z-index 40
        .title
          font-size 16px
          color white
      &.dialog-box
        z-index 888
        .dialog-inner
          width 50%
          background-color white
          border-radius 15px
          .setting-body
            padding 15px
            border-bottom 1px solid #e5e5e5
            >select
              padding 6px 12px
              width 100%
              color #555
              border 1px solid #ccc
              border-radius 4px
            .title
              color #333
              font-size 15px
            .intervention-box
              text-align center
              font-size 14px
              >input
                border 1px solid #ddd
              .original-tips
                color black
              .continue-tips
                color yellow
              .right-tips
                color yellowgreen
              .wrong-tips
                color red
      &.confirm-box
        z-index 40
        .confirm-inner
          width 50%
          background-color white
          border-radius 15px
          .setting-body
            padding 15px
            border-bottom 1px solid #e5e5e5
            .title
              color #333
              font-size 15px
      &.prompt-box
        z-index 40
        .prompt-inner
          width 50%
          background-color white
          border-radius 15px
          .setting-body
            padding 15px
            .title
              color #333
              font-size 15px
              line-height 25px
</style>
