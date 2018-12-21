<template>
  <div id="app">
    <!--<img src="./assets/logo.png">
    <HelloWorld/>-->
    <!--<img src="./assets/ocrBg.jpg" alt="">-->
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"
             @node-contextmenu="rightClick" @check-change="checkChange" @current-change="currentChange">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span> <img :src="node.icon" style="width:18px; vertical-align: middle"/>{{ node.label }}</span>
      </span>
    </el-tree>
    <div class="menu" v-show="menuShow1">
      <ul>
        <li>菜单1</li>
        <li>菜单1</li>
        <li>菜单1</li>
      </ul>
    </div>
    <div class="menu" v-show="menuShow2">
      <ul>
        <li>菜单2</li>
        <li>菜单2</li>
      </ul>
    </div>
    <!--<div v-show = "menuVisible">
      <ul id = "menu">
        <li tabindex="-1" class="menu_item" id="menu-4994-1-0">Axure Components</li>
        <li tabindex="-1" class="menu_item" id="menu-4994-1-1">Sketch Templates</li>
        <li tabindex="-1" class="menu_item" id="menu-4994-1-2">组件交互文档</li>
      </ul>
    </div>-->
    <el-row :gutter="30">
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="18"><div class="grid-content bg-purple"></div></el-col>

    </el-row>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld'
//import {Button,Select,Switch} from 'element-ui'

export default {
  name: 'App',
  data() {
    return {
      data: [{
        label: '一级 1',
        icon:"../static/tree/jpg.png",
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      //menuVisible : false
      menuShow1: false,
      menuShow2: false
    };
  },
  mounted (){
    document.addEventListener('click',this.menuHide)
  },
  methods: {
    handleNodeClick(object, node, component) {
      console.log(object, node, component);
      //this.menuVisible = false;
      this.menuShow1 = false
      this.menuShow2 = false
    },
    rightClick(event, object, node, component) {
      /*if(value.level == 1){
        this.menuVisible = true;
        let menu = document.querySelector("#menu");
        /!* 菜单定位基于鼠标点击位置 *!/
        menu.style.left = event.clientX + 20 + "px" ;
        menu.style.top = event.clientY -10 + "px";
      }*/
      if(node.isLeaf){
        this.menuShow2 = false
        this.menuShow1 = true
      }else {
        this.menuShow1 = false
        this.menuShow2 = true
      }

      let menu = document.querySelectorAll(".menu");
      console.log(menu)
      for(var i=0;i<menu.length;i++){
        menu[i].style.left = event.clientX + "px";
        menu[i].style.top = event.clientY + "px";
      }
      console.log("右键被点击的event:", event);
      console.log("右键被点击的object:", object);
      console.log("右键被点击的node:", node);
      console.log("右键被点击的component:", component);

    },
    menuHide(e) {
      console.log("我被执行了！！！");
      console.log("!!!!!!!!!!!!!!e.targetName=", e.target.nodeName);
      //this.menuVisible = false;
      this.menuShow1 = false;
      this.menuShow2 = false;

      /*if (!this.$refs.menu.contains(e.target)) {
        console.log(e.target);
        console.log("right!!!!!!!!!");
        this.menuVisible = false;
      }*/
    },
    checkChange(object,isCheck,isChildCheck) {
      console.log(object,isCheck,isChildCheck)
    },
    currentChange(data,node){
      console.log(data,node)
    }

  }
}
</script>

<style lang="less" type="text/less" rel="stylesheet/less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
  .el-tree {
    position: relative;
  }
.menu {
  /*width: 200px;*/
  background: pink;
  position: absolute;
  top:0px;
  left: 0px;
  padding-inline-start: 0;
}
  .menu ul {
    list-style: none;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
