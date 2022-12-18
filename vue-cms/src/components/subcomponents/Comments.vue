<template>
  <div class="cmt-container">
    <h1>发表评论</h1>
    <textarea name id cols="30" rows="5" placeholder="请输入要BB的内容" maxlength="120" v-model="msg"></textarea>
    <mt-button type="primary" size="large" @click="postComment">发表评论</mt-button>
    <div class="cmt-list">
      <div class="cmt-item" v-for="(item, i) in comments" :key="item.id">
        <div
          class="cmt-title"
        >第{{ i+1 }}楼&nbsp;&nbsp;用户：{{ item.username }}{{id}}&nbsp;&nbsp;发表时间：{{ item.add_tiem|dateFormat }}</div>
        <div class="cmt-body">{{ item.content === "undefined"?'此用户很懒，嘛都没说': item.content }}</div>
      </div>
    </div>
    <mt-button type="danger" size="large" plain @click="getMore">加载更多</mt-button>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      pageIndex: 1, // 默认展示第一页数据
      comments: [], // 所有的评论数据
      msg: "" // 评论输入的内容
    };
  },
  created() {
    this.getComment();
  },
  methods: {
    getComment() {
      // 获取评论
      this.$http.get("./src/data/comment.json").then(result => {
        if (result.body.status === 0) {
          var res = result.body.messages;
          res = res.filter((item, i) => {
            // console.log(item)
            // console.log(i);
            return i <= this.pageIndex * 3;
          });
          console.log(res);
          this.comments = res;
          // 每当获取新评论数据的时候，不要把老数据清空覆盖，而是应该以老数据，拼接上新数据
          // this.comments = this.comments.concat(result.body.message);
          // Toast('ok')
        } else {
          Toast("加载数据失败");
        }
      });
    },
    getMore() {
      // 加载更多
      this.pageIndex++;
      this.getComment();
    },
    postComment() {
      // 发表评论
      // 校验是否为空内容
      if (this.msg.trim().length === 0) {
        return Toast("评论内容不能为空！");
      }
      // 发表评论
      // 参数1： 请求的URL地址
      // 参数2： 提交给服务器的数据对象 { content: this.msg }
      // 参数3： 定义提交时候，表单中数据的格式  { emulateJSON:true }
      this.$http
        .post("http://vue.studyit.io/api/postcomment/" + this.$route.params.id)
        .then(function(result) {
          if (result.body.status === 0) {
            // 1. 拼接出一个评论对象
            var cmt = {
              user_name: "匿名用户",
              add_time: Date.now(),
              content: this.msg.trim()
            };
            this.comments.unshift(cmt);
            this.msg = "";
          }
        });
    }
  },
  props: ["id"]
};
</script>
<style lang="scss" scoped>
.cmt-container {
  h1 {
    font-size: 18px;
  }
  textarea {
    font-size: 14px;
    margin: 0;
  }
  .cmt-list {
    margin: 5px 0;
    .cmt-item {
      font-size: 14px;
      .cmt-title {
        line-height: 30px;
        background-color: #ccc;
      }
      .cmt-body {
        line-height: 35px;
        text-indent: 2rem;
      }
    }
  }
}
</style>
