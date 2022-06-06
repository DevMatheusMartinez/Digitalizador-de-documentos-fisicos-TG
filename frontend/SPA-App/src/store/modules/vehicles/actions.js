export const getVehiclesRequest = () => {
  return {
    type: 'vehicles/GET_REQUEST'
  }
}

export const addVehicleSaved = (vehicleSaved) => {
  return {
    type: 'vehicles/VEHICLE_SAVED',
    payload: {
      vehicleSaved
    }
  }
}

export const addVehicleEditSaved = (vehicleEditSaved) => {
  return {
    type: 'vehicles/VEHICLE_EDIT_SAVED',
    payload: {
      vehicleEditSaved
    }
  }
}

export const fileDigitalize = () => {
  return {
    type: 'files/DIGITALIZE'
  }
}

export const fileScanner = () => {
  return {
    type: 'digitalize/SCANNER'
  }
}

export const applySorting = (column, direction) => {
  return {
    type: 'vehicles/APPLY_SORTING',
    payload: {column, direction}
  }
}

export const deleteVehicle = (vehicleUuid) => {
  return {
    type: 'vehicles/DELETE_VEHICLE',
    payload: { vehicleUuid }
  }
}

export const addVehicleValidate = vehicle => {
  return {
    type: 'vehicles/ADD_VEHICLE_VALIDATE',
    payload: {vehicle}
  }
}

export const getVehiclesSuccess = (data, lastPage, total) => {
  return {
    type: 'vehicles/GET_SUCCESS',
    payload: {
      data,
      lastPage,
      total
    }
  }
}

export const getDataExcel = (dataExcel, missingFields) => {
  return {
    type: 'vehicles/GET_DATA_EXCEL',
    payload: {
      dataExcel,
      missingFields
    }
  }
}

export const resetDataExcelVehicle = () => {
  return {
    type: 'vehicles/RESET_DATA_EXCEL'
  }
}

export const importDataVehicle = file => {
  return {
    type: 'vehicles/IMPORT_DATA',
    payload: {
      file
    }
  }
}

export const perPage = per => {
  return {
    type: 'vehicles/PER_PAGE',
    payload: {perPage: per}
  }
}

export const getVehicleBoardRequest = board => {
  return {
    type: 'vehicles/GET_VEHICLE',
    payload: {board}
  }
}

export const getVehicleSuccessBoard = (data) => {
  return {
    type: 'vehicles/GET_SUCCESS_BOARD',
    payload: {
      data
    }
  }
}

export const changeFilter = search => {
  return {
    type: 'vehicles/CHANGE_FILTER',
    payload: {search}
  }
}

export const changeCurrentPage = currentPage => {
  return {
    type: 'vehicles/CHANGE_CURRENT_PAGE',
    payload: {currentPage}
  }
}

export const addVehicle = (vehicle, photos) => {
  return {
    type: 'vehicles/ADD_VEHICLE',
    payload: {
      vehicle,
      photos
    }
  }
}

export const deleteFilesVehicle = (vehicle, paths) => {
  return {
    type: 'vehicles/DELETE_FILES',
    payload: {
      vehicle,
      paths
    }
  }
}

export const editVehicle = (vehicle) => {
  return {
    type: 'vehicles/EDIT_VEHICLE',
    payload: {vehicle}
  }
}

export const editVehicleView = (vehicle) => {
  return {
    type: 'vehicles/EDIT_VEHICLE_VIEW',
    payload: {vehicle}
  }
}

export const vehicleCleanError = (errors) => {
  return {
    type: 'vehicles/CLEAN_ERROR',
    payload: {
      errors
    }
  }
}

export const addVehicleFail = (vehicle, errors) => {
  return {
    type: 'vehicles/ADD_VEHICLE_FAIL',
    payload: {
      vehicle,
      errors
    }
  }
}

export const addVehicleFailEdit = (vehicle, errors) => {
  return {
    type: 'vehicles/ADD_VEHICLE_FAIL_EDIT',
    payload: {
      vehicle,
      errors
    }
  }
}

export const addVehicleFailEditView = (vehicle, errors) => {
  return {
    type: 'vehicles/ADD_VEHICLE_FAIL_EDIT_VIEW',
    payload: {
      vehicle,
      errors
    }
  }
}

export const resetVehicleForm = () => {
  return {
    type: 'vehicles/RESET_FORM'
  }
}

export const resetVehicleFormEdit = () => {
  return {
    type: 'vehicles/RESET_FORM_EDIT'
  }
}

export const resetVehicleFormEditView = () => {
  return {
    type: 'vehicles/RESET_FORM_EDIT_VIEW'
  }
}

export const formSuccess = (vehicle = null) => {
  return {
    type: 'vehicles/FORM_SUCCESS',
    vehicle
  }
}

export const formSuccessEdit = (vehicle = null) => {
  return {
    type: 'vehicles/FORM_SUCCESS_EDIT',
    vehicle
  }
}

export const formSuccessEditView = (vehicle = null) => {
  return {
    type: 'vehicles/FORM_SUCCESS_EDIT_VIEW',
    vehicle
  }
}

