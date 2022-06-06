const INITIAL_STATE = {
  loading: false,
  data: [],
  dataExcel: [],
  currentPage: 1,
  lastPage: 1,
  total: 0,
  cpf_cnpj: '',
  customerRegistered: [],
  customerRegisteredEdit: [],
  customerRegisteredEditView: [],
  errors: [],
  errorsEdit: [],
  errorsEditView: [],
  messageExcelError: "",
  customerUuid: "",
  formSuccess: false,
  formSuccessEdit: false,
  formSuccessEditView: false,
  missingFields: false,
  messageError: false,
  tenant: false,
  customer: [],
  customerSaved: [],
  conjugeSaved: [],
  incomeSaved: [],
  addressSaved: [],
  bankSaved: [],
  contactSaved: [],
  customerEditSaved: [],
  conjugeEditSaved: [],
  incomeEditSaved: [],
  addressEditSaved: [],
  bankEditSaved: [],
  contactEditSaved: [],
  filter: {
    search: ""
  },
  sort: {
    column: "",
    direction: ""
  }
}

export default function customers(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'customers/GET_REQUEST':
      return { ...state, loading: true }

    case 'customers/CUSTOMER_SAVED':
      return {
        ...state,
        customerSaved: action.payload.customerSaved
      }

    case 'customers/DELETE_CUSTOMER':
      return {
        ...state,
        loading: true,
        customerUuid: action.payload.customerUuid
      }

    case 'customers/CUSTOMER_EDIT_SAVED':
      return {
        ...state,
        customerEditSaved: action.payload.customerEditSaved
      }

    case 'customers/RESET_FORM_SAVED':
      return {
        ...state,
        customerSaved: [],
        conjugeSaved: [],
        incomeSaved: [],
        addressSaved: [],
        bankSaved: [],
        contactSaved: []
      }

    case 'customers/RESET_FORM_EDIT_SAVED':
      return {
        ...state,
        customerEditSaved: [],
        conjugeEditSaved: [],
        incomeEditSaved: [],
        addressEditSaved: [],
        bankEditSaved: [],
        contactEditSaved: []
      }

    case 'customers/CONJUGE_SAVED':
      return {
        ...state,
        conjugeSaved: action.payload.conjugeSaved
      }

    case 'customers/CONJUGE_EDIT_SAVED':
      return {
        ...state,
        conjugeEditSaved: action.payload.conjugeEditSaved
      }

    case 'customers/INCOME_SAVED':
      return {
        ...state,
        incomeSaved: action.payload.incomeSaved
      }

    case 'customers/INCOME_EDIT_SAVED':
      return {
        ...state,
        incomeEditSaved: action.payload.incomeEditSaved
      }

    case 'customers/ADDRESS_SAVED':
      return {
        ...state,
        addressSaved: action.payload.addressSaved
      }

    case 'customers/ADDRESS_EDIT_SAVED':
      return {
        ...state,
        addressEditSaved: action.payload.addressEditSaved
      }

    case 'customers/BANK_SAVED':
      return {
        ...state,
        bankSaved: action.payload.bankSaved
      }

    case 'customers/BANK_EDIT_SAVED':
      return {
        ...state,
        bankEditSaved: action.payload.bankEditSaved
      }

    case 'customers/CONTACT_SAVED':
      return {
        ...state,
        contactSaved: action.payload.contactSaved
      }

    case 'customers/CONTACT_EDIT_SAVED':
      return {
        ...state,
        contactEditSaved: action.payload.contactEditSaved
      }

    case 'customers/GET_CUSTOMER_CPF_CNPJ':
      return {
        ...state,
        loading: true,
        cpf_cnpj: action.payload.cpf_cnpj
      }

    case 'customers/GET_ALL_CUSTOMER_CPF_CNPJ':
      return {
        ...state,
        loading: true,
        cpf_cnpj: action.payload.cpf_cnpj
      }

    case 'customers/ADD_CUSTOMER_VALIDATE':
      return {
        ...state,
        loading: true
      }

    case 'customers/RESET_FORM':
      return {
        ...state,
        errors: [],
        formSuccess: false
      }

    case 'customers/RESET_FORM_EDIT':
      return {
        ...state,
        errorsEdit: [],
        formSuccessEdit: false
      }

      case 'customers/RESET_FORM_EDIT_VIEW':
        return {
          ...state,
          errorsEditView: [],
          formSuccessEditView: false
        }

    case 'customers/GET_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        lastPage: action.payload.lastPage,
        total: action.payload.total
      }

    case 'customers/FORM_SUCCESS':
      return {
        ...state,
        errors: [],
        formSuccess: true,
        customerRegistered: action.payload.customerRegistered
      }

    case 'customers/FORM_SUCCESS_EDIT':
      return {
        ...state,
        errorsEdit: [],
        formSuccessEdit: true,
        customerRegisteredEdit: action.payload.customerRegistered
      }

    case 'customers/FORM_SUCCESS_EDIT_VIEW':
      return {
        ...state,
        errorsEditView: [],
        formSuccessEditView: true,
        customerRegisteredEditView: action.payload.customerRegistered
      }

    case 'customers/GET_SUCCESS_CPF_CNPJ':
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        tenant: action.payload.tenant
      }

    case 'customers/CHANGE_FILTER':
      return {
        ...state,
        loading: true,
        filter: {
          search: action.payload.search
        }
      }

    case 'customers/APPLY_SORTING':
      return {
        ...state,
        loading: true,
        sort: {
          column: action.payload.column,
          direction: action.payload.direction
        }
      }

    case 'customers/CHANGE_CURRENT_PAGE':
      return {
        ...state,
        loading: true,
        currentPage: action.payload.currentPage
      }

    case 'customers/ADD_CUSTOMER':
      return {
        ...state,
        loading: true
      }

    case 'customers/GET_DATA_EXCEL':
      return {
        ...state,
        dataExcel: action.payload.dataExcel,
        missingFields: action.payload.missingFields
      }

    case 'customers/RESET_DATA_EXCEL':
      return {
        ...state,
        dataExcel: [],
        errors: [],
        missingFields: false,
        messageExcelError: ""
      }

    case 'customers/IMPORT_DATA':
      return {
        ...state,
        loading: true
      }

    case 'customers/CLEAN_ERROR':
      return {
        ...state,
        errors: action.payload.errors
      }

    case 'customers/ERROR_EXCEL_MESSAGE':
      return {
        ...state,
        messageExcelError: action.payload.messageExcelError
      }

    case 'customers/ADD_CUSTOMER_FAIL':
      return {
        ...state,
        loading: false,
        errors: action.payload.errors
      }

    case 'customers/ADD_CUSTOMER_FAIL_EDIT':
      return {
        ...state,
        loading: false,
        errorsEdit: action.payload.errors
      }

    case 'customers/ADD_CUSTOMER_FAIL_EDIT_VIEW':
      return {
        ...state,
        loading: false,
        errorsEditView: action.payload.errors
      }

    case 'customers/EDIT_CUSTOMER':
      return {
        ...state,
        loading: true
      }

    case 'customers/EDIT_CUSTOMER_VIEW':
      return {
        ...state,
        loading: true
      }

    case 'customers/PER_PAGE':
      return {
        ...state,
        loading: true,
        perPage: {
          perPage: action.payload.perPage
        }
      }

    default:
      return state
  }
}
