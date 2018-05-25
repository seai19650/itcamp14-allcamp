import Router from 'vue-router'
import Profile from '@/pages/Profile'
import Login from '@/pages/Login'
import Privacy from '@/pages/Privacy'
import Contact from '@/pages/Contact'

import Dashboard from '@/pages/admin/Dashboard'
import Items from '@/pages/admin/Items'
import Quests from '@/pages/admin/Quests'
import World from '@/pages/admin/World'
import Users from '@/pages/admin/Users'
import UserEditor from '@/pages/admin/UserEditor'
import UIDmatch from '@/pages/admin/UIDmatch'
import Session from '@/pages/controller/Session'
import Assigner from '@/pages/controller/Assigner'

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true,
        playerAuth: true,
        controllerAuth: false,
        adminAuth: false
      }
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: Privacy
    },
    {
      path: '/contact/:uid',
      name: 'Contact',
      component: Contact
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        requiresAuth: false,
        playerAuth: true,
        controllerAuth: true,
        adminAuth: true
      }
    },
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        {
          path: 'quests',
          component: Quests,
          name: 'ManageQuests',
          meta: {
            requiresAuth: true,
            playerAuth: false,
            controllerAuth: true,
            adminAuth: true
          }
        },
        {
          path: 'items',
          component: Items,
          name: 'ManageItems',
          meta: {
            requiresAuth: true,
            playerAuth: false,
            controllerAuth: true,
            adminAuth: true
          }
        },
        {
          path: 'world',
          component: World,
          name: 'ManageWorld',
          meta: {
            requiresAuth: true,
            playerAuth: false,
            controllerAuth: true,
            adminAuth: true
          }
        },
        {
          path: 'users',
          component: Users,
          name: 'ManageUsers',
          meta: {
            requiresAuth: true,
            playerAuth: false,
            controllerAuth: false,
            adminAuth: true
          }
        },
        {
          path: 'session',
          component: Session,
          name: 'ManageSession',
          meta: {
            requiresAuth: true,
            playerAuth: false,
            controllerAuth: true,
            adminAuth: true
          }
        },
        {
          path: 'uid',
          component: UIDmatch,
          name: 'ManageUID',
          meta: {
            requiresAuth: true,
            playerAuth: false,
            controllerAuth: true,
            adminAuth: true
          }
        },
        {
          path: 'assigner',
          component: Assigner,
          name: 'ManageAssigner',
          meta: {
            requiresAuth: true,
            playerAuth: false,
            controllerAuth: true,
            adminAuth: true
          }
        },
        {
          path: 'users/editor/:id',
          component: UserEditor,
          name: 'UserEditor',
          meta: {
            requiresAuth: true,
            playerAuth: false,
            controllerAuth: false,
            adminAuth: true
          }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let global = ['Privacy']

  if (window.localStorage.getItem('loggingIn')) {
    console.log('Redirected to Login Page :FB action')
    next()
  } else {
    if (to.meta.requiresAuth) {
      console.log('Authenticated Routing..')
      const user = JSON.parse(window.localStorage.getItem('itcamp-wallet'))
      if (!user || !user.token) {
        next({name: 'Login'})
      } else if (to.meta.adminAuth && !to.meta.controllerAuth) {
        const user = JSON.parse(window.localStorage.getItem('itcamp-wallet'))
        if (user.mode === 'admin') {
          next()
        } else if (user.mode === 'controller') {
          next({name: 'ManageQuests'})
        } else {
          next({name: 'Profile'})
        }
      } else if (to.meta.adminAuth && to.meta.controllerAuth) {
        const user = JSON.parse(window.localStorage.getItem('itcamp-wallet'))
        if (user.mode === 'admin' || user.mode === 'controller') {
          next()
        } else {
          next({name: 'Profile'})
        }
      } else if (to.meta.playerAuth) {
        const user = JSON.parse(window.localStorage.getItem('itcamp-wallet'))
        if (user.mode === 'player') {
          next()
        } else {
          next({name: 'ManageQuests'})
        }
      }
    } else {
      console.log('Public Routing')
      const user = JSON.parse(window.localStorage.getItem('itcamp-wallet'))
      if (user && !to.name.includes(global)) {
        next({name: 'Profile'})
      } else {
        next()
      }
    }
  }
})

export default router
