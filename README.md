# weex-dingtalk 文档

weex-dingtalk是钉钉开放平台提供在weex环境下使用的SDK，其中实现的功能与H5的Dingtalk.js大同小异。

## 安装

    tnpm install weex-dingtalk --save

建议使用 `--save` 将版本信息存储起来，方便后续升级维护。

## 使用

且看例子：（weex-entry.js）

    import Hello from './Hello.vue';
    Hello.el = '#app';
    new Vue(Hello);

业务Hello.vue：

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
                console.log('icepy');
            },
            methods: {
                getClick: function(){
                    dingtalk.ready(function(error,respon){
                        if (error){
                            modal.toast({
                                message: JSON.stringify(error),
                                duration: 0.3
                            });
                            return;
                        }
                        for (var key in dingtalk.apis){
                            console.log('icepy ---', key);
                            console.log('icepy ---', dingtalk.apis[key]);
                        }
                        var dd = dingtalk.apis;
                        dd.biz.util.openLink({
                            url: 'https://github.com/icepy'
                        })
                        console.log(dingtalk.apis);
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

weex-dingtalk只提供了少许api来完成钉钉客户端js-api的使用，有几点是需要注意的：

* 调用js-api时需要写在dingtalk.ready方法中
* 如果你有签名的需要，可以调用dingtalk.config，将你的签名对象传入，整个应用的周期内，你应该只可以调用一次config方法
* ready的callback采用了Node.js的方式来提供信息：

        dingtalk.ready(function(error,result){
            if (error){
                // 如果error不为null，则说明权限校验失败
            } else {
                // 成功
            }
        })

* 如果你没有调用config方法，并且传入签名对象，ready方法不会去发起签名
* 正常的js-api可以通过dingtalk.apis来获取


## apis 描述

* config （Function | 参数 Object | 返回值 void） 配置签名对象
* ready （Function | 参数 Function Callback | 返回值 void） 使用js-api必须写在ready callback中
* ready callback （参数 error | 参数 result） ，当参数error为null时表明校验成功，如果error有值表明校验失败
* error （Function | 参数 Object ）权限校验失败时
* apis （Object）必须在ready方法中使用，钉钉 js-api 列表（与H5一致）

其他具体的API请参考[https://open-doc.dingtalk.com/doc2/detail?spm=0.0.0.0.O1cH5b&treeId=171&articleId=104906&docType=1](https://open-doc.dingtalk.com/doc2/detail?spm=0.0.0.0.O1cH5b&treeId=171&articleId=104906&docType=1)
