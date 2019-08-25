<template>
  <div>
    <!-- 轮播图区域 -->
    <swiper :bannerlist="bannerlist" :isfull="false"></swiper>

    <!-- 九宫格 到 6宫格 的改造工程 -->
    <ul class="mui-table-view mui-grid-view mui-grid-9">
      <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
        <router-link to="/home/newslist">
          <img src="../../images/menu1.png" alt />
          <div class="mui-media-body">新闻资讯</div>
        </router-link>
      </li>
      <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
        <router-link to="/home/photolist">
          <img src="../../images/menu2.png" alt />
          <div class="mui-media-body">图片分享</div>
        </router-link>
      </li>
      <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
        <router-link to="/home/goodslist">
          <img src="../../images/menu3.png" alt />
          <div class="mui-media-body">商品购买</div>
        </router-link>
      </li>
      <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
        <a href="#">
          <img src="../../images/menu4.png" alt />
          <div class="mui-media-body">留言反馈</div>
        </a>
      </li>
      <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
        <a href="#">
          <img src="../../images/menu5.png" alt />
          <div class="mui-media-body">视频专区</div>
        </a>
      </li>
      <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
        <a href="#">
          <img src="../../images/menu6.png" alt />
          <div class="mui-media-body">联系我们</div>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
// 按需导入 Toast 组件
import { Toast } from "mint-ui";
import swiper from '../subcomponents/Swiper.vue'
export default {
  data() {
    return {
      bannerlist: [] // 保存轮播图的数组
    };
  },
  created() {
    this.getbanner();
  },
  methods: {
    getbanner() {
      // 获取轮播图数据的方法
      this.$http.get("./src/data/data.json").then(result => {
        console.log(result.body);
        if (result.body.status === 0) {
          this.bannerlist = result.body.messages;
          Toast("加载轮播图成功");
        } else {
          Toast("加载轮播图失败");
        }
      });
    }
  },
  components:{
    swiper
  }
};
</script>
<style lang="scss" scoped>
.mui-table-view.mui-grid-view {
  background-color: #fff;
  border: none;
  img {
    width: 60px;
  }
  .mui-table-view-cell.mui-media {
    border: none;
  }
  .mui-media-body {
    font-size: 14px;
  }
}
</style>
