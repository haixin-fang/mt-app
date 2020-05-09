<template>
  <div class="page-login">
    <div class="login-header">
      <a
        href="/"
        class="logo"/>
    </div>
    <div class="login-panel">
      <div class="banner">
        <img
          src="//s0.meituan.net/bs/file/?f=fe-sso-fs:build/page/static/banner/www.jpg"
          width="480"
          height="370"
          alt="美团网">
      </div>
      <div class="form">
        <h4
          v-if="error"
          class="tips"><i/>{{ error }}</h4>
        <p><span>账号登录</span></p>
        <el-input
          v-model="username"
          prefix-icon="profile"/>
        <el-input
          v-model="password"
          prefix-icon="password"
          type="password"/>
        <div class="foot">
          <el-checkbox v-model="checked">7天内自动登录</el-checkbox>
          <b>忘记密码？</b>
        </div>
        <el-button
          class="btn-login"
          type="success"
          size="mini"
          @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import cryptoJS from 'crypto-js'
  export default {
    layout: 'blank',
    data(){
      return {
        checked: '',
        username: '',
        password: '',
        error: ''
      }
    },
    methods: {
      login(){
        let self = this
        self.$axios.post('/users/signin', {
          username: encodeURIComponent(self.username),
          password: cryptoJS.MD5(self.password).toString()
        }).then(({status, data}) => {
          console.log(status)
          if(status === 200){
            console.log(status, data)
            if(data && data.code === 0){
              alert('登录成功')
              window.location.href = '/'
            }
          }else{
            console.log(status,code)
            self.error = '登录失败，请稍后重试'
          }
          setTimeout(function(){
            self.error = ''
          }, 2000)
        })

      }
    }
  }
</script>

<style lang="scss">
  @import '@/assets/css/login/index.scss'
</style>
