import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users.js'
import Passport from './utils/passport'
import Email from '../dbs/config'
import axios from './utils/axios'

let router = new Router({
  prefix: '/users'
})
// 生成redis客户端
let Store = new Redis().client
//验证用户注册的信息
router.post('/signup', async (ctx, next) => {
  let {username, password, email, code} = ctx.request.body
  if(code){
    const saveCode = await Store.hget(`nodemail:${username}`,'code')
    //设置过去时间 如该验证码必须在一分钟内使用，不然就无效
    const saveExpire = await Store.hget(`nodemail:${username}`,'expire')
    // 验证用户提交上来的验证码与存储的验证码是否相等
    if(code === saveCode){
      // 验证该验证码是否过期 (savaExpire存储的时间是发送完验证码的那个时间点后的一分钟)
      // 而现在的时间已过去了一分钟（>0)
      if(new Date().getTime() - saveExpire > 0){
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    }else{
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  }else{
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }
  // 验证码已进行判断，开始验证用户名和密码，用户名是否已被注册
  let user = await User.find({
    username
  })
  // 用户名已被注册
  if(user.length){
    ctx.body = {
      code: -1,
      msg: '用户名已被注册'
    }
    return false //结束该异步操作，不往下执行
  }
  // 用户名都已验证通过，则执行写库操作,返回值是验证是否成功
  let nuser = await User.create({
    username,
    password,
    email
  })
  console.log('nuser，写库操作的返回值'+nuser)
  if(nuser){
    // 自动登录,就可以在必须要登录的页面进行操作了，并且每个页面都可以通过反序列化
    // 获取到user信息
    //let res = await axios.post('/users/signin', {
    //  username,
    //  password
    //})
    //if(res.data && res.data.code==0){
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: username
      }
    //}else{
    //  ctx.body = {
    //    code: -1,
    //    msg: 'error'
    //  }
    //}
  }else{
    //写库失败
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

router.post('/signin', async (ctx, next) => {
  // 执行passport.authenticate会自动调用策略函数，进行鉴权，并把post上传的用户名密码传上来
  // 进行验证
  return Passport.authenticate('local', function(err, user, info, status){
    if(err){
      ctx.body = {
        code: -1,
        msg: err
      }
    }else{
      if(user){
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        // ctx.login({}) 函数调用时触发，其中的参数会传给serializeUser函数作为第一个参数
        return ctx.login(user)
      }else{
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

// 验证码验证
router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username
  // 用户在点击发送验证码时，如果redis存在该用户，说明该用法已经发了验证码
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
   // 验证时redis中没有saveExpire，有则说明在1分钟之内连续操作
  if(saveExpire && new Date().getTime()-saveExpire>0 && Date().getTime()-saveExpire<200){
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟1次'
    }
    return false
  }
  // 定义后台管理员（发送对象）的信息
  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false, //true监听465端口，false监听其他端口
    //配置的管理员的信息，如管理员的邮箱，如第三方授权信息
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  // 配置发送验证码相关信息（用户）
  let ko = {
    code: Email.smtp.code(), //向用户邮箱发送的验证码
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username //给你个注册用户名发送验证码，发送验证码要有名字
  }
  // 邮件中要显示什么内容，这个也要定义
  let mailOption = {
    from: `"认证邮件"<${Email.smtp.user}>`,  //告诉收件方，谁给收件方发的
    to: ko.email, //接收方
    subject: '《高仿美团网全栈实战》 注册验证码 ',  //邮件主题
    html: `或许前路永夜，即便如此我也要前进，因为星光即便微弱也会为我照亮前路 您的邀请码${ko.code}`
  }
  // 发送
  let res = await transporter.sendMail(mailOption, (error, info) => {
    if(error){
      return console.log('error')
    }else{
      // 验证码发送成功了，则存储验证码等相关信息，等用户点击注册时，提交的验证码与
      // 在redis保存的验证码进行验证
      // hmset 可以在redis存储多个键值对，获取对应的一个键值对，hget('key')
      // HMSET myhash field1 "Hello" field2 "World"
      // HGET myhash field1
      Store.hmset(`nodemail:${username}`,'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期为1个小时'
  }
})

router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  if(!ctx.isAuthenticated()){
    ctx.body = {
      code: 0
    }
  }else{
    ctx.body = {
      code: -1
    }
  }
})

router.get('/getUser', async (ctx, next) => {
  if(ctx.isAuthenticated()){
    console.log('ctx.state.user'+'  '+ctx.state.user.username+'  '+ctx.session.passport.user.username)
    let {username, email} = ctx.session.passport.user
    ctx.body = {
      code: 0,
      user: username,
      email
    }
  }else{
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

export default router
