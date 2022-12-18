<template>
  <div>
    <!-- 顶部滑动条区域 -->
    <div id="slider" class="mui-slider">
      <div
        id="sliderSegmentedControl"
        class="mui-scroll-wrapper mui-segmented-control mui-segmented-control-inverted"
      >
        <div class="mui-scroll">
          <a
            :class="['mui-control-item', item.id==0?'mui-active':'']"
            v-for="item in categorys"
            :key="item.id"
            @tap="getPhoto(item.id)"
          >{{item.title}}</a>
        </div>
      </div>
    </div>

    <!-- 图片列表区域 -->
    <ul class="photolist">
      <router-link v-for="item in list" :key="item.id" :to="'/home/photoinfo/'+item.c_id" tag="li">
        <img v-lazy="item.src" />
        <div class="info">
          <h1 class="info-title">{{ item.c_title }}</h1>
          <div class="info-body">{{ item.c_content }}</div>
        </div>
      </router-link>
    </ul>
  </div>
</template>
<script>
// 1. 导入 mui 的js文件
import mui from "../../lib/mui/js/mui.min.js";

export default {
  data() {
    return {
      categorys: [],
      list: []
    };
  },
  created() {
    this.getAllCategory();
    // 默认进入页面，就主动请求 所有图片列表的数据
    this.getPhoto(0);
  },
  mounted() {
    mui(".mui-scroll-wrapper").scroll({
      // 当 组件中的DOM结构被渲染好并放到页面中后，会执行这个 钩子函数
      // 如果要操作元素了，最好在 mounted 里面，因为，这里时候的 DOM 元素 是最新的
      // 2. 初始化滑动控件
      deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
      indicators: false
    });
  },
  methods: {
    getAllCategory() {
      // 获取所有的图片分类
      this.$http.get("./src/data/category.json").then(result => {
        if (result.body.status === 0) {
          var res = result.body.messages;
          // console.log(res);
          // 手动拼接出一个最完整的 分类列表
          res.unshift({ id: 0, title: "全部" });
          this.categorys = res;
          console.log(this.categorys);
        }
      });
    },
    getPhoto(cateId) {
      // 根据 分类Id，获取图片列表
      this.$http.get("./src/data/photolist.json").then(result => {
        if (result.body.status === 0) {
          var res = result.body.messages;
          // console.log(res);
          this.list = res[cateId].url;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  touch-action: pan-y;
}

.mui-slider{
  z-index: 0;
}

.photolist {
  list-style-type: none;
  margin: 0;
  padding: 10px;
  padding-bottom: 0;
  li {
    display: block;
    background-color: #ccc;
    text-align: center;
    position: relative;
    margin-bottom: 10px;
    box-shadow: 0 0 9px #999;
    img {
      width: 100%;
      vertical-align: middle;
    }
    img[lazy="loading"] {
      width: 40px;
      height: 300px;
      margin: auto;
    }
    .info {
      color: white;
      text-align: left;
      position: absolute;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
      max-height: 84px;
      .info-title {
        font-size: 14px;
      }
      .info-body {
        font-size: 13px;
      }
    }
  }
}
</style>
