export const addCustomerSaved = (customerSaved) => {
  return {
    type: 'customers/CUSTOMER_SAVED',
    payload: {
      customerSaved
    }
  }
}

export const addConjugeSaved = (conjugeSaved) => {
  return {
    type: 'customers/CONJUGE_SAVED',
    payload: {
      conjugeSaved
    }
  }
}

export const addIncomesSaved = (incomeSaved) => {
  return {
    type: 'customers/INCOME_SAVED',
    payload: {
      incomeSaved
    }
  }
}

export const addAddressSaved = (addressSaved) => {
  return {
    type: 'customers/ADDRESS_SAVED',
    payload: {
      addressSaved
    }
  }
}

export const addBankSaved = (bankSaved) => {
  return {
    type: 'customers/BANK_SAVED',
    payload: {
      bankSaved
    }
  }
}

export const addContactSaved = (contactSaved) => {
  return {
    type: 'customers/CONTACT_SAVED',
    payload: {
      contactSaved
    }
  }
}

export const addCustomerEditSaved = (customerEditSaved) => {
  return {
    type: 'customers/CUSTOMER_EDIT_SAVED',
    payload: {
      customerEditSaved
    }
  }
}

export const addConjugeEditSaved = (conjugeEditSaved) => {
  return {
    type: 'customers/CONJUGE_EDIT_SAVED',
    payload: {
      conjugeEditSaved
    }
  }
}

export const addIncomesEditSaved = (incomeEditSaved) => {
  return {
    type: 'customers/INCOME_EDIT_SAVED',
    payload: {
      incomeEditSaved
    }
  }
}

export const addAddressEditSaved = (addressEditSaved) => {
  return {
    type: 'customers/ADDRESS_EDIT_SAVED',
    payload: {
      addressEditSaved
    }
  }
}

export const addBankEditSaved = (bankEditSaved) => {
  return {
    type: 'customers/BANK_EDIT_SAVED',
    payload: {
      bankEditSaved
    }
  }
}

export const addContactEditSaved = (contactEditSaved) => {
  return {
    type: 'customers/CONTACT_EDIT_SAVED',
    payload: {
      contactEditSaved
    }
  }
}

export const resetCustomerFormEditSaved = () => {
  return {
    type: 'customers/RESET_FORM_EDIT_SAVED'
  }
}

export const resetCustomerFormSaved = () => {
  return {
    type: 'customers/RESET_FORM_SAVED'
  }
}

export const getCustomersRequest = () => {
  return {
    type: 'customers/GET_REQUEST'
  }
}

export const getCustomersCpfCnpj = cpf_cnpj => {
  return {
    type: 'customers/GET_CUSTOMER_CPF_CNPJ',
    payload: {cpf_cnpj}
  }
}

export const addCustomerValidate = customer => {
  return {
    type: 'customers/ADD_CUSTOMER_VALIDATE',
    payload: {customer}
  }
}

export const resetCustomerForm = () => {
  return {
    type: 'customers/RESET_FORM'
  }
}

export const resetCustomerFormEdit = () => {
  return {
    type: 'customers/RESET_FORM_EDIT'
  }
}

export const resetCustomerFormEditView = () => {
  return {
    type: 'customers/RESET_FORM_EDIT_VIEW'
  }
}


export const getAllCustomersCpfCnpj = cpf_cnpj => {
  return {
    type: 'customers/GET_ALL_CUSTOMER_CPF_CNPJ',
    payload: {cpf_cnpj}
  }
}

export const getCustomersSuccess = (data, lastPage, total) => {
  return {
    type: 'customers/GET_SUCCESS',
    payload: {
      data,
      lastPage,
      total
    }
  }
}

export const getDataExcel = (dataExcel, missingFields) => {
  return {
    type: 'customers/GET_DATA_EXCEL',
    payload: {
      dataExcel,
      missingFields
    }
  }
}

export const getCustomersSuccessCpfCnpj = (data, tenant) => {
  return {
    type: 'customers/GET_SUCCESS_CPF_CNPJ',
    payload: {
      data,
      tenant
    }
  }
}

export const changeFilter = search => {
  return {
    type: 'customers/CHANGE_FILTER',
    payload: {search}
  }
}

export const applySorting = (column, direction) => {
  return {
    type: 'customers/APPLY_SORTING',
    payload: {column, direction}
  }
}

export const changeCurrentPage = currentPage => {
  return {
    type: 'customers/CHANGE_CURRENT_PAGE',
    payload: {currentPage}
  }
}

export const formSuccess = (customer) => {
  return {
    type: 'customers/FORM_SUCCESS',
    payload: {
      customerRegistered: customer
    }
  }
}

export const formSuccessEdit = (customer) => {
  return {
    type: 'customers/FORM_SUCCESS_EDIT',
    payload: {
      customerRegistered: customer
    }
  }
}

export const formSuccessEditView = (customer) => {
  return {
    type: 'customers/FORM_SUCCESS_EDIT_VIEW',
    payload: {
      customerRegistered: customer
    }
  }
}

export const resetCustomersForm = () => {
  return {
    type: 'customers/RESET_FORM'
  }
}

export const resetDataExcelCustomer = () => {
  return {
    type: 'customers/RESET_DATA_EXCEL'
  }
}

export const addCustomer = customer => {
  return {
    type: 'customers/ADD_CUSTOMER',
    payload: {customer}
  }
}

export const importDataCustomer = file => {
  return {
    type: 'customers/IMPORT_DATA',
    payload: {
      file
    }
  }
}

export const customerCleanError = (errors) => {
  return {
    type: 'customers/CLEAN_ERROR',
    payload: {
      errors
    }
  }
}

export const deleteCustomer = (customerUuid) => {
  return {
    type: 'customers/DELETE_CUSTOMER',
    payload: { customerUuid }
  }
}

export const addExcelError = (messageExcelError) => {
  return {
    type: 'customers/ERROR_EXCEL_MESSAGE',
    payload: {
      messageExcelError
    }
  }
}

export const addCustomerFail = (customer, errors) => {
  return {
    type: 'customers/ADD_CUSTOMER_FAIL',
    payload: {
      customer,
      errors
    }
  }
}

export const addCustomerFailEdit = (customer, errors) => {
  return {
    type: 'customers/ADD_CUSTOMER_FAIL_EDIT',
    payload: {
      customer,
      errors
    }
  }
}

export const addCustomerFailEditView = (customer, errors) => {
  return {
    type: 'customers/ADD_CUSTOMER_FAIL_EDIT_VIEW',
    payload: {
      customer,
      errors
    }
  }
}

export const editCustomer = customer => {
  return {
    type: 'customers/EDIT_CUSTOMER',
    payload: {customer}
  }
}

export const editCustomerView = customer => {
  return {
    type: 'customers/EDIT_CUSTOMER_VIEW',
    payload: {customer}
  }
}

export const perPage = per => {
  return {
    type: 'customers/PER_PAGE',
    payload: {perPage: per}
  }
}
