// 1. 导入 vue-router 包
import VueRouter from "vue-router";

import HomeContainer from "./components/tabbar/HomeContainer.vue";
import CartContainer from "./components/tabbar/CartContainer.vue";
import MemberContainer from "./components/tabbar/MemberContainer.vue";
import SearchContainer from "./components/tabbar/SearchContainer.vue";

// 3. 创建路由对象
var router = new VueRouter({
  routes: [
    { path: "/", redirect: "/home" },
    { path: "/home", component: HomeContainer },
    { path: "/cart", component: CartContainer },
    { path: "/member", component: MemberContainer },
    { path: "/search", component: SearchContainer },
  ],
  linkActiveClass: "mui-active" // 覆盖默认的路由高亮的类，默认的类叫做 router-link-active
});

// 把路由对象暴露出去
export default router;
