# Vue.js Webpack

## 在网页中会引用哪些常见的静态资源

- JS
  - .js .jsx .coffee .ts（TypeScript 类 C# 语言）
- CSS
  - .css .less .sass .scss
- Images
  - .jpg .png .gif .bmp .svg
- 字体文件（Fonts）
  - .svg .ttf .eot .woff .woff2
- 模板文件
  - .ejs .jade .vue【这是在 webpack 中定义组件的方式，推荐这么用】

## 网页中引入的静态资源多了以后有什么问题

1.网页加载速度慢， 因为 我们要发起很多的二次请求；

2.要处理错综复杂的依赖关系

## 如何解决上述两个问题

1.合并、压缩、精灵图、图片的 Base64 编码

2.可以使用之前学过的 requireJS、也可以使用 webpack 可以解决各个包之间的复杂依赖关系；

## 什么是 webpack?

webpack 是前端的一个项目构建工具，它是基于 Node.js 开发出来的一个前端工具；

## 如何完美实现上述的 2 种解决方案

1.使用 Gulp， 是基于 task 任务的；

2.使用 Webpack， 是基于整个项目进行构建的；

- 借助于 webpack 这个前端自动化构建工具，可以完美实现资源的合并、打包、压缩、混淆等诸多功能。
- 根据官网的图片介绍 webpack 打包的过程
- [webpack 官网](http://webpack.github.io/)

## webpack 安装的两种方式

1.运行`npm i webpack -g`全局安装 webpack，这样就能在全局使用 webpack 的命令

2.在项目根目录中运行`npm i webpack --save-dev`安装到项目依赖中

## 初步使用 webpack 打包构建列表隔行变色案例

1.运行`npm init`初始化项目，使用 npm 管理项目中的依赖包

2.创建项目基本的目录结构

3.使用`npm i jquery --save`安装 jquery 类库

4.创建`main.js`并书写各行变色的代码逻辑：

```javascript
// 导入jquery类库
import $ from 'jquery';

// 设置偶数行背景色，索引从0开始，0是偶数
$('#list li:even').css('backgroundColor', 'lightblue');
// 设置奇数行背景色
$('#list li:odd').css('backgroundColor', 'pink');
```

5.直接在页面上引用`main.js`会报错，因为浏览器不认识`import`这种高级的 JS 语法，需要使用 webpack 进行处理，webpack 默认会把这种高级的语法转换为低级的浏览器能识别的语法； 6.运行`webpack 入口文件路径 输出文件路径`对`main.js`进行处理：

```shell
webpack src/js/main.js dist/bundle.js
```

## 使用 webpack 的配置文件简化打包时候的命令

1.在项目根目录中创建`webpack.config.js`

2.由于运行 webpack 命令的时候，webpack 需要指定入口文件和输出文件的路径，所以，我们需要在`webpack.config.js`中配置这两个路径：

```javascript
// 导入处理路径的模块
var path = require('path');

// 导出一个配置对象，将来webpack在启动的时候，会默认来查找webpack.config.js，并读取这个文件中导出的配置对象，来进行打包处理
module.exports = {
  entry: path.resolve(__dirname, 'src/js/main.js'), // 项目入口文件
  output: {
    // 配置输出选项
    path: path.resolve(__dirname, 'dist'), // 配置输出的路径
    filename: 'bundle.js' // 配置输出的文件名
  }
};
```

## 实现 webpack 的实时打包构建

1.由于每次重新修改代码之后，都需要手动运行 webpack 打包的命令，比较麻烦，所以使用`webpack-dev-server`来实现代码实时打包编译，当修改代码之后，会自动进行打包构建。

2.运行`npm i webpack-dev-server --save-dev`安装到开发依赖

3.安装完成之后，在命令行直接运行`webpack-dev-server`来进行打包，发现报错，此时需要借助于`package.json`文件中的指令，来进行运行`webpack-dev-server`命令，在`scripts`节点下新增`"dev": "webpack-dev-server"`指令，发现可以进行实时打包，但是 dist 目录下并没有生成`bundle.js`文件，这是因为`webpack-dev-server`将打包好的文件放在了内存中

- 把`bundle.js`放在内存中的好处是：由于需要实时打包编译，所以放在内存中速度会非常快
- 这个时候访问 webpack-dev-server 启动的`http://localhost:8080/`网站，发现是一个文件夹的面板，需要点击到 src 目录下，才能打开我们的 index 首页，此时引用不到 bundle.js 文件，需要修改 index.html 中 script 的 src 属性为:`<script src="../bundle.js"></script>`
- 为了能在访问`http://localhost:8080/`的时候直接访问到 index 首页，可以使用`--contentBase src`指令来修改 dev 指令，指定启动的根目录：

```json
"dev": "webpack-dev-server --contentBase src"
```

同时修改 index 页面中 script 的 src 属性为`<script src="bundle.js"></script>`

## 使用`html-webpack-plugin`插件配置启动页面

由于使用`--contentBase`指令的过程比较繁琐，需要指定启动的目录，同时还需要修改 index.html 中 script 标签的 src 属性，所以推荐大家使用`html-webpack-plugin`插件配置启动页面.

1.运行`npm i html-webpack-plugin --save-dev`安装到开发依赖

2.修改`webpack.config.js`配置文件如下：

```javascript
// 导入处理路径的模块
var path = require('path');
// 导入自动生成HTMl文件的插件
var htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/js/main.js'), // 项目入口文件
  output: {
    // 配置输出选项
    path: path.resolve(__dirname, 'dist'), // 配置输出的路径
    filename: 'bundle.js' // 配置输出的文件名
  },
  plugins: [
    // 添加plugins节点配置插件
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'), //模板路径
      filename: 'index.html' //自动生成的HTML文件的名称
    })
  ]
};
```

3.修改`package.json`中`script`节点中的 dev 指令如下：

```json
"dev": "webpack-dev-server"
```

4.将 index.html 中 script 标签注释掉，因为`html-webpack-plugin`插件会自动把 bundle.js 注入到 index.html 页面中！

## 实现自动打开浏览器、热更新和配置浏览器的默认端口号

**注意：热更新在 JS 中表现的不明显，可以从一会儿要讲到的 CSS 身上进行介绍说明！**

### 方式 1

- 修改`package.json`的 script 节点如下，其中`--open`表示自动打开浏览器，`--port 3000`表示打开的端口号为 3000，`--hot`表示启用浏览器热更新：

```json
"dev": "webpack-dev-server --hot --port 3000 --open"
```

### 方式 2

1.修改`webpack.config.js`文件，module.exports 新增`devServer`节点如下：

```javascript
devServer: {
  hot: true,
  open: true,
  port: 3000
}
```

2.在头部引入`webpack`模块：

```javascript
var webpack = require('webpack');
```

3.在 module.exports `plugins`节点下新增：

```javascript
new webpack.HotModuleReplacementPlugin();
```

## 使用 webpack 打包 css 文件

1.运行`npm i style-loader css-loader --save-dev`

2.修改`webpack.config.js`这个配置文件：

```javascript
module: {
  // 用来配置第三方loader模块的
  rules: [
    // 文件的匹配规则
    { test: /\.css$/, use: ['style-loader', 'css-loader'] } //处理css文件的规则
  ];
}
```

3.注意：`use`表示使用哪些模块来处理`test`所匹配到的文件；`use`中相关 loader 模块的调用顺序是从后向前调用的；

## 使用 webpack 打包 less 文件

1.运行`npm i less-loader less -D`

2.修改`webpack.config.js`这个配置文件：

```javascript
{ test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
```

## 使用 webpack 打包 sass 文件

1.运行`npm i sass-loader node-sass --save-dev`

2.在`webpack.config.js`中添加处理 sass 文件的 loader 模块：

```javascript
{ test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] }
```

## 使用 webpack 处理 css 中的路径

默认情况下，webpack 无法 处理 CSS 文件中的 url 地址，不管是图片还是 字体库， 只要是 URL 地址，都处理不了

1.运行`npm i url-loader file-loader --save-dev`

2.在`webpack.config.js`中添加处理 url 路径的 loader 模块：

```javascript
{ test: /\.(png|jpg|gif)$/, use: 'url-loader' }
```

3.可以通过`limit`指定进行 base64 编码的图片大小；只有小于指定字节（byte）的图片才会进行 base64 编码：

```javascript
{ test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=43960' },
```

4.可以重命名

```javascript
{ test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=43960&name=[hash:8]-[name].[ext]' },
```

## 使用 babel 处理高级 JS 语法

1.运行`npm i babel-core babel-loader@7 babel-plugin-transform-runtime --save-dev`安装 babel 的相关 loader 包

2.运行`npm i babel-preset-env babel-preset-stage-0 --save-dev`安装 babel 转换的语法

3.在`webpack.config.js`中添加相关 loader 模块，其中需要注意的是，一定要把`node_modules`文件夹添加到排除项：

```javascript
{ test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }
```

4.在项目根目录中添加`.babelrc`文件，并修改这个配置文件如下：

```json
{
  "presets": ["env", "stage-0"],
  "plugins": ["transform-runtime"]
}
```

5.**注意：语法插件`babel-preset-es2015`可以更新为`babel-preset-env`，它包含了所有的 ES 相关的语法；**

## 相关文章

[babel-preset-env：你需要的唯一 Babel 插件](https://segmentfault.com/p/1210000008466178)
[Runtime transform 运行时编译 es6](https://segmentfault.com/a/1190000009065987)

## 注意

有时候使用`npm i node-sass -D`装不上，这时候，就必须使用 `cnpm i node-sass -D`

## 在普通页面中使用 render 函数渲染组件

## 在 webpack 中配置.vue 组件页面的解析

1.运行`npm i vue -S`将 vue 安装为运行依赖；

2.运行`npm i vue-loader vue-template-compiler -D`将解析转换 vue 的包安装为开发依赖；

3.运行`npm i style-loader css-loader -D`将解析转换 CSS 的包安装为开发依赖，因为.vue 文件中会写 CSS 样式；

4.在`webpack.config.js`中，添加如下`module`规则：

```javascript
module: {
  rules: [
    { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    { test: /\.vue$/, use: 'vue-loader' }
  ];
}
```

5.创建`App.js`组件页面：

```html
<template>
  <!-- 注意：在 .vue 的组件中，template 中必须有且只有唯一的根元素进行包裹，一般都用 div 当作唯一的根元素 -->
  <div>
    <h1>这是APP组件 - {{msg}}</h1>
    <h3>我是h3</h3>
  </div>
</template>
<script>
  // 注意：在 .vue 的组件中，通过 script 标签来定义组件的行为，需要使用 ES6 中提供的 export default 方式，导出一个vue实例对象

  export default {
    data() {
      return {
        msg: 'OK'
      };
    }
  };
</script>
<style scoped>
  h1 {
    color: red;
  }
</style>
```

6.创建`main.js`入口文件：

```javascript
// 导入 Vue 组件
import Vue from 'vue';

// 导入 App组件
import App from './components/App.vue';

// 创建一个 Vue 实例，使用 render 函数，渲染指定的组件
var vm = new Vue({
  el: '#app',
  // render: function(createElements) { // 在 webpack 中，如果想要通过 vue， 把一个组件放到页面中去展示，vm 实例中的 render 函数可以实现
  //   return createElements(App)
  // }
  render: c => c(App)
});
```

## 在使用 webpack 构建的 Vue 项目中使用模板对象？

1.在`webpack.config.js`中添加`resolve`属性：

```javascript
resolve: {
  alias: {
    'vue$': 'vue/dist/vue.js'
  }
}
```

## ES6 中语法使用总结

1.使用 `export default` 和 `export` 导出模块中的成员; 对应 ES5 中的 `module.exports` 和 `export`

```javascript
var info = {
  name: 'zs',
  age: 20
};

export default info;

/* export default {
  address: '北京'
} */

// 注意： export default 向外暴露的成员，可以使用任意的变量来接收
// 注意： 在一个模块中，export default 只允许向外暴露1次
// 注意： 在一个模块中，可以同时使用 export default 和 export 向外暴露成员

export var title = '小星星';
export var content = '哈哈哈';

// 注意： 使用 export 向外暴露的成员，只能使用 { } 的形式来接收，这种形式，叫做 【按需导出】
// 注意： export 可以向外暴露多个成员， 同时，如果某些成员，我们在 import 的时候，不需要，则可以 不在 {}  中定义
// 注意： 使用 export 导出的成员，必须严格按照 导出时候的名称，来使用  {}  按需接收；
// 注意： 使用 export 导出的成员，如果 就想 换个 名称来接收，可以使用 as 来起别名；
```

```javascript
import m1, { title as title123, content } from './test.js';
console.log(m1);
console.log(title123 + ' --- ' + content);
```

2.使用 `import ** from **` 和 `import '路径'` 还有 `import {a, b} from '模块标识'` 导入其他模块

3.使用箭头函数：`(a, b)=> { return a-b; }`

## 在 vue 组件页面中，集成 vue-router 路由模块

[vue-router 官网](https://router.vuejs.org/)

1.导入路由模块：

```javascript
import VueRouter from 'vue-router';
```

2.安装路由模块：

```javascript
Vue.use(VueRouter);
```

3.导入需要展示的组件

```javascript
import login from './components/account/login.vue';

import register from './components/account/register.vue';
```

4.创建路由对象:

```javascript
var router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/register', component: register }
  ]
});
```

5.将路由对象，挂载到 Vue 实例上

```javascript
var vm = new Vue({
  el: '#app',
  // render: c => { return c(App) }
  render(c) {
    return c(App);
  },
  router // 将路由对象，挂载到 Vue 实例上
});
```

6.改造 App.vue 组件，在 template 中，添加`router-link`和`router-view`

```html
<router-link to="/login">登录</router-link>
<router-link to="/register">注册</router-link>

<router-view></router-view>
```

## 组件中的 css 作用域问题

```html
<style lang="scss" scoped>
  /* 普通的 style 标签只支持 普通的 样式，如果想要启用 scss 或 less ，需要为 style 元素，设置 lang 属性 */
  // 只要 style 标签， 是在 .vue 组件中定义的，那么，推荐都为 style 开启 scoped 属性
  body {
    div {
      font-style: italic;
    }
  }
</style>
```

## 抽离路由为单独的模块

## 使用 饿了么的 MintUI 组件

[Github 仓储地址](https://github.com/ElemeFE/mint-ui)

[Mint-UI 官方文档](http://mint-ui.github.io/#!/zh-cn)

1.导入所有 MintUI 组件：

```javascript
import MintUI from 'mint-ui';
```

2.导入样式表：

```javascript
import 'mint-ui/lib/style.css';
```

3.在 vue 中使用 MintUI：

```javascript
Vue.use(MintUI);
```

4.使用的例子：

```html
<mt-button type="primary" size="large">primary</mt-button>
```

## 使用 MUI 组件

[官网首页](http://dev.dcloud.net.cn/mui/)

[文档地址](http://dev.dcloud.net.cn/mui/ui/)

## 使用 MUI 代码片段

> 注意： MUI 不同于 Mint-UI，MUI 只是开发出来的一套好用的代码片段，里面提供了配套的样式、配套的 HTML 代码段，类似于 Bootstrap； 而 Mint-UI，是真正的组件库，是使用 Vue 技术封装出来的 成套的组件，可以无缝的和 VUE 项目进行集成开发；
> 因此，从体验上来说， Mint-UI 体验更好，因为这是别人帮我们开发好的现成的 Vue 组件；
> 从体验上来说， MUI 和 Bootstrap 类似；
> 理论上，任何项目都可以使用 MUI 或 Bootstrap，但是，MInt-UI 只适用于 Vue 项目；

注意： MUI 并不能使用 npm 去下载，需要自己手动从 github 上，下载现成的包，自己解压出来，然后手动拷贝到项目中使用；

[官网首页](http://dev.dcloud.net.cn/mui/)

[文档地址](http://dev.dcloud.net.cn/mui/ui/)

1.导入 MUI 的样式表：

```javascript
import '../lib/mui/css/mui.min.css';
```

2.在`webpack.config.js`中添加新的 loader 规则：

```javascript
{ test: /\.(png|jpg|gif|ttf)$/, use: 'url-loader' }
```

3.根据官方提供的文档和 example，尝试使用相关的组件

## 将项目源码托管到 oschina 中

1.点击头像 -> 修改资料 -> SSH 公钥 [如何生成 SSH 公钥](http://git.mydoc.io/?t=154712)

2.创建自己的空仓储，使用 `git config --global user.name "用户名"` 和 `git config --global user.email ***@**.com` 来全局配置提交时用户的名称和邮箱

3.使用 `git init` 在本地初始化项目

4.使用 `README.md` 和 `.gitignore` 来创建项目的说明文件和忽略文件；

5.使用 `git add .` 将所有文件托管到 git 中

6.使用 `git commit -m "init project"` 将项目进行本地提交

7.使用 `git remote add origin 仓储地址`将本地项目和远程仓储连接，并使用 origin 最为远程仓储的别名

8.使用 `git push -u origin master` 将本地代码 push 到仓储中

## App.vue 组件的基本设置

1.头部的固定导航栏使用 `Mint-UI` 的 `Header` 组件；

2.底部的页签使用 `mui` 的 `tabbar`;

3.购物车的图标，使用 `icons-extra` 中的 `mui-icon-extra mui-icon-extra-cart`，同时，应该把其依赖的字体图标文件 `mui-icons-extra.ttf`，复制到 `fonts` 目录下！

4.将底部的页签，改造成 `router-link` 来实现单页面的切换；

5.Tab Bar 路由激活时候设置高亮的两种方式：

- 全局设置样式如下：

```css
.router-link-active {
  color: #007aff !important;
}
```

- 或者在 `new VueRouter` 的时候，通过 `linkActiveClass` 来指定高亮的类：

```javascript
// 创建路由对象
var router = new VueRouter({
  routes: [{ path: '/', redirect: '/home' }],
  linkActiveClass: 'mui-active'
});
```

## 实现 tabbar 页签不同组件页面的切换

1.将 tabbar 改造成 `router-link` 形式，并指定每个连接的 `to` 属性；

2.在入口文件中导入需要展示的组件，并创建路由对象：

```javascript
// 导入需要展示的组件
import Home from './components/home/home.vue';
import Member from './components/member/member.vue';
import Shopcar from './components/shopcar/shopcar.vue';
import Search from './components/search/search.vue';

// 创建路由对象
var router = new VueRouter({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home },
    { path: '/member', component: Member },
    { path: '/shopcar', component: Shopcar },
    { path: '/search', component: Search }
  ],
  linkActiveClass: 'mui-active'
});
```

## 使用 mt-swipe 轮播图组件

1.假数据

```json
lunbo: [
  "http://www.itcast.cn/images/slidead/BEIJING/2017440109442800.jpg",
  "http://www.itcast.cn/images/slidead/BEIJING/2017511009514700.jpg",
  "http://www.itcast.cn/images/slidead/BEIJING/2017421414422600.jpg"
];
```

2.引入轮播图组件

```html
<!-- Mint-UI 轮播图组件 -->
<div class="home-swipe">
  <mt-swipe :auto="4000">
    <mt-swipe-item v-for="(item, i) in lunbo" :key="i">
      <img :src="item" alt />
    </mt-swipe-item>
  </mt-swipe>
</div>
```

## 在`.vue`组件中使用`vue-resource`获取数据

1.运行`npm i vue-resource -S`安装模块

2.导入 vue-resource 组件

```javascript
import VueResource from 'vue-resource';
```

3.在 vue 中使用 vue-resource 组件

```javascript
Vue.use(VueResource);
```

## 使用 mui 的`tab-top-webview-main`完成分类滑动栏

### 兼容问题

1.和 App.vue 中的 `router-link` 身上的类名 `mui-tab-item` 存在兼容性问题，导致 tab 栏失效，可以把`mui-tab-item`改名为`mui-tab-item1`，并复制相关的类样式，来解决这个问题；

```css
.mui-bar-tab .mui-tab-item1.mui-active {
  color: #007aff;
}

.mui-bar-tab .mui-tab-item1 {
  display: table-cell;
  overflow: hidden;
  width: 1%;
  height: 50px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #929292;
}

.mui-bar-tab .mui-tab-item1 .mui-icon {
  top: 3px;
  width: 24px;
  height: 24px;
  padding-top: 0;
  padding-bottom: 0;
}

.mui-bar-tab .mui-tab-item1 .mui-icon ~ .mui-tab-label {
  font-size: 11px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

2.`tab-top-webview-main`组件第一次显示到页面中的时候，无法被滑动的解决方案：

- 先导入 mui 的 JS 文件:

```javascript
import mui from '../../../lib/mui/js/mui.min.js';
```

- 在 组件的 `mounted` 事件钩子中，注册 mui 的滚动事件：

```javascript
mounted() {
  // 需要在组件的 mounted 事件钩子中，注册 mui 的 scroll 滚动事件
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });
}
```

3.滑动的时候报警告：`Unable to preventDefault inside passive event listener due to target being treated as passive. See https://www.chromestatus.com/features/5093566007214080`

```javascript
解决方法，可以加上* { touch-action: pan-y; } 这句样式去掉。
```

原因：（是 chrome 为了提高页面的滑动流畅度而新折腾出来的一个东西）
<http://www.cnblogs.com/pearl07/p/6589114.html>
<https://developer.mozilla.org/zh-CN/docs/Web/CSS/touch-action>

## 移除严格模式

[babel-plugin-transform-remove-strict-mode](https://github.com/genify/babel-plugin-transform-remove-strict-mode)

```shell
npm install babel-plugin-transform-remove-strict-mode
```

.babelrc

```json
{
  "plugins": ["transform-remove-strict-mode"]
}
```

## [vue-preview](https://github.com/LS1231/vue-preview)

一个 Vue 集成 PhotoSwipe 图片预览插件

## 开启 Apache 的 gzip 压缩

要让 apache 支持 gzip 功能，要用到 deflate_Module 和 headers_Module。打开 apache 的配置文件 httpd.conf，大约在 105 行左右，找到以下两行内容：（这两行不是连续在一起的）

```conf
#LoadModule deflate_module modules/mod_deflate.so
#LoadModule headers_module modules/mod_headers.so
```

然后将其前面的“#”注释删掉，表示开启 gzip 压缩功能。开启以后还需要进行相关配置。在 httpd.conf 文件的最后添加以下内容即可：

```conf
<IfModule deflate_module>
    #必须的，就像一个开关一样，告诉apache对传输到浏览器的内容进行压缩
    SetOutputFilter DEFLATE
    DeflateCompressionLevel 9
</IfModule>
```

最少需要加上以上内容，才可以生 gzip 功能生效。由于没有做其它的额外配置，所以其它相关的配置均使用 Apache 的默认设置。这里说一下参数“DeflateCompressionLevel”，它表示压缩级别，值从 1 到 9，值越大表示压缩的越厉害。

## 使用 ngrok 将本机映射为一个外网的 Web 服务器

1. 双击快速运行 ngrok.exe 应用程序

2. 随机生成三级域名(自动防止重名问题)，其中，80 代表要向外暴露的端口号：

```shell
# secure public URL for port 80 web server
ngrok http 80

# 或者人为指定三级域名(存在重名问题)
ngrok http -subdomain=[inconshreveable] [80]
```

注意：由于默认使用的美国的服务器进行中间转接，所以访问速度炒鸡慢，访问时可启用 FQ 软件，提高网页打开速度！

## vuex 概念

vuex 是 Vue 配套的 公共数据管理工具，它可以把一些共享的数据，保存到 vuex 中，方便 整个程序中的任何组件直接获取或修改我们的公共数据；
