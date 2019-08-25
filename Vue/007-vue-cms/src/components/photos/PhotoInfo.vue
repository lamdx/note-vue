<template>
  <div class="photoinfo-container">
    <!-- 大标题 -->
    <h1 class="title">{{ photoinfo.title }}</h1>
    <!-- 子标题 -->
    <p class="subtitle">
      <span>发表时间：{{ photoinfo.add_time|dateFormat }}</span>
      <span>点击次数：{{ photoinfo.click }}</span>
    </p>
    <hr />
    <!-- 缩略图区域 -->

    <div class="thumbs">
      <vue-preview :slides="slide1" @close="handleClose"></vue-preview>
    </div>
    <!-- 内容区域 -->
    <div class="content" v-html="photoinfo.zhaiyao"></div>
    <!-- 放置一个现成的 评论子组件 -->
    <comment-box :id="id"></comment-box>
  </div>
</template>
<script>
import comments from "../subcomponents/Comments.vue";
export default {
  data() {
    return {
      id: this.$route.params.id, // 从路由中获取到的 图片Id
      photoinfo: [], // 图片详情
      slide1: [] // 缩略图的数组
    };
  },
  created() {
    this.getPhotoInfo();
    this.getThumbs();
  },
  methods: {
    getPhotoInfo() {
      // 获取图片的详情
      this.$http.get("./src/data/data.json").then(result => {
        if (result.body.status === 0) {
          var res = result.body.messages;
          console.log(res);
          console.log(this.id);
          res = res.filter(item => {
            return item.id == parseInt(this.id) + 14;
          });
          console.log(res[0]);
          this.photoinfo = res[0];
        }
      });
    },
    getThumbs() {
      // 获取缩略图
      this.$http.get("./src/data/thumbs.json").then(result => {
        if (result.body.status === 0) {
          var res = result.body.messages;
          console.log(res);
          res.forEach(element => {
            // 循环每个图片数据，补全图片的宽和高
            (element.w = 600), (element.h = 450);
          });
          // 把完整的数据保存到 list 中
          this.slide1 = res;
        }
      });
    },
    handleClose() {
      console.log("close event");
    }
  },
  components: {
    // 注册 评论子组件
    "comment-box": comments
  }
};
</script>
<style lang="scss">
.photoinfo-container {
  padding: 0 4px;
  .title {
    text-align: center;
    font-size: 16px;
    margin: 15px 0;
    color: red;
  }
  .subtitle {
    display: flex;
    font-size: 14px;
    color: blue;
    justify-content: space-between;
  }
  .content {
    img {
      width: 100%;
    }
  }

  .thumbs {
    vue-preview {
      width: 50px;
    }
  }
}
</style>
