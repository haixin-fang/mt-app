// 提供了一个用户鉴权的框架，并把鉴权得到的用户身份供后续的业务逻辑来使用
import passport from 'koa-passport'
// 提供本地鉴权的代码框架
import LocalStrategy from 'passport-local'

import UserModel from '../../dbs/models/users'
// 为passport新增一个可用的策略
// 鉴权的作用有两个
// 1、鉴权失败可用拒绝用户访问
// 2、鉴权成功会把用户记录到context
// passport支持同时使用多个策略，它会从头开始尝试各个策略，直到
// 有一个策略做出处理或已尝试所有策略为止

// passport默认会使用session


// 会自动从请求中获取username,password两个字段，然后提供给用户自定义的函数进行鉴权
passport.use(new LocalStrategy(async function(username, password, done){
  let where = {
    username
  }
  let result = await UserModel.findOne(where)
  if(result != null){
    if(result.password === password){
      return done(null, result)
    }else{
      return done(null, false, '密码错误')
    }
  }else{
    return done(null, false, '用户不存在')
  }
}))

passport.serializeUser(function(user,done){
  // 是将信息存入到session
  // ctx.login(id) 函数调用时触发，其中的参数会传给serializeUser函数作为第一个参数
  done(null, user)
})
passport.deserializeUser(function(user,done){
  // 将信息从session中取出来
  return done(null,user)
})

export default passport
