README
===========================
#### 简介
webapp模版，简单的，可直接部署到远端服务的node服务脚手架，采用(vue || react) + scss + express + ejs + gulp + webpack + pm2 webapp。

1. 支持自动打开默认浏览器。
2. 可以监听文件变化自动构建并实时更新浏览器。
3. 支持图标base64和sprite两种格式。
4. 支持px转rem。
5. 支持自动上传静态资源到cdn。
6. 支持本地数据接口mock。
7. 支持eslint开启和关闭。
8. 支持生成html文件。


#### 用法：
```
1. git clone https://github.com/manble/webapp-scaffold.git webapp
2. cd webapp
3. npm install
4. gulp dev
5. http://127.0.0.1:8181
```

#### gulp三模式
```
gulp dev 开发模式
gulp dev --open
gulp dev --open=dev.example.com
gulp dev --minify
gulp dev --eslint=off 关闭时时eslint检测
启动本地服务，监听scss js image变化自动刷新浏览器

gulp preview
上线前验证

gulp production --ftp
css js image上传cdn，并替换本地路径为cdn版本号文件路径

gulp production --ftp --ejs2html
css js image上传cdn，替换本地路径为cdn版本号文件路径, 同时生成html文件
```

#### development模式下数据接口mock
```
1. 在mocks/ 目录下配置 [name].mock.json文件，详情如下:
{
    "mocks": [
        {
            "state": "on",
            "method": "get",
            "path": "/search/repositories",
            "response": "/mocks/example.js"
        },
        {
            "state": "off",
            "method": "post",
            "path": "/api/example",
            "response": "/mocks/example.js"
        }
    ]
}
2. 配置相应的js文件，并通过mockjs生成相应的数据。
3. 通过 ismock=1参数启用，http://127.0.0.1:8181?ismock=1。
4. 当mock.json文件中的state为on，且path命中的时候，本地数据模块数据生效。

```
#### app-config.js
```
1. px2rem  开启关闭px转rem。
2. origin。
    1). client，浏览器端数据请求域。
    2). server，node端数据请求域。

```

#### 启动web前端服务
```
1. ssh manble@127.0.0.1 -p 12345
2. cd /app
3. sh release.sh
启动服务
sh release.sh(sh release.sh test)创建当前日期(或参数test)目录的webapp服务。
```

#### 文件路径说明
```
image: (/images目录绝对路径)
    <img src="/images/example.png" alt="">
    <img src="/images/base64/qq.png" alt="">
    background-image: url('/images/example.png');

ejs: 绝对路径
    <% layout('/layouts/layout.ejs') -%>
    <% block('page_css', '/styles/page/index.css') -%>
    <% block('page_js', '/scripts/page/index.js') -%>

scss：(scss/目录下路径)
    @import "includes/sprites/icon.scss";

js:(scripts/目录下路径)
    import request from 'utils/request';
    import 'includes/pages/index/basic.scss'; 

```

#### 配置：
```
webapp/dependencies/conf.js
module.exports = {
    cdn: 'http://127.0.0.1:8080/webapp', //前端静态资源上传cdn，替换本地相对路径
    ftp: {
        connect: {
            host: "127.0.0.1",
            port: 21,
            user: "manble",
            password: "123456"
        },
        remoteDir: '/webapp/' // 上传静态资源目标目录(ftp://127.0.0.1:21/webapp/)
    }
}
```

#### 目录结构
```
public/ 
    images/
        base64
            qq.png ==> data:image/png;base64,balabalaxxxxxxx
        sprites/
            icon/
                qq.png ==> .icon-qq{}
                qq-hover.png ==> .icon-qq:hover{}
                test/
                    qq.png ==> .icon-test-qq {}
    scss/
        includes/
            sprites/ 合并icon后自动生成
            pages/
                index/
                    basic.scss
            tools/
                rem.scss
        pages/ 页面文件入口
            index.scss
            common.scss 通用文件
    scripts/
        components/
        libs/
        pages/ 页面文件入口
            index.js
        models/
        utils/
            observer.js
            dateTool.js
routes/
    api/
    pages/
        index.js
    entry.js

views/
    pages/
        index.ejs
        error/
            404.ejs
            500.ejs
    layout/
        layout.ejs
models/
utils/
mocks/ 
dependencies/ 
    conf.js //配置文件
```