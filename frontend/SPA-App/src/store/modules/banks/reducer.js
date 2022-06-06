const INITIAL_STATE = {
  loading: false,
  data: [],
  currentPage: 1,
  lastPage: 1,
  total: 0,
  bankEdited: [],
  errors: [],
  messageExcelError: "",
  formSuccess: false,
  tenant: false
}

export default function banks(state = INITIAL_STATE, action) {
  switch (action.type) {

    case 'banks/EDIT_BANK':
      return {
        ...state,
        loading: true
      }
    case 'banks/ADD_BANK_FAIL':
      return {
        ...state,
        loading: false,
        errors: action.payload.errors
      }
    case 'banks/FORM_SUCCESS':
      return {
        ...state,
        errors: [],
        formSuccess: true,
        bankEdited: action.payload.bankEdited
      }

    default:
      return state
  }
}
