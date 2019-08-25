<template>
  <div class="goodslist-container">
    <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
      <div class="ball" v-if="ballFlag" ref="ball"></div>
    </transition>

    <!-- 商品轮播图区域 -->
    <div class="mui-card">
      <div class="mui-card-content">
        <swiper :bannerlist="bannerlist" :isfull="true"></swiper>
      </div>
    </div>

    <!-- 商品购买区域 -->
    <div class="mui-card">
      <div class="mui-card-header">{{goodsinfo.title}}</div>
      <div class="mui-card-content">
        <div class="mui-card-content-inner">
          <p>
            <del>市场价：￥{{goodsinfo.market_price}}</del>&nbsp;&nbsp;
            <span class="now_price">销售价：￥{{goodsinfo.sell_price}}</span>
          </p>
          <p>
            购买数量：
            <numberbox @getcount="getSelectedCount" :max="goodsinfo.stock_quantity"></numberbox>
          </p>
          <p>
            <mt-button type="primary" size="small">立即购买</mt-button>
            <mt-button type="danger" size="small" @click.prevent="addToCart">加入购物车</mt-button>
            <!-- 分析： 如何实现加入购物车时候，拿到 选择的数量 -->
            <!-- 1. 经过分析发现： 按钮属于 goodsinfo 页面， 数字 属于 numberbox 组件 -->
            <!-- 2. 由于涉及到了父子组件的嵌套了，所以，无法直接在 goodsinfo 页面zhong 中获取到 选中的商品数量值-->
            <!-- 3. 怎么解决这个问题：涉及到了 子组件向父组件传值了（事件调用机制） -->
            <!-- 4. 事件调用的本质： 父向子传递方法，子调用这个方法， 同时把 数据当作参数 传递给这个方法 -->
          </p>
        </div>
      </div>
    </div>

    <!-- 商品参数区域 -->
    <div class="mui-card">
      <div class="mui-card-header">商品参数</div>
      <div class="mui-card-content">
        <div class="mui-card-content-inner">
          <p>商品货号：{{goodsinfo.zhaiyao}}</p>
          <p>库存情况：{{goodsinfo.stock_quantity}}</p>
          <p>上架时间：{{goodsinfo.add_time|dateFormat}}</p>
        </div>
      </div>
      <div class="mui-card-footer">
        <mt-button type="primary" size="large" plain @click="godesc(id)">图文介绍</mt-button>
        <mt-button type="danger" size="large" plain @click="gocomment(id)">商品评论</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
import swiper from "../subcomponents/Swiper.vue";
import numberbox from "../subcomponents/GoodsInfo_numberbox.vue";
export default {
  data() {
    return {
      id: this.$route.params.id, // 将路由参数对象中的 id 挂载到 data , 方便后期调用
      bannerlist: [], // 轮播图的数据
      goodsinfo: [], // 获取到的商品的信息
      ballFlag: false, // 控制小球的隐藏和显示的标识符
      selectedCount: 1 // 保存用户选中的商品数量， 默认，认为用户买1个
    };
  },
  created() {
    this.getBanner();
    this.getGoodsInfo();
  },
  methods: {
    getBanner() {
      this.$http.get("./src/data/thumbs.json").then(result => {
        if (result.body.status === 0) {
          var res = result.body.messages;
          console.log(res);
          res.forEach(element => {
            // 先循环轮播图数组的每一项，为 item 添加 img 属性，因为 轮播图 组件中，只认识 item.imgurl， 不认识 item.src
            element.imgurl = element.src;
          });
          this.bannerlist = res;
        }
      });
    },
    getGoodsInfo() {
      // 获取商品的信息
      this.$http.get("./src/data/thumbs.json").then(result => {
        if (result.body.status === 0) {
          var res = result.body.messages;
          res = res.filter(item => {
            return item.id == this.id;
          });
          this.goodsinfo = res[0];
          console.log(res);
        }
      });
    },
    godesc(id) {
      // 点击使用编程式导航跳转到 图文介绍页面
      this.$router.push({ name: "goodsdesc", params: { id } });
    },
    gocomment(id) {
      // 点击使用编程式导航跳转到 评论页面
      this.$router.push({ name: "goodscomment", params: { id } });
    },
    addToCart() {
      // 添加到购物车
      this.ballFlag = !this.ballFlag;
      // { id:商品的id, count: 要购买的数量, price: 商品的单价，selected: false } 拼接出一个，要保存到 store 中 car 数组里的 商品信息对象
      var goodsinfo = {
        id: this.id,
        count: this.selectedCount,
        price: this.goodsinfo.sell_price,
        selected: true,
        stock_quantity: this.goodsinfo.stock_quantity
      };
      // 调用 store 中的 mutations 来将商品加入购物车
      this.$store.commit("addToCart", goodsinfo);
    },
    beforeEnter(el) {
      el.style.transform = "translate(0,0)";
    },
    enter(el, done) {
      el.offsetWidth;

      // 小球动画优化思路：
      // 1. 先分析导致 动画 不准确的 本质原因： 我们把 小球 最终 位移到的 位置，已经局限在了某一分辨率下的 滚动条未滚动的情况下；
      // 2. 只要分辨率和 测试的时候不一样，或者 滚动条有一定的滚动距离之后， 问题就出现了；
      // 3. 因此，我们经过分析，得到结论： 不能把 位置的 横纵坐标 直接写死了，而是应该 根据不同情况，动态计算这个坐标值；
      // 4. 经过分析，得出解题思路： 先得到 徽标的 横纵 坐标，再得到 小球的 横纵坐标，然后 让 y 值 求差， x 值也求 差，得到 的结果，就是横纵坐标要位移的距离
      // 5. 如何 获取 徽标和小球的 位置？？？   domObject.getBoundingClientRect()

      // 获取小球的 在页面中的位置
      const ballPosition = this.$refs.ball.getBoundingClientRect();
      // 获取 徽标 在页面中的位置
      const badgePosition = document
        .getElementById("badge")
        .getBoundingClientRect();
      const xDist = badgePosition.left - ballPosition.left;
      const yDist = badgePosition.top - ballPosition.top;
      el.style.transform = `translate(${xDist}px,${yDist}px)`;
      el.style.transition = "all .3s cubic-bezier(0,-0.48,1,.46)";
      done();
    },
    afterEnter(el) {
      this.ballFlag = !this.ballFlag;
    },
    getSelectedCount(count) {
      // 当子组件把 选中的数量传递给父组件的时候，把选中的值保存到 data 上
      this.selectedCount = count;
      console.log("父组件拿到的数量值为： " + this.selectedCount);
    }
  },
  components: {
    swiper,
    numberbox
  }
};
</script>
<style lang="scss" scoped>
.goodslist-container {
  background-color: #eee;
  overflow: hidden;
  .now_price {
    color: red;
    font-size: 14px;
  }

  .mui-card-footer {
    display: block;
    button {
      margin: 15px 0;
    }
  }
  .ball {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: red;
    position: absolute;
    z-index: 99;
    top: 355px;
    left: 162px;
  }
}
</style>
