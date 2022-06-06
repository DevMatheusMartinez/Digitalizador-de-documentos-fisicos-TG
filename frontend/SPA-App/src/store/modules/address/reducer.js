const INITIAL_STATE = {
  loading: false,
  data: [],
  currentPage: 1,
  lastPage: 1,
  total: 0,
  addressEdited: [],
  errors: [],
  messageExcelError: "",
  formSuccess: false,
  tenant: false
}

export default function addresses(state = INITIAL_STATE, action) {
  switch (action.type) {

    case 'addresses/EDIT_ADDRESS':
      return {
        ...state,
        loading: true
      }
    case 'addresses/ADD_ADDRESS_FAIL':
      return {
        ...state,
        loading: false,
        errors: action.payload.errors
      }
    case 'addresses/FORM_SUCCESS':
      return {
        ...state,
        errors: [],
        formSuccess: true,
        addressEdited: action.payload.addressEdited
      }

    case 'addresses/ADD_ADDRESS':
      return {
        ...state,
        loading: true
      }

    default:
      return state
  }
}
