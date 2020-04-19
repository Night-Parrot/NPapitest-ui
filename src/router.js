import Vue from 'vue'
import Router from 'vue-router'
// import Router from './router'
import Home from './views/Home.vue'
import testlist from './components/test_list.vue'
import xm_info from './components/xm_info.vue'
import about from './views/About.vue'
import run_times from './components/run_time_page.vue'
import toolbox from './components/toolbox.vue'
import login from './components/login.vue'
import edit_tool from './components/edit_tool.vue'
import view_tool from './components/view_tool.vue'
import page_403 from './components/page_403.vue'
import ctl_wld from './components/control_the_world.vue'
import test_page2 from './components/test2.vue'
import test_page3 from './components/test3.vue'
import tc_list from './components/tc_list.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: about
    },
    {
      path: '/list',
      name: 'list',
      component: testlist
    },
    {
      path: '/xm_info/:xmid',
      name: 'xm_info',
      component: xm_info
    },
    {
      path: '/run_times',
      name: '执行次数统计',
      component: run_times
    },
    {
      path: '/toolbox',
      name: '工具箱',
      component: toolbox
    },
    {
      path: '/login',
      name: '登录',
      component: login
    },
    {
      path: '/edit_tool',
      name: '文档编辑',
      component: edit_tool
    },
    {
      path: '/view_tool',
      name: '文档查看',
      component: view_tool
    },
    {
      path: '/page_403',
      name: '权限不足',
      component: page_403
    },
    {
      path: '/ctl_wld',
      name: '控制页面',
      component: ctl_wld
    },
    {
      path: '/testpage2',
      name: '测试页面2',
      component: test_page2
    },    
    {
      path: '/testpage3',
      name: '测试页面3',
      component: test_page3
    },    
    {
      path: '/tc_list',
      name: '吐槽页面',
      component: tc_list
    },
  ]
})
