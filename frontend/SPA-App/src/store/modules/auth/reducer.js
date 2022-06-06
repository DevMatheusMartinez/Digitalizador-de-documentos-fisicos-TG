const INITIAL_STATE = {
  userRole: "admin",
  user: {},
  tenant: {},
  errors: false,
  tenants: [],
  email: '',
  password: '',
  selectedTenant: '',
  firstAccess: '',
  loginSuccess: false
}

export default function auth(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "LOGIN_WITH_EMAIL":
      return { ...state, values: action.payload }

    case "LOGIN_WITH_FB":
      return { ...state, values: action.payload }

    case "LOGIN_WITH_TWITTER":
      return { ...state, values: action.payload }

    case "LOGIN_WITH_GOOGLE":
      return { ...state, values: action.payload }

    case "LOGIN_WITH_GITHUB":
      return { ...state, values: action.payload }

    case "LOGIN_WITH_JWT":
      return { ...state, values: action.payload }

    case "LOGOUT_WITH_JWT":
      return { ...state, values: action.payload }

    case "LOGOUT_WITH_FIREBASE":
      return { ...state, values: action.payload }

    case "CHANGE_ROLE":
      return { ...state, userRole: action.userRole }

    case 'login/CLEAN_ERROR':
      return {
        ...state,
        errors: false
      }

    case 'auth/GET_LOGGED_USER_SUCCESS':
      return {
        ...state,
        user: action.payload.loggedUser,
        tenant: { id: 123 }
      }

    case 'login/SUBMIT_LOGIN':
      return {
        ...state,
        userLogging: {
          email: action.payload.email,
          password: action.payload.password,
          selectedTenant: action.payload.selectedTenant
        }
      }

    case 'login/GET_TENANTS':
      return {
        ...state,
        tenants: action.payload.tenants
      }

    case 'login/ADD_LOGIN_FAIL':
      return {
        ...state,
        errors: action.payload.errors
      }

    case 'login/LOGIN_SUCCESS':
      return {
        ...state,
        loginSuccess: action.payload.loginSuccess
      }

    case 'login/LOGIN_FIRST_ACESS_SUCCESS':
      return {
        ...state,
        loginSuccess: action.payload.loginSuccess
      }


    default:
      return state
  }
}
