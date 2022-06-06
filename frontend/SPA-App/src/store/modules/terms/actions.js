export const getTermsRequest = () => {
  return {
    type: 'terms/GET_REQUEST'
  }
}

export const getTermsRequestList = () => {
  return {
    type: 'terms/GET_REQUEST_LIST'
  }
}

export const getTermsSuccess = (data) => {
  return {
    type: 'terms/GET_SUCCESS',
    payload: {
      data
    }
  }
}

export const getTermsSuccessList = (data, lastPage, total) => {
  return {
    type: 'terms/GET_SUCCESS_LIST',
    payload: {
      data,
      lastPage,
      total
    }
  }
}

export const changeFilter = search => {
  return {
    type: 'terms/CHANGE_FILTER',
    payload: {search}
  }
}

export const applySorting = (column, direction) => {
  return {
    type: 'terms/APPLY_SORTING',
    payload: {column, direction}
  }
}

export const changeCurrentPage = currentPage => {
  return {
    type: 'terms/CHANGE_CURRENT_PAGE',
    payload: {currentPage}
  }
}

export const formSuccess = () => {
  return {
    type: 'terms/FORM_SUCCESS'
  }
}

export const resetTermsForm = () => {
  return {
    type: 'terms/RESET_FORM'
  }
}


export const termCleanError = (errors) => {
  return {
    type: 'terms/CLEAN_ERROR',
    payload: {
      errors
    }
  }
}


export const addTermFail = (term, errors) => {
  return {
    type: 'terms/ADD_TERM_FAIL',
    payload: {
      term,
      errors
    }
  }
}

export const editTerm = term => {
  return {
    type: 'terms/EDIT_TERM',
    payload: {term}
  }
}

export const addTerm = term => {
  return {
    type: 'terms/ADD_TERM',
    payload: {term}
  }
}

export const deleteTerm = (termUuid) => {
  return {
    type: 'terms/DELETE_TERM',
    payload: { termUuid }
  }
}

