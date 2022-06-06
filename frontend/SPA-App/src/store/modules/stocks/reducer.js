const INITIAL_STATE = {
  loading: false,
  data: [],
  currentPage: 1,
  lastPage: 1,
  total: 0,
  missingFields: false,
  board: '',
  formSuccess: false,
  filter: {
    search: "",
    status: ''
  },
  sort: {
    column: "",
    direction: ""
  }
}

export default function stocks(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'stocks/GET_REQUEST':
      return { ...state, loading: true }

    case 'stocks/GET_REQUEST_PHOTOS':
      return { ...state, loading: true }

    case 'stocks/GET_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        lastPage: action.payload.lastPage,
        total: action.payload.total
      }

    case 'stocks/CHANGE_FILTER':
      return {
        ...state,
        loading: true,
        filter: {
          search: action.payload.search
        }
      }

    case 'stocks/CHANGE_FILTER_STATUS':
      return {
        ...state,
        loading: true,
        filter: {
          status: action.payload.status
        }
      }

    case 'stocks/CHANGE_CURRENT_PAGE':
      return {
        ...state,
        loading: true,
        currentPage: action.payload.currentPage
      }

    case 'stocks/ADD_STOCK_VALIDATE':
      return {
        ...state,
        loading: true
      }

    case 'stocks/EDIT_STOCK':
      return {
        ...state,
        loading: true
      }

    case 'stocks/EDIT_STOCK_SITE':
      return {
        ...state,
        loading: true
      }

    case 'stocks/ADD_STOCK_FAIL':
      return {
        ...state,
        loading: false,
        errors: action.payload.errors
      }

    case 'stocks/RESET_FORM':
      return {
        ...state,
        errors: [],
        formSuccess: false
      }

    case 'stocks/FORM_SUCCESS':
      return {
        ...state,
        errors: [],
        formSuccess: true,
        vehicleUuid: action.vehicle
      }

    default:
      return state
  }
}
