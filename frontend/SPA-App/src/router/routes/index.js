import { lazy } from 'react'

// ** Document title
const TemplateTitle = 'Digitalize Agora'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/nova-senha',
    component: lazy(() => import('../../views/pages/login/newPassword')),
    requiredAuth: false,
    layout: 'BlankLayout',
    meta: {
      navbarTab: false
    }
  },
  {
    path: '/cadastro-conta',
    component: lazy(() => import('../../views/pages/tenants/fullForm')),
    requiredAuth: false,
    layout: 'BlankLayout',
    meta: {
      navbarTab: false
    }
  },
  {
    path: '/clientes',
    component: lazy(() => import('../../views/pages/customers/list')),
    requiredAuth: true,
    meta: {
      navbarTab: false
    }
  },
  {
    path: '/usuarios',
    component: lazy(() => import('../../views/pages/users/list')),
    requiredAuth: true,
    meta: {
      navbarTab: false
    }
  },
  {
    path: '/veiculos',
    component: lazy(() => import('../../views/pages/files/GridCards')),
    requiredAuth: true,
    meta: {
      navbarTab: false
    }
  },
  {
    path: '/estoque',
    component: lazy(() => import('../../views/pages/stocks/list')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/contratos',
    component: lazy(() => import('../../views/pages/contracts/list')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/visualizar-estoque',
    component: lazy(() => import('../../views/pages/stocks/view/index')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/digitalizar-arquivo',
    component: lazy(() => import('../../views/pages/files/GridCards')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/digitalizar-arquivo-scanner',
    component: lazy(() => import('../../views/pages/terms/fullForm')),
    requiredAuth: true,
    meta: {
      navbarTab: false
    }
  },
  {
    path: '/digitalizar-arquivo-upload',
    component: lazy(() => import('../../views/pages/terms/fullFormEdit')),
    requiredAuth: true,
    meta: {
      navbarTab: false
    }
  },
  {
    path: '/editar-termo',
    component: lazy(() => import('../../views/pages/terms/fullFormEdit')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/configurações',
    component: lazy(() => import('../../views/pages/accountSettings/index')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/cadastro-usuario',
    component: lazy(() => import('../../views/pages/users/fullForm')),
    requiredAuth: true,
    meta: {
      navbarTab: false
    }
  },
  {
    path: '/visualizar-usuario',
    component: lazy(() => import('../../views/pages/users/view')),
    requiredAuth: true,
    meta: {
      navbarTab: false
    }
  },
  {
    path: '/visualizar-cliente',
    component: lazy(() => import('../../views/pages/customers/view')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/visualizar-veiculo',
    component: lazy(() => import('../../views/pages/files/view')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/visualizar-contrato',
    component: lazy(() => import('../../views/pages/contracts/view')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/cadastro-contrato',
    component: lazy(() => import('../../views/pages/contracts/fullForm')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/cadastro-cliente',
    component: lazy(() => import('../../views/pages/customers/fullForm.js')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/editar-cliente',
    component: lazy(() => import('../../views/pages/customers/fullFormEdit.js')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/editar-usuario',
    component: lazy(() => import('../../views/pages/users/fullFormEdit')),
    requiredAuth: true,
    meta: {
      navbarTab: false
    }
  },
  {
    path: '/editar-veiculo',
    component: lazy(() => import('../../views/pages/files/fullFormEdit')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/editar-contrato',
    component: lazy(() => import('../../views/pages/contracts/fullFormEdit')),
    requiredAuth: true,
    meta: {
      navbarTab: true
    }
  },
  {
    path: '/teste',
    component: lazy(() => import('../../views/SecondPage')),
    requiredAuth: false,
    meta: {
      navbarTab: true
    }
  },
  {
    path: "/verificação",
    component: lazy(() => import('../../views/pages/login/verification')),
    requiredAuth: false,
    layout: 'BlankLayout',
    meta: {
      navBarTab: false
    }
  },
  {
    path: "/esqueci-minha-senha",
    component: lazy(() => import('../../views/pages/login/forgotPassword')),
    layout: 'BlankLayout',
    requiredAuth: false,
    meta: {
      navBarTab: false
    }
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/pages/login/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true,
      navbarTab: false
    }
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }
