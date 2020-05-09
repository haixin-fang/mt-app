import Router from 'koa-router'
import axios from './utils/axios.js'
import Province from '../dbs/models/province'

let router = new Router({
  prefix: '/categroy'
})

router.get('/crumbs', async (ctx, next) => {
  let {status, data: {types, areas}} = await axios.get('http://cp-tools.cn/categroy/crumbs', {
    params: {
      city: ctx.query.city.replace('市', '')
    }
  })
  ctx.body = {
    types: status===200?types:[],
    areas: status===200?areas:[]
  }
})


export default router
