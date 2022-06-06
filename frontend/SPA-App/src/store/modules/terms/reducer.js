const INITIAL_STATE = {
  loading: false,
  data: [],
  currentPage: 1,
  lastPage: 1,
  total: 0,
  errors: [],
  formSuccess: false,
  tenant: false,
  filter: {
    search: ""
  },
  sort: {
    column: "",
    direction: ""
  },
  termUuid: ""
}

export default function terms(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'terms/GET_REQUEST':
      return { ...state, loading: true }

    case 'terms/GET_REQUEST_LIST':
      return { ...state, loading: true }

    case 'terms/RESET_FORM':
      return {
        ...state,
        errors: [],
        formSuccess: false
      }

    case 'terms/CHANGE_FILTER':
      return {
        ...state,
        loading: true,
        filter: {
          search: action.payload.search
        }
      }

    case 'terms/APPLY_SORTING':
      return {
        ...state,
        loading: true,
        sort: {
          column: action.payload.column,
          direction: action.payload.direction
        }
      }

    case 'terms/CHANGE_CURRENT_PAGE':
      return {
        ...state,
        loading: true,
        currentPage: action.payload.currentPage
      }

    case 'terms/GET_SUCCESS':
      return {
        ...state,
        loading: true,
        data: action.payload.data
      }

    case 'terms/FORM_SUCCESS':
      return {
        ...state,
        errors: [],
        formSuccess: true
      }

    case 'terms/ADD_TERM':
      return {
        ...state,
        loading: true
      }

    case 'terms/EDIT_TERM':
      return {
        ...state,
        loading: true
      }

    case 'terms/CLEAN_ERROR':
      return {
        ...state,
        errors: action.payload.errors
      }

    case 'terms/ADD_TERM_FAIL':
      return {
        ...state,
        loading: false,
        errors: action.payload.errors
      }

    case 'terms/PER_PAGE':
      return {
        ...state,
        loading: true,
        perPage: {
          perPage: action.payload.perPage
        }
      }

    case 'terms/DELETE_TERM':
      return {
        ...state,
        loading: true,
        termUuid: action.payload.termUuid
      }

    default:
      return state

  }
}
