import Vue from "vue";
// 注册 vuex
import Vuex from "vuex";
Vue.use(Vuex);

// 每次刚进入 网站，肯定会 调用 main.js 在刚调用的时候，先从本地存储中，把 购物车的数据读出来，放到 store 中
var cart = JSON.parse(localStorage.getItem("cart") || "[]");
var store = new Vuex.Store({
  state: {
    // this.$store.state.***
    cart: cart // 将 购物车中的商品的数据，用一个数组存储起来，在 car 数组中，存储一些商品的对象， 咱们可以暂时将这个商品对象，设计成这个样子
    // { id:商品的id, count: 要购买的数量, price: 商品的单价，selected: false  }
  },
  mutations: {
    // this.$store.commit('方法的名称', '按需传递唯一的参数')
    addToCart(state, goodsinfo) {
      // 点击加入购物车，把商品信息，保存到 store 中的 car 上
      // 分析：
      // 1. 如果购物车中，之前就已经有这个对应的商品了，那么，只需要更新数量
      // 2. 如果没有，则直接把 商品数据，push 到 car 中即可

      // 假设 在购物车中，没有找到对应的商品
      var flag = false;
      state.cart.some(item => {
        if (item.id == goodsinfo.id) {
          item.count += parseInt(goodsinfo.count);
          flag = true;
          return true;
        }
      });
      // 如果最终，循环完毕，得到的 flag 还是 false，则把商品数据直接 push 到 购物车中
      if (!flag) {
        state.cart.push(goodsinfo);
      }

      // 当 更新 car 之后，把 car 数组，存储到 本地的 localStorage 中
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    undateGoodsInfo(state, goodsinfo) {
      // 修改购物车中商品的数量值
      // 分析：
      state.cart.some(item => {
        if (item.id == goodsinfo.id) {
          item.count = parseInt(goodsinfo.count);
          return true;
        }
      });
      // 当修改完商品的数量，把最新的购物车数据，保存到 本地存储中
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeGoodsInfo(state, id) {
      // 根据Id，从store 中的购物车中删除对应的那条商品数据
      state.cart.forEach((item, i) => {
        if (item.id == id) {
          state.cart.splice(i, 1);
          return true;
        }
      });
      // 将删除完毕后的，最新的购物车数据，同步到 本地存储中
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    undateGoodsSelected(state, options) {
      state.cart.some(item => {
        if (item.id == options.id) {
          item.selected = options.selected;
          return true;
        }
      });
      // 把最新的 所有购物车商品的状态保存到 store 中去
      localStorage.setItem("cart", JSON.stringify(state.cart));
    }
  },
  getters: {
    // this.$store.getters.***
    // 相当于 计算属性，也相当于 filters
    getAllCount(state) {
      var total = 0;
      state.cart.forEach(item => {
        total += item.count;
      });
      return total;
    },
    getGoodsCount(state) {
      var o = {};
      state.cart.forEach(item => {
        o[item.id] = item.count;
      });
      return o;
    },
    getGoodsSelected(state) {
      var o = {};
      state.cart.forEach(item => {
        o[item.id] = item.selected;
      });
      return o;
    },
    getGoodsCountAndAmount(state) {
      var o = {
        count: 0, // 勾选的数量
        amount: 0 // 勾选的总价
      };
      state.cart.forEach(item => {
        if (item.selected) {
          o.count += item.count;
          o.amount += item.price * item.count;
        }
      });
      return o;
    }
  }
});

export default store;
