README
===========================
vue + scss + express + ejs + gulp + webpack + pm2 webapp scaffold

####用法：
```
1. git clone https://github.com/manble/webapp-scaffold.git
2. cd webapp
3. npm install
4. gulp dev (gulp preview)
5. http://127.0.0.1:8080
```

####配置：
```
webapp/dependencies/conf.js
module.exports = {
    domain: 'http://example.com',
    testDomain: 'http://127.0.0.1:8080',
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

#### gulp三模式
```
gulp dev 开发模式
启动本地服务，监听scss js image变化自动刷新浏览器

gulp preview 压缩模式
压缩css js， 重启本地服务，上线前验证

gulp release 静态资源上传cdn
css js image上传cdn，并替换本地路径为cdn代hash值的路径
```

####启动远程服务器web前端服务
```
1. ssh manble@127.0.0.1 -p 12345
2. git clone https://example.com/manble/webapp.git webapp
3. cd webapp
4. npm install
5. cd ..
6. rz release.sh

启动服务
sh release.sh(sh release.sh test)创建当前日期(或参数test)目录的webapp服务。
```

####目录结构
```
public/
    images/
        sprites/ 存放将合并sprite的小icon
            icon/
                test/
                    qq.png ==> .icon-test-qq {}
                qq.png ==> .icon-qq{}
                qq-hover.png ==> .icon-qq:hover{}
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
            common.js
        tasks/ 任务列表
            pages/
                index/
                    index.js
            taskManager.js
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