/**
 * 重写路由
 * app.get 是在用户访问当前页面的时候，展示的数据
 * app.post 是用户操作
 * render 是渲染模板函数
 * @param app
 */
/**
 * crypto 是 Node.js 的一个核心模块，功能是加密并生成各种散列，使用它之前
 * 首先要声明 var crypto = require('crypto')。我们代码中使用它计算了密码的散列值。
 * user.js则实现如何从数据库中存和取用户名和密码。
 */
var crypto = require('crypto')
    , User = require('../models/user');


module.exports = function(app){
    //index
    app.get('/', function(req, res){
        res.render('index', {
            title: '首页'
        })
    });
//    req
    app.get('/reg', function(req, res){
           res.render('reg', {
               title:'注册',
               user: req.session.user,
               success: req.flash('success').toString(),
               error: req.flash('error').toString()
           })
    });
    app.post('/reg', function(req,res){
        if(req.body['password-repeat'] != req.body['password']){
            req.flash('error','两次输入的口令不一致');
            return res.redirect('/reg');
        }
        //密码加密
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');
        //传参给user模块
        var newUser = new User({
            name: req.body.username,
            password: password
        });
        //查询数据库存在此用户名
        User.get(newUser.name, function(err, user){
            if(user){
                err = '用户已存在';
            }
            if(err){
                req.flash('error', err);
                return res.redirect('/reg');
            }
            newUser.save(function(err){
                if(err){
                    req.flash('error',err);
                    return res.redirect('/reg');
                }
                //session里储存用户名
                req.session.user = newUser;
                req.flash('success','注册成功');
                res.redirect('/');
            });
        });
    });
//  login
    app.get('/login',function(req,res){
        res.render('login', { title: '登录' });
    });
    app.post('/login',function(req,res){
    });
//  logout
    app.get('/logout',function(req,res){

    });
//  post
    app.get('/post',function(req,res){
        res.render('post', { title: '发表' });
    });
    app.post('/post',function(req,res){

    });
}