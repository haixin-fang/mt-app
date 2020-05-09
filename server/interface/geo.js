import Router from 'koa-router'
import axios from './utils/axios.js'
import Province from '../dbs/models/province'
import City from '../dbs/models/city'
let router = new Router({
  prefix: '/geo'
})

router.get('/province', async (ctx, next) => {
  //const province = await Province.find()
  //ctx.body = {
  //  province: province.map(item => {
  //    return {
  //      id:item.id,
  //      name: item.value
  //    }
  //  })
  //}
  const {status, data: {province}} = await axios.get('http://cp-tools.cn/geo/province')
  if(status === 200){
    ctx.body = {
      province: province||[]
    }
  }
})
router.get('/province/:id', async (ctx, next) => {
  //const city = await City.findOne({id: ctx.params.id})
  //ctx.body = {
  //  code: 0,
  //  city: city.value.map(item => {
  //    return {
  //      province: item.province, name: item.name, id: item.id
  //    }
  //  })
  //}
  const {status, data: {city}} = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}`)
  if(status === 200){
    ctx.body = {
      city
    }
  }else{
    ctx.body = []
  }
})

router.get('/city', async (ctx, next) => {
  //let city = []
  //let result = await City.find()
  //result.forEach(item => {
  //  city = city.concat(item.value)
  //})
  //city = result.map(item => {
  //  return item.value[0]
  //})
  //ctx.body = {
  //  code: 0,
  //  city: city.map(item => {
  //    return {
  //      province: item.province,
  //      id: item.id,
  //      name: item.name === '市辖区' || item.name === '省直辖县级行政区划'?item.province:item.name
  //    }
  //  })
  //}
  let {status, data: {
    city
    }} = await axios.get(`http://cp-tools.cn/geo/city`);
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

router.get('/hotCity', async (ctx, next) => {
  let {status, data: {hots}} = await axios.get('http://cp-tools.cn/geo/hotCity')
  if(status === 200){
    ctx.body = {
      hots
    }
  }else{
    ctx.body = {
      hots: []
    }
  }
})

router.get('/getPosition', async (ctx, next) => {
  // http://cp-tools.cn/sign
  let {
    status,
    data: {
      province,
      city
    }
  } = await axios.get('http://cp-tools.cn/geo/getPosition')
  if(status === 200){
    ctx.body = {
      province,
      city
    }
  }else{
    ctx.body = {
      province: '',
      city: ''
    }
  }
})

router.get('/getMenu', async (ctx, next) => {
  let {status, data: {menu}} = await axios.get('http://cp-tools.cn/geo/menu')
  if(status === 200){
    ctx.body = {
      menu
    }
  }else{
    ctx.body = {
      menu: ''
    }
  }
})


export default router
