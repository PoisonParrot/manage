var express = require('express');
var app = express();
const path = require('path');
const session = require('express-session')
//使用post时的中间键
const bodyParser = require('body-parser')

//处理静态资源
app.use(express.static(path.join(__dirname, "statics")))
// 使用post时的中间键
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


//设置session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60000 }
}))

//集成路由   当路由名字为account时调到相应的目录
const accountRouter = require(path.join(__dirname, "./routers/accountRouter.js"))
const studentmanager = require(path.join(__dirname, "./routers/studentmanager.js"))
app.use('/account', accountRouter)
app.use('/student', studentmanager)

// app.get('/login', function (req, res) {
//     res.send('登录页面');
// });


//服务器监听
app.listen(3000, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("服务器开启成功");
    }
});