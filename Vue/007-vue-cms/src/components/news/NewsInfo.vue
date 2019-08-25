<template>
  <div class="newsinfo-container">
    <!-- 大标题 -->
    <h1 class="title">{{ newsinfo.title }}</h1>
    <!-- 子标题 -->
    <p class="subtitle">
      <span>发表时间：{{ newsinfo.add_time|dateFormat }}</span>
      <span>点击次数：{{ newsinfo.click }}</span>
    </p>
    <hr />
    <!-- 内容区域 -->
    <div class="content" v-html="newsinfo.zhaiyao"></div>
    <!-- 评论子组件区域 -->
    <comment-box :id="id"></comment-box>
  </div>
</template>
<script>
// 1. 导入 评论子组件
import comment from "../subcomponents/Comments.vue";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      id: this.$route.params.id, // 将 URL 地址中传递过来的 Id值，挂载到 data上，方便以后调用
      newsinfo: {} // 新闻对象
    };
  },
  created() {
    this.getNewInfo();
  },
  methods: {
    getNewInfo() {
      // 获取新闻详情
      this.$http.get("./src/data/data.json").then(result => {
        if (result.body.status === 0) {
          var res = result.body.messages;
          res = res.filter((item, i) => {
            // console.log(item);
            // console.log(i);
            return item.id == this.id;
          });
          this.newsinfo = res[0];
          console.log(res[0]);
          // Toast('ok')
        } else {
          Toast("failure");
        }
      });
    }
  },
  components: {
    // 用来注册子组件的节点
    "comment-box": comment
  }
};
</script>
<style lang="scss">
.newsinfo-container {
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
}
</style>
