<template>
  <div></div>
</template>

<script type="text/ecmascript-6">
  export default {
    layout: 'blank',
    middleware: async (ctx) => {
      let {status, data} = await ctx.$axios.get('/users/exit')
      if(status === 200){
        if(data && data.code === 0){
          window.location.href = '/'
        }else{
          alert('退出失败')
          window.location.href = '/'
        }
      }else{
        alert('稍后再试')
        window.location.href = '/'
      }
    }
  }
</script>

<style lang="scss"></style>
