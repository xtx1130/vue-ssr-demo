## vue-ssr-demo

> 这是一个用于测试vue ssr 的仓库，代码可以直接拉下来运行,由于是测试仓库，无lint和testcase，不过其中纯js代码遵循standard宽松规范

### 安装
```shell
$ git clone git@github.com:xtx1130/vue-ssr-demo.git
$ cd vue-ssr-demo
$ npm install
```

### 运行
```shell
$ npm run build
```
在webpack打包完之后会启动服务器，页面请访问：http://localhost:8011  
进入页面后请先点击播放按钮，让视频播放，然后可以上下滚动页面，视频会根据页面的滚动进行切换，视频播放完成后会自动切换到下一个视频

### 技术栈
- node: koa
- js: vue
- cli&ci: webpack