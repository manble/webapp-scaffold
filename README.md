README
===========================
(vue || react) + scss + express + ejs + gulp + webpack + pm2 webapp 脚手架

#### 用法：
```
1. git clone https://github.com/manble/webapp-scaffold.git
2. cd webapp
3. yarn install
4. gulp dev (gulp dev --prod)
5. http://127.0.0.1:8181
```

#### gulp三模式
```
gulp dev 开发模式
启动本地服务，监听scss js image变化自动刷新浏览器

gulp preview
上线前验证

gulp production
css js image上传cdn，并替换本地路径为cdn版本号文件路径
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
    partials/
        layout.ejs

dependencies/ 
    conf.js //配置文件
```