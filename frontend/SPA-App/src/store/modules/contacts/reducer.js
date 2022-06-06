const INITIAL_STATE = {
  loading: false,
  data: [],
  currentPage: 1,
  lastPage: 1,
  total: 0,
  contactEdited: [],
  errors: [],
  messageExcelError: "",
  formSuccess: false,
  tenant: false
}

export default function contacts(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'contacts/EDIT_CONTACT':
      return {
        ...state,
        loading: true
      }
    case 'contacts/ADD_CONTACT_FAIL':
      return {
        ...state,
        loading: false,
        errors: action.payload.errors
      }
    case 'contacts/FORM_SUCCESS':
      return {
        ...state,
        errors: [],
        formSuccess: true,
        contactEdited: action.payload.contactEdited
      }
    case 'contacts/ADD_CONTACT_VALIDATE_STEP':
      return {
        ...state,
        loading: true
      }
    case 'contacts/RESET_FORM':
      return {
        ...state,
        errors: [],
        formSuccess: false
      }

    default:
      return state
  }
}
