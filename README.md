# weex-dingtalk 文档

weex-dingtalk是钉钉开放平台提供在weex环境下使用的SDK，其中实现的功能与H5的Dingtalk.js大同小异。

### 安装

    npm install weex-dingtalk --save

建议使用 `--save` 将版本信息存储起来，方便后续升级维护。

### 使用

且看例子：（weex-entry.js）

```JavaScript
  import Hello from './Hello.vue';
  Hello.el = '#app';
  new Vue(Hello);
```
业务Hello.vue：

```Vue
    <template>
        <div class="wrapper">
            <text class="title">Hello icepy</text>
            <text class="subtitle" v-on:click="getClick">{{ link }}</text>
        </div>
    </template>
    <script>

        var stream = weex.requireModule('stream');
        var modal = weex.requireModule('modal');
        var dingtalk = require('weex-dingtalk');

        export default {
            name: 'hello',
            data: function(){
                return {
                    link: 'DingTalk'
                }
            },
            mounted: function(){
              dingtalk.ready(function(){
                const dd = dingtalk.apis;
                // 设置导航
                dd.biz.navigation.setTitle({
                    title: 'icepy'
                });
              });
            },
            methods: {
                getClick: function(){
                  modal.toast({
                    message: 'Hello World ICEPY !!!',
                    duration: 2
                  });
                }
            }
        }
    </script>
    <style>
      .wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 750px;
        height: 1000px;
        background-color: #333377;
      }
      .title {
        font-size: 60px;
        color: #505050;
        text-align: center;
      }
      .subtitle {
        display: block;
        font-size: 30px;
        color: #AAAAAA;
        xxxx: static;
        text-align: center;
        margin-top: 20px;
      }
    </style>
```

weex-dingtalk只提供了少许api来完成钉钉客户端js-api的使用，有几点是需要注意的：

* 调用js-api时需要写在dingtalk.ready方法中
* 如果你有签名的需要，可以调用dingtalk.config，将你的签名对象传入，整个应用的周期内，你应该只可以调用一次config方法
* 如果你没有调用config方法，并且传入签名对象，ready方法不会去发起签名
* 你可以使用error注册一个error函数，与H5保持一致
* 正常的js-api可以通过dingtalk.apis来获取

### apis 描述

* config （Function | 参数 Object | 返回值 void） 配置签名对象
* ready （Function | 参数 Function Callback | 返回值 void） 使用js-api必须写在ready callback中
* error （Function | 参数 Object ）权限校验失败时
* apis （Object）必须在ready方法中使用，钉钉 js-api 列表（与H5一致）
* on 注册一个事件（与H5中的addEventListener保持一致）
* off 注销一个事件（与H5中的removeEventListener保持一致）

其他API的具体使用方法请参考 [https://open-doc.dingtalk.com/doc2/detail?spm=0.0.0.0.O1cH5b&treeId=171&articleId=104906&docType=1](https://open-doc.dingtalk.com/doc2/detail?spm=0.0.0.0.O1cH5b&treeId=171&articleId=104906&docType=1)
