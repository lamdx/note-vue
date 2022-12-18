<template>
  <div class="cart-container">
    <div class="goods-list" v-for="(item,i) in goodslist" :key="item.id">
      <!-- 商品列表项区域 -->
      <div class="mui-card-content">
        <div class="mui-card-content-inner">
          <mt-switch
            v-model="$store.getters.getGoodsSelected[item.id]"
            @change="selectedChange(item.id,$store.getters.getGoodsSelected[item.id])"
          ></mt-switch>
          <img :src="item.msrc" alt />
          <div class="info">
            <h1>{{item.title}}</h1>
            <p>
              <span>￥{{item.sell_price}}</span>
              <numberbox :initcount="$store.getters.getGoodsCount[item.id]" :goodsid="item.id"></numberbox>
              <!-- 问题：如何从购物车中获取商品的数量呢 -->
              <!-- 1. 我们可以先创建一个 空对象，然后循环购物车中所有商品的数据， 把 当前循环这条商品的 Id， 作为 对象 的 属性名，count值作为 对象的 属性值，这样，当把所有的商品循环一遍，就会得到一个对象： { 88: 2, 89: 1, 90: 4 } -->
              <a href="#" @click.prevent="remove(item.id,i)">删除</a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 结算区域 -->
    <div class="mui-card-content">
      <div class="mui-card-content-inner">
        <div class="calc">
          <div class="left">
            <p>总计（不含运费）</p>
            <p>
              已勾选商品
              <span class="red">{{$store.getters.getGoodsCountAndAmount.count}}</span>件，总价
              <span class="red">￥{{$store.getters.getGoodsCountAndAmount.amount}}</span>
            </p>
          </div>
          <mt-button type="danger">去结算</mt-button>
        </div>
      </div>
    </div>
    <p>{{$store.getters.getGoodsSelected}}</p>
  </div>
</template>
<script>
import numberbox from "../subcomponents/Cart_numberbox.vue";
export default {
  data() {
    return {
      goodslist: [] // 购物车中所有商品的数据
    };
  },
  created() {
    this.getGooslist();
  },
  methods: {
    getGooslist() {
      // 1. 获取到 store 中所有的商品的Id，然后拼接出一个 用逗号分隔的 字符串
      var idArr = [];
      this.$store.state.cart.forEach(item => {
        idArr.push(item.id);
      });
      // 如果 购物车中没有商品，则直接返回，不需要请求数据接口，否则会报错
      if (idArr.length <= 0) {
        return;
      }
      // 获取购物车商品列表
      this.$http.get("./src/data/thumbs.json").then(result => {
        if (result.body.status === 0) {
          var res = result.body.messages;
          // console.log(res);
          res = res.filter(item => {
            return idArr.includes(item.id);
          });
          this.goodslist = res;
          console.log(this.goodslist);
        }
      });
    },
    remove(id, index) {
      // 点击删除，把商品从 store 中根据 传递的 Id 删除，同时，把 当前组件中的 goodslist 中，对应要删除的那个商品，使用 index 来删除
      this.goodslist.splice(index, 1);
      this.$store.commit("removeGoodsInfo", id);
    },
    selectedChange(id, val) {
      // 每当点击开关，把最新的 快关状态，同步到 store 中
      // console.log(id+'----'+val);
      this.$store.commit("undateGoodsSelected", { id, selected: val });
    }
  },
  components: {
    numberbox
  }
};
</script>
<style lang="scss" scoped>
.cart-container {
  background-color: #eee;
  overflow: hidden;
  .goods-list {
    .mui-card-content-inner {
      display: flex;
      align-items: center;
      img {
        width: 60px;
      }
      h1 {
        font-size: 13px;
      }
      .info {
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        span {
          color: red;
          font-weight: bold;
        }
      }
    }
  }

  .calc {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .red {
      color: red;
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>
