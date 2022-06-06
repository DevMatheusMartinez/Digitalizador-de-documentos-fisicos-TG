export const getContractsRequest = () => {
  return {
    type: 'contracts/GET_REQUEST'
  }
}

export const getContractsSuccess = (data, lastPage, total) => {
  return {
    type: 'contracts/GET_SUCCESS',
    payload: {
      data,
      lastPage,
      total
    }
  }
}

export const saveOpenFormBeforeUnmouting = (openForm, contract, active, type) => {
  return {
    type: 'contracts/SAVE_OPEN_FORM_BEFORE_UNMOUTING',
    payload: {
      openForm,
      contract,
      active,
      type
    }
  }
}

export const changeFilter = search => {
  return {
    type: 'contracts/CHANGE_FILTER',
    payload: {search}
  }
}

export const changeFilterType = type => {
  return {
    type: 'contracts/FILTER_TYPE',
    payload: {type}
  }
}

export const applySorting = (column, direction) => {
  return {
    type: 'contracts/APPLY_SORTING',
    payload: {column, direction}
  }
}

export const changeCurrentPage = currentPage => {
  return {
    type: 'contracts/CHANGE_CURRENT_PAGE',
    payload: {currentPage}
  }
}

export const addContract = contract => {
  return {
    type: 'contracts/ADD_CONTRACT',
    payload: {contract}
  }
}


export const addContractValidate = contract => {
  return {
      type: 'contracts/ADD_CONTRACT_VALIDATE',
      payload: {contract}
  }
}

export const editContract = contract => {
  return {
    type: 'contracts/EDIT_CONTRACT',
    payload: {contract}
  }
}

export const editContractView = contract => {
  return {
    type: 'contracts/EDIT_CONTRACT_VIEW',
    payload: {contract}
  }
}

export const addContractFail = (contract, errors) => {
  return {
    type: 'contracts/ADD_CONTRACT_FAIL',
    payload: {
      contract,
      errors
    }
  }
}

export const addContractFailEdit = (contract, errors) => {
  return {
    type: 'contracts/ADD_CONTRACT_FAIL_EDIT',
    payload: {
      contract,
      errors
    }
  }
}

export const addContractFailEditView = (contract, errors) => {
  return {
    type: 'contracts/ADD_CONTRACT_FAIL_EDIT_VIEW',
    payload: {
      contract,
      errors
    }
  }
}

export const addContractUuidSuccess = (uuidContractSuccess) => {
  return {
    type: 'contracts/ADD_CONTRACT_SUCCESS',
    payload: {
      uuidContractSuccess
    }
  }
}

export const addContractSaved = (contractSaved) => {
  return {
    type: 'contracts/CONTRACT_SAVED',
    payload: {
      contractSaved
    }
  }
}

export const addVehicleReseachedSaved = (vehicleReseachedSaved) => {
  return {
    type: 'contracts/VEHICLE_RESEACHED_SAVED',
    payload: {
      vehicleReseachedSaved
    }
  }
}

export const addCustomerReseachedSaved = (customerReseachedSaved) => {
  return {
    type: 'contracts/CUSTOMER_RESEACHED_SAVED',
    payload: {
      customerReseachedSaved
    }
  }
}

export const addContractEditSaved = (contractEditSaved) => {
  return {
    type: 'contracts/CONTRACT_EDIT_SAVED',
    payload: {
      contractEditSaved
    }
  }
}

export const addVehicleReseachedEditSaved = (vehicleReseachedEditSaved) => {
  return {
    type: 'contracts/VEHICLE_RESEACHED_EDIT_SAVED',
    payload: {
      vehicleReseachedEditSaved
    }
  }
}

export const deleteContract = (contractUuid) => {
  return {
    type: 'contracts/DELETE_CONTRACT',
    payload: { contractUuid }
  }
}


export const addCustomerReseachedEditSaved = (customerReseachedEditSaved) => {
  return {
    type: 'contracts/CUSTOMER_RESEACHED_EDIT_SAVED',
    payload: {
      customerReseachedEditSaved
    }
  }
}


export const resetContractsFormEditSaved = () => {
  return {
    type: 'contracts/RESET_FORM_EDIT_SAVED'
  }
}

export const resetUuidContractSuccess = () => {
  return {
    type: 'contracts/RESET_UUID_CONTRACT_SUCCESS'
  }
}

export const resetContractsFormSaved = () => {
  return {
    type: 'contracts/RESET_FORM_SAVED'
  }
}


export const contractCleanError = (errors) => {
  return {
    type: 'contract/CLEAN_ERROR',
    payload: {
      errors
    }
  }
}

export const formSuccess = () => {
  return {
    type: 'contracts/FORM_SUCCESS'
  }
}

export const formSuccessEdit = () => {
  return {
    type: 'contracts/FORM_SUCCESS_EDIT'
  }
}

export const formSuccessEditView = () => {
  return {
    type: 'contracts/FORM_SUCCESS_EDIT_VIEW'
  }
}

export const resetContractsForm = () => {
  return {
    type: 'contracts/RESET_FORM'
  }
}

export const resetContractsFormEdit = () => {
  return {
    type: 'contracts/RESET_FORM_EDIT'
  }
}

export const resetContractsFormEditView = () => {
  return {
    type: 'contracts/RESET_FORM_EDIT_VIEW'
  }
}
