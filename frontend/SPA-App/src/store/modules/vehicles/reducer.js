const INITIAL_STATE = {
  loading: false,
  data: [],
  currentPage: 1,
  dataExcel: [],
  lastPage: 1,
  total: 0,
  errors: [],
  errorsEdit: [],
  errorsEditView: [],
  missingFields: false,
  board: '',
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
  vehicle: [],
  vehicleUuid: "",
  vehicleUuidEdit: "",
  vehicleUuidEditView: "",
  fileDigitalize: [],
  vehicleEditSaved: [],
  vehicleUuid: null
}

export default function vehicles(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'vehicles/GET_REQUEST':
      return { ...state, loading: true }

    case 'vehicles/VEHICLE_SAVED':
      return {
        ...state,
        fileDigitalize: action.payload.fileDigitalize
      }

    case 'digitalize/SCANNER':
      return {
        ...state,
        vehicleEditSaved: action.payload.vehicleEditSaved
      }

    case 'files/DIGITALIZE':
      return {
        ...state,
        fileDigitalize: []
      }

    case 'vehicles/RESET_FORM_EDIT_SAVED':
      return {
        ...state,
        vehicleEditSaved: []
      }

    case 'vehicles/DELETE_VEHICLE':
      return {
        ...state,
        loading: true,
        vehicleUuid: action.payload.vehicleUuid
      }

    case 'vehicles/ADD_VEHICLE_FAIL':
      return {
        ...state,
        loading: false,
        errors: action.payload.errors
      }

    case 'vehicles/ADD_VEHICLE_FAIL_EDIT':
      return {
        ...state,
        loading: false,
        errorsEdit: action.payload.errors
      }

    case 'vehicles/ADD_VEHICLE_FAIL_EDIT_VIEW':
      return {
        ...state,
        loading: false,
        errorsEditView: action.payload.errors
      }

    case 'vehicles/DELETE_FILES':
      return {
        ...state,
        loading: false
      }

    case 'vehicles/ADD_VEHICLE_VALIDATE':
      return {
        ...state,
        loading: true
      }

    case 'vehicles/GET_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        lastPage: action.payload.lastPage,
        total: action.payload.total
      }

    case 'vehicles/CHANGE_FILTER':
      return {
        ...state,
        loading: true,
        filter: {
          search: action.payload.search
        }
      }

    case 'vehicles/PER_PAGE':
      return {
        ...state,
        loading: true,
        perPage: {
          perPage: action.payload.perPage
        }
      }

    case 'vehicles/GET_SUCCESS_BOARD':
      return {
        ...state,
        loading: false,
        data: action.payload.data
      }

    case 'vehicles/GET_VEHICLE':
      return {
        ...state,
        loading: true,
        board: action.payload.board
      }

    case 'vehicles/APPLY_SORTING':
      return {
        ...state,
        loading: true,
        sort: {
          column: action.payload.column,
          direction: action.payload.direction
        }
      }

    case 'vehicles/CHANGE_CURRENT_PAGE':
      return {
        ...state,
        loading: true,
        currentPage: action.payload.currentPage
      }

    case 'vehicles/ADD_VEHICLE':
      return {
        ...state,
        loading: true
      }

    case 'vehicles/EDIT_VEHICLE':
      return {
        ...state,
        loading: true
      }

    case 'vehicles/EDIT_VEHICLE_VIEW':
      return {
        ...state,
        loading: true
      }

    case 'vehicles/ADD_FILE':
      return {
        ...state,
        loading: true
      }

    case 'vehicles/RESET_FORM':
      return {
        ...state,
        errors: [],
        formSuccess: false
      }

    case 'vehicles/RESET_FORM_EDIT':
      return {
        ...state,
        errorsEdit: [],
        formSuccessEdit: false
      }

    case 'vehicles/RESET_FORM_EDIT_VIEW':
      return {
        ...state,
        errorsEditView: [],
        formSuccessEditView: false
      }

    case 'vehicles/CLEAN_ERROR':
      return {
        ...state,
        errors: action.payload.errors
      }

    case 'vehicles/IMPORT_DATA':
      return {
        ...state,
        loading: true
      }

    case 'vehicles/RESET_DATA_EXCEL':
      return {
        ...state,
        dataExcel: [],
        errors: [],
        missingFields: false,
        messageExcelError: ""
      }

    case 'vehicles/GET_DATA_EXCEL':
      return {
        ...state,
        dataExcel: action.payload.dataExcel,
        missingFields: action.payload.missingFields
      }

    case 'vehicles/FORM_SUCCESS':
      return {
        ...state,
        errors: [],
        formSuccess: true,
        vehicleUuid: action.vehicle
      }

    case 'vehicles/FORM_SUCCESS_EDIT':
      return {
        ...state,
        errorsEdit: [],
        formSuccessEdit: true,
        vehicleUuidEdit: action.vehicle
      }

    case 'vehicles/FORM_SUCCESS_EDIT_VIEW':
      return {
        ...state,
        errorsEditView: [],
        formSuccessEditView: true,
        vehicleUuidEditView: action.vehicle
      }

    default:
      return state
  }
}
