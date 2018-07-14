const path = require("path");
const captchapng = require("captchapng");
const MongoClient = require('mongodb').MongoClient;


// const
/**
 * 暴露了一个获取登录页面的方法，给路由调用
 */
exports.getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/login.html"));
};

/**
 * 暴露出去的获取图片验证码的方法
 */
//获取图片
exports.getImageVcode = (req, res) => {
    //1.利用一个第三方的包生成 一张带数字的图片
    const random = parseInt(Math.random() * 9000 + 1000);
    req.session.vcode = random;
    var p = new captchapng(80, 30, random); // width,height,numeric captcha
    p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    var imgbase64 = new Buffer(img, "base64");
    res.writeHead(200, {
        "Content-Type": "image/png"
    });


    //3.返回，并且告知是一张图片
    res.end(imgbase64);
};

//跳转到注册页面
exports.getRegisterPage = (req, res) => {

    // res.send('你好,这里是注册页面');
    res.sendFile(path.join(__dirname, "../views/register.html"))
}


//注册验证
exports.register = (req, res) => {
    const result = {status: 0, message: '注册成功'}

    // console.log('验证登录成功');
    const params = req.body;
    // console.log(params);
    const {username, password} = params;
    // console.log('这里是检测页面');
    //连接数据库
    const url = 'mongodb://localhost:27017';
// Database Name
    const dbName = 'manage';

// Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
        // console.log("数据库连接成功");
        const db = client.db(dbName);
        const collection = db.collection('userInfo');
        //查询数据看是否含有用户名
        collection.find({username}).toArray(function (err, docs) {
            // console.log("查找是否含有某个数据");
            if (err) {
                console.log(err);
                // console.log('查询数据失败');
                result.status = 1;
                result.message = "链接数据库失败";
            } else {
                // console.log(docs)
                if (docs.length == 0) {
                    // console.log('没有数据');
                    // Insert some documents
                    collection.insertMany([{username, password}], function (err, result1) {
                        if (err) {
                            console.log(err);
                        } else {
                            // res.send(result);
                            res.json(result)

                        }
                        client.close();
                    });
                } else {
                    //含有数据
                    result.status = 2;
                    result.message = "已经含有该数据";
                    res.json(result)
                    // console.log('含有该数据 ');
                }

            }
            client.close();

        });


    });


}
//登录验证
exports.getLogin=(req,res)=>{
    const result={status:0,message:'登录成功'}
    // const ress=req.body
    // console.log(ress);
    //根据传过来的数据,和数据库中的数据进行比较
    //先对验证码进行比较
    // console.log(req.session.vcode);
    const {username,password,vcode}=req.body;
        if(req.session.vcode==vcode){
        //验证码正确 查询数据库

        const MongoClient = require('mongodb').MongoClient;

        const url = 'mongodb://localhost:27017';
        const dbName = 'manage';
        MongoClient.connect(url, function(err, client) {
            console.log("数据库连接成功");

            const db = client.db(dbName);
            const collection = db.collection('userInfo');
            // Find some documents
            collection.find({username,password}).toArray(function(err, docs) {
                console.log(docs);
                if(docs.length == 0){
                    result.status=2;
                    result.message="账户或密码错误";
                    res.send(result);
                }else {
                    res.send(result);
                }
            });


            client.close();
        });
    }else {
        result.status=1;
        result.message="验证码错误";
            res.send(result);
        //验证码错误
    }
}