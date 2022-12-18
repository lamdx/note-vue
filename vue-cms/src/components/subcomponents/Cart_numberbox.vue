<template>
  <div class="mui-numbox" data-numbox-min="1" style="height:25px">
    <button class="mui-btn mui-btn-numbox-minus" type="button">-</button>
    <input
      id="test"
      class="mui-input-numbox"
      type="number"
      :value="initcount"
      @change="countChanged"
      ref="numberbox"
    />
    <button class="mui-btn mui-btn-numbox-plus" type="button">+</button>
  </div>
</template>
<script>
import mui from "../../lib/mui/js/mui.min.js";
export default {
  data() {
    return {};
  },
  mounted() {
    // 初始化数字选择框组件
    mui(".mui-numbox").numbox();
  },
  methods: {
    countChanged() {
      // 数量改变了
      // console.log(this.$refs.numberbox.value);
      // 每当数量值改变，则立即把最新的数量同步到 购物车的  store 中，覆盖之前的数量值F
      this.$store.commit("undateGoodsInfo", {
        id: this.goodsid,
        count: this.$refs.numberbox.value
      });
    }
  },
  props: ["initcount", "goodsid"]
};
</script>
<style lang="scss" scoped>
</style>

