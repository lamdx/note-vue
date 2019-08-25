<template>
  <div>
    <h1>这是App组件</h1>
    <mt-button type="danger" size="large" disabled>default</mt-button>
    <mt-button type="danger" icon="more" @click="show">default</mt-button>
    <br>
    <button type="button" class="mui-btn mui-btn-royal mui-btn-outlined">紫色</button>
    <router-link to="/account">account</router-link>
    <router-link to="/goodslist">goodslist</router-link>
    <router-view></router-view>
  </div>
</template>
<script>
// 按需导入 Toast 组件
import { Toast } from 'mint-ui';
export default {
  data() {
    return {
      instance: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.show()
      setTimeout(() => {
        this.instance.close()
      }, 3000)
    },
    show() {
      this.instance = Toast({
        message: '提示',
        position: 'bottom',
        duration: -1, // 如果是 -1 则弹出之后不消失
        iconClass: 'glyphicon glyphicon-heart', // 设置 图标的类
        className: 'mytoast' // 自定义Toast的样式，需要自己提供一个类名
      });
    }
  }
}
</script>
<style></style>