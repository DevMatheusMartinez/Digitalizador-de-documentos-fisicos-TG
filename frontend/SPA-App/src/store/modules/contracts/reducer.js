const INITIAL_STATE = {
  loading: false,
  data: [],
  currentPage: 1,
  lastPage: 1,
  total: 0,
  errors: [],
  errorsEdit: [],
  errorsEditView: [],
  formSuccess: false,
  formSuccessEdit: false,
  formSuccessEditView: false,
  filter: {
    search: ""
  },
  sort: {
    column: "",
    direction: ""
  },
  filterType: {
    type: ""
  },
  beforeUnmount: {
    openForm: null,
    contract: null,
    active: 0,
    type: ""
  },
  contractUuid: "",
  contractSaved: [],
  contractEditSaved: [],
  customerReseachedSaved: [],
  vehicleReseachedSaved: [],
  vehicleReseachedEditSaved: [],
  customerReseachedEditSaved: [],
  uuidContractSuccess: ''
}

export default function contracts(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'contracts/GET_REQUEST':
      return { ...state, loading: true }

    case 'contracts/FORM_SUCCESS':
      return {
        ...state,
        errors: [],
        formSuccess: true
      }

    case 'contracts/FORM_SUCCESS_EDIT':
      return {
        ...state,
        errorsEdit: [],
        formSuccessEdit: true
      }

    case 'contracts/FORM_SUCCESS_EDIT_VIEW':
      return {
        ...state,
        errorsEditView: [],
        formSuccessEditView: true
      }

    case 'contracts/RESET_FORM_SAVED':
      return {
        ...state,
        contractSaved: [],
        customerReseachedSaved: [],
        vehicleReseachedSaved: []
      }

    case 'contracts/RESET_UUID_CONTRACT_SUCCESS':
      return {
        ...state,
        uuidContractSuccess: ''
      }

    case 'contracts/RESET_FORM_EDIT_SAVED':
      return {
        ...state,
        contractEditSaved: [],
        customerReseachedEditSaved: [],
        vehicleReseachedEditSaved: []
      }

    case 'contracts/DELETE_CONTRACT':
      return {
        ...state,
        loading: true,
        contractUuid: action.payload.contractUuid
      }

    case 'contracts/ADD_CONTRACT_VALIDATE':
      return {
        ...state,
        loading: true
      }

    case 'contracts/CONTRACT_SAVED':
      return {
        ...state,
        contractSaved: action.payload.contractSaved
      }

    case 'contracts/CONTRACT_EDIT_SAVED':
      return {
        ...state,
        contractEditSaved: action.payload.contractEditSaved
      }

    case 'contracts/VEHICLE_RESEACHED_SAVED':
      return {
        ...state,
        vehicleReseachedSaved: action.payload.vehicleReseachedSaved
      }

    case 'contracts/VEHICLE_RESEACHED_EDIT_SAVED':
      return {
        ...state,
        vehicleReseachedEditSaved: action.payload.vehicleReseachedEditSaved
      }

    case 'contracts/CUSTOMER_RESEACHED_EDIT_SAVED':
      return {
        ...state,
        customerReseachedEditSaved: action.payload.customerReseachedEditSaved
      }

    case 'contracts/CUSTOMER_RESEACHED_SAVED':
      return {
        ...state,
        customerReseachedSaved: action.payload.customerReseachedSaved
      }

    case 'contracts/GET_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        lastPage: action.payload.lastPage,
        total: action.payload.total
      }

    case 'contracts/ADD_CONTRACT_FAIL':
      return {
        ...state,
        loading: false,
        errors: action.payload.errors
      }

    case 'contracts/ADD_CONTRACT_FAIL_EDIT':
      return {
        ...state,
        loading: false,
        errorsEdit: action.payload.errors
      }

    case 'contracts/ADD_CONTRACT_FAIL_EDIT_VIEW':
      return {
        ...state,
        loading: false,
        errorsEditView: action.payload.errors
      }

    case 'contracts/ADD_CONTRACT_SUCCESS':
      return {
        ...state,
        uuidContractSuccess: action.payload.uuidContractSuccess
      }

    case 'contracts/CLEAN_ERROR':
      return {
        ...state,
        errors: action.payload.errors
      }

    case 'contracts/CHANGE_FILTER':
      return {
        ...state,
        loading: true,
        filter: {
          search: action.payload.search
        }
      }

    case 'contracts/FILTER_TYPE': {
      return {
        ...state,
        loading: true,
        filterType: {
          type: action.payload.type
        }
      }
    }

    case 'contracts/SAVE_OPEN_FORM_BEFORE_UNMOUTING':
      return {
        ...state,
        loading: true,
        beforeUnmount: {
          openForm: action.payload.openForm,
          contract: action.payload.contract,
          active: action.payload.active,
          type: action.payload.type
        }
      }

    case 'contracts/APPLY_SORTING':
      return {
        ...state,
        loading: true,
        sort: {
          column: action.payload.column,
          direction: action.payload.direction
        }
      }

    case 'contracts/CHANGE_CURRENT_PAGE':
      return {
        ...state,
        loading: true,
        currentPage: action.payload.currentPage
      }

    case 'contracts/EDIT_CONTRACT':
      return {
        ...state,
        loading: true
      }

    case 'contracts/EDIT_CONTRACT_VIEW':
      return {
        ...state,
        loading: true
      }

    case 'contracts/ADD_CONTRACT':
      return {
        ...state,
        loading: true
      }

    case 'contracts/RESET_FORM':
      return {
        ...state,
        errors: [],
        formSuccess: false
      }

    case 'contracts/RESET_FORM_EDIT':
      return {
        ...state,
        errorsEdit: [],
        formSuccessEdit: false
      }

    case 'contracts/RESET_FORM_EDIT_VIEW':
      return {
        ...state,
        errorsEditView: [],
        formSuccessEditView: false
      }

    default:
      return state
  }
}
