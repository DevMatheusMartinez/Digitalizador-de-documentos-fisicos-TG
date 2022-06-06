const INITIAL_STATE = {
  loading: false,
  data: [],
  currentPage: 1,
  lastPage: 1,
  total: 0,
  incomesEdited: [],
  errors: [],
  messageExcelError: "",
  formSuccess: false,
  tenant: false
}

export default function incomes(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'incomes/EDIT_INCOMES':
      return {
        ...state,
        loading: true
      }
    case 'incomes/ADD_INCOMES_FAIL':
      return {
        ...state,
        loading: false,
        errors: action.payload.errors
      }
    case 'incomes/FORM_SUCCESS':
      return {
        ...state,
        errors: [],
        formSuccess: true,
        incomesEdited: action.payload.incomesEdited
      }

    default:
      return state
  }
}
