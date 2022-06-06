const INITIAL_STATE = {
  loading: false,
  data: [],
  userUuid: '',
  currentPage: 1,
  lastPage: 1,
  total: 0,
  errors: [],
  errorsEdit: [],
  errorsEditView: [],
  user: [],
  formSuccess: false,
  formSuccessEdit: false,
  formSuccessEditView: false,
  filter: {
    search: ""
  },
  teste: "",
  permissions: [],
  sort: {
    column: "",
    direction: ""
  },
  userSaved: [],
  userSavedEdit: [],
  contactSaved: [],
  contactSavedEdit: [],
  addressSaved: [],
  addressSavedEdit: [],
  permissionsSaved: [],
  permissionsEditSaved: [],
  beforeUnmount: {
    openForm: null,
    user: null,
    active: 0
  }
}

export default function users(state = INITIAL_STATE, action) {
  switch (action.type) {

    case 'users/ADDRESS_SAVED':
      return {
        ...state,
        addressSaved: action.payload.addressSaved
      }

    case 'users/ADDRESS_SAVED_EDIT':
      return {
        ...state,
        addressSavedEdit: action.payload.addressSavedEdit
      }

    case 'users/PERMISSIONS_SAVED':
      return {
        ...state,
        permissionsSaved: action.payload.permissionsSaved
      }

    case 'users/PERMISSIONS_EDIT_SAVED':
      return {
        ...state,
        permissionsEditSaved: action.payload.permissionsEditSaved
      }

    case 'users/RESET_FORM_EDIT_SAVED':
      return {
        ...state,
        userSavedEdit: [],
        contactSavedEdit: [],
        addressSavedEdit: [],
        permissionsEditSaved: []
      }

    case 'users/RESET_FORM_SAVED':
      return {
        ...state,
        userSaved: [],
        contactSaved: [],
        addressSaved: [],
        permissionsSaved: []
      }

    case 'users/CONTACT_SAVED':
      return {
        ...state,
        contactSaved: action.payload.contactSaved
      }

    case 'users/CONTACT_SAVED_EDIT':
      return {
        ...state,
        contactSavedEdit: action.payload.contactSavedEdit
      }

    case 'users/USER_SAVED':
      return {
        ...state,
        userSaved: action.payload.userSaved
      }

    case 'users/USER_SAVED_EDIT':
      return {
        ...state,
        userSavedEdit: action.payload.userSavedEdit
      }

    case 'users/GET_REQUEST':
      return { ...state, loading: true }

    case 'users/GET_LOGGED_TENANT':
      return { ...state, loading: true }

    case 'users/GET_PERMISSIONS':
      return { ...state, loading: true }

    case 'users/GET_PERMISSIONS_SUCCESS':
      return {
        ...state,
        loading: true,
        permissions: action.payload.permissions
      }

    case 'users/GET_LOGGED_TENANT_SUCCESS':
      return {
        ...state,
        loading: true,
        data: action.payload.data
      }

    case 'users/GET_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        lastPage: action.payload.lastPage,
        total: action.payload.total
      }

    case 'users/GET_USER_UUID_SUCCESS':
      return {
        ...state,
        loading: true,
        user: action.payload.user
      }

    case 'users/CHANGE_FILTER':
      return {
        ...state,
        loading: true,
        filter: {
          search: action.payload.search
        }
      }

    case 'users/GET_USER_UUID':
      return {
        ...state,
        loading: true,
        userUuid: action.payload.userUuid
      }

    case 'users/DELETE_USER':
      return {
        ...state,
        loading: true,
        userUuid: action.payload.userUuid
      }

    case 'users/APPLY_SORTING':
      return {
        ...state,
        loading: true,
        sort: {
          column: action.payload.column,
          direction: action.payload.direction
        }
      }

    case 'users/CHANGE_CURRENT_PAGE':
      return {
        ...state,
        loading: true,
        currentPage: action.payload.currentPage
      }

    case 'users/ADD_USER':
      return {
        ...state,
        loading: true
      }

    case 'users/SAVE_SEARCH_BEFORE_UNMOUTING':
      return {
        ...state,
        loading: true,
        beforeUnmount: {
          search: action.payload.search
        }
      }

    case 'users/SAVE_OPEN_FORM_BEFORE_UNMOUTING':
      return {
        ...state,
        loading: true,
        beforeUnmount: {
          openForm: action.payload.openForm,
          user: action.payload.user,
          active: action.payload.active
        }
      }

    case 'users/ADD_USER_VALIDATE':
      return {
        ...state,
        loading: true
      }

    case 'users/ADD_USER_VALIDATE_STEP':
      return {
        ...state,
        loading: true
      }

    case 'users/ADD_USER_FAIL':
      return {
        ...state,
        loading: false,
        errors: action.payload.errors
      }

    case 'users/ADD_USER_FAIL_EDIT':
      return {
        ...state,
        loading: false,
        errorsEdit: action.payload.errors
      }

    case 'users/ADD_USER_FAIL_EDIT_VIEW':
      return {
        ...state,
        loading: false,
        errorsEditView: action.payload.errors
      }

    case 'users/CLEAN_ERROR':
      return {
        ...state,
        errors: action.payload.errors
      }

    case 'users/FORM_SUCCESS':
      return {
        ...state,
        errors: [],
        formSuccess: true
      }

    case 'users/FORM_SUCCESS_EDIT':
      return {
        ...state,
        errorsEdit: [],
        formSuccessEdit: true
      }

    case 'users/FORM_SUCCESS_EDIT_VIEW':
      return {
        ...state,
        errorsEditView: [],
        formSuccessEditView: true
      }

    case 'users/RESET_FORM':
      return {
        ...state,
        errors: [],
        formSuccess: false
      }

    case 'users/RESET_FORM_EDIT':
      return {
        ...state,
        errorsEdit: [],
        formSuccessEdit: false
      }

    case 'users/RESET_FORM_EDIT_VIEW':
      return {
        ...state,
        errorsEditView: [],
        formSuccessEditView: false
      }

    case 'users/EDIT_USER':
      return {
        ...state,
        loading: true
      }

    case 'users/EDIT_USER_LITTLE':
      return {
        ...state,
        loading: true
      }

    case 'users/EDIT_PASSWORD_INITIAL':
      return {
        ...state,
        loading: true
      }

    case 'users/FORGOT_PASSWORD':
      return {
        ...state,
        loading: true
      }

    default:
      return state
  }

}
