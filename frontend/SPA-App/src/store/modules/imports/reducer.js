const INITIAL_STATE = {
  loading: false,
  data: [],
  dataExcel: [],
  currentPage: 1,
  lastPage: 1,
  total: 0,
  errors: [],
  formSuccess: false,
  missingFields: false,
  messageError: false,
  tenant: false,
  filter: {
    search: ""
  },
  sort: {
    column: "",
    direction: ""
  }
}

export default function imports(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'imports/GET_REQUEST':
      return {...state, loading: true}

    case 'imports/GET_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        lastPage: action.payload.lastPage,
        total: action.payload.total
      }

    case 'imports/CHANGE_FILTER':
      return {
        ...state,
        loading: true,
        filter: {
          search: action.payload.search
        }
      }

    case 'imports/APPLY_SORTING':
      return {
        ...state,
        loading: true,
        sort: {
          column: action.payload.column,
          direction: action.payload.direction
        }
      }

    case 'imports/CHANGE_CURRENT_PAGE':
      return {
        ...state,
        loading: true,
        currentPage: action.payload.currentPage
      }

    default:
      return state
  }
}
