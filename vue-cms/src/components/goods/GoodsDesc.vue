<template>
  <div class="goodsdesc-container">
    <h1>{{info.title}}</h1>
    <hr />
    <div class="content" v-html="info.zhaiyao"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      info: {} // 图文数据
    };
  },
  created() {
    this.getGoodsDesc(this.$route.params.id);
  },
  methods: {
    getGoodsDesc(id) {
      this.$http.get("./src/data/data.json").then(result => {
        if (result.body.status === 0) {
          var res = result.body.messages;
          res = res.filter(item => {
            return item.id == parseInt(id) + 12;
          });
          console.log(res);
          this.info = res[0];
        }
      });
    }
  }
};
</script>
<style lang="scss">
.goodsdesc-container {
  padding: 4px;
  h1 {
    font-size: 18px;
    text-align: center;
    color: #2274ee;
    margin: 15px 0;
  }
  .content {
    img {
      width: 100%;
    }
  }
}
</style>
