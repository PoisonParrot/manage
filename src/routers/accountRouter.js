const express = require('express');
const router = express.Router();
const path = require('path');
//生成验证码的第三方包
// const captchapng = require("captchapng");

const accountUrl = require(path.join(__dirname, '../controllers/accountController.js'))
// console.log(111111111111111111111111);
// console.log(accountUrl.getLoginPage);
//获取登录页面
router.get('/login', accountUrl.getLoginPage)
//获取验证码
router.get('/vcode',accountUrl.getImageVcode)
//获取注册页面
router.get('/register',accountUrl.getRegisterPage)
//获取注册验证
router.post('/register',accountUrl.register)
//获取登录验证
router.post('/login', accountUrl.getLogin)



//暴露路由模块
module.exports = router;
