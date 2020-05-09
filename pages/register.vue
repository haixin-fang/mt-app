<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a
          href="/"
          class="site-logo"></a>
        <span class="login">
          <em class="bold">已有美团账号</em>
          <a href="/login">
            <el-button
              type="primary"
              size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item
          label="昵称"
          prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email">
          <el-input v-model="ruleForm.email"/>
          <el-button
            size="mini"
            round
            @click="sendMsg">发送验证码</el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="code">
          <el-input
            v-model="ruleForm.code"
            maxlength="4"/>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="pwd">
          <el-input
            v-model="ruleForm.pwd"
            type="password"/>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="cpwd">
          <el-input
            v-model="ruleForm.cpwd"
            type="password"/>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="register">同意以下协议并注册</el-button>
          <div class="error">{{ error }}</div>
        </el-form-item>
        <el-form-item>
          <div class="term">
            <a
              class="f1"
              href="https://rules-center.meituan.com/rules-detail/4"
              target="_blank">《美团点评用户服务协议》</a>
            <a
              class="f1"
              href="https://rules-center.meituan.com/rules-detail/2"
              target="_blank">《美团点评隐私政策》</a>
          </div>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import cryptoJS from 'crypto-js'
  export default {
    layout: 'blank',
    data(){
      return {
        statusMsg: '',
        error: '',
        ruleForm:{
          name:'',
          code:'',
          pwd:'',
          cpwd:'',
          email:''
        },
        rules:{
          name: [{
            required: true,
            type: 'string',
            message: '请输入昵称',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            type: 'email',
            message: '请输入邮箱',
            trigger: 'blur'
          }],
          pwd: [{
            required: true,
            message: '创建密码',
            trigger: 'blur'
          }],
          cpwd: [{
            required: true,
            message: '确认密码',
            trigger: 'blur'
          }, {
            validator: (rule,value,callback) => {
              if(value == ''){
                callback(new Error('请再次输入密码'))
              }else if(value !== this.ruleForm.pwd){
                callback(new Error('两次输入的密码不一样'))
              }else{
                callback()
              }
            },
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      sendMsg(){
        const self = this
        let namePass
        let emailPass
        if(self.timerid){
          return false
        }
        self.$refs['ruleForm'].validateField('name', (valid) => {
          // valid有值代表没有通过昵称验证
          namePass = valid
        })
        self.statusMsg = ''
        if(namePass){
          return false
        }
        self.$refs['ruleForm'].validateField('email', (valid) => {
          emailPass = valid
        })
        if(!namePass && !emailPass){
          console.log(111)
          self.$axios.post('/users/verify', {
            username: encodeURIComponent(self.ruleForm.name), //axios发送数据要对字符串进行编码
            email: self.ruleForm.email
          }).then(({status, data})=> {
            console.log(status)
            console.log(data)
            if(status === 200 && data && data.code === 0){
              let count = 60
              self.statusMsg = `验证码已发送,剩余${count--}秒`
              self.timerid = setInterval(function(){
                self.statusMsg = `验证码已发送,剩余${count--}秒`
                if(count == 0){
                  self.statusMsg = ''
                  clearInterval(self.timerid)
                }
              }, 1000)
            }else{
              self.statusMsg = data.msg
            }
          })
        }
      },
      register(){
        let self = this
        self.$refs['ruleForm'].validate((valid) => {
          console.log('valid'+'valid')
          if(valid){
            self.$axios.post('/users/signup', {
              username: window.encodeURIComponent(self.ruleForm.name),
              password: cryptoJS.MD5(self.ruleForm.pwd).toString(),
              code: self.ruleForm.code,
              email: self.ruleForm.email
            }).then(({status, data}) => {
              console.log('8888')
              if(status === 200){
                if(data && data.code === 0){
                  console.log('注册'+data)
                  location.href = '/login'
                }
              }else{
                self.error = '服务端错误，请稍后在试'
              }
              setTimeout(function(){
                self.error = ''
              }, 2000)
            })
          }
        })
      }
    }
    // 1619701550@qq.com
  }
</script>

<style lang="scss">
  @import '@/assets/css/register/index.scss'
</style>
