const INITIAL_STATE = {
  loading: false,
  data: [],
  currentPage: 1,
  errors: [],
  lastPage: 1,
  formSuccess: false,
  formSuccessStep: false,
  total: 0,
  cnpj: '',
  filter: {
    search: ""
  },
  sort: {
    column: "",
    direction: ""
  },
  tenant_uuid: ""
}

export default function tenants(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'tenants/GET_TENANT_CNPJ':
      return {
        ...state,
        loading: true,
        cnpj: action.payload.cnpj
      }

    case 'tenants/GET_SUCCESS_CNPJ':
      return {
        ...state,
        loading: false,
        data: action.payload.data
      }

    case 'tenants/ADD_TENANT_FAIL':
      return {
        ...state,
        loading: false,
        errors: action.payload.errors
      }

    case 'tenants/ADD_TENANT_UUID':
      return {
        ...state,
        loading: false,
        tenant_uuid: action.payload.uuid_tenant
      }

    case 'tenants/FORM_SUCCESS':
      return {
        ...state,
        errors: [],
        formSuccess: true
      }

    case 'tenants/FORM_SUCCESS_STEP':
      return {
        ...state,
        errors: [],
        formSuccessStep: true
      }

    case 'tenants/EDIT_TENANT':
      return {
        ...state,
        loading: true
      }

    case 'tenants/RESET_FORM':
      return {
        ...state,
        errors: [],
        formSuccess: false,
        formSuccessStep: false
      }

    case 'tenants/ADD_TENANT':
      return {
        ...state,
        loading: true
      }

    case 'tenants/GET_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        lastPage: action.payload.lastPage,
        total: action.payload.total
      }

    case 'tenants/ADD_TENANT_VALIDATE':
      return {
        ...state,
        loading: true
      }


    case 'tenants/CLEAN_ERROR':
      return {
        ...state,
        errors: action.payload.errors
      }

    default:
      return state
  }
}
