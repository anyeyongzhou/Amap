import { createApp } from 'vue'
import App from '@/App.vue'

import router from '@/router/index.js'
import store from './store/index.js'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

//全局引入css
import './style.css'
//全局引入自定义css
import './style/index.css'
//引入element-plus的样式
import 'element-plus/dist/index.css'

//引入element-plue的icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//使用路由
app.use(router)

//使用vuex
app.use(store)

//国际化配置
app.use(ElementPlus, {
  locale: zhCn
})

//绑定替换index.html中的app
app.mount('#app')
