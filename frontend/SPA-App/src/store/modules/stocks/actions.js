export const getStocksRequest = () => {
  return {
    type: 'stocks/GET_REQUEST'
  }
}

export const getStocksPhotosRequest = () => {
  return {
    type: 'stocks/GET_REQUEST_PHOTOS'
  }
}

export const getStocksSuccess = (data, lastPage, total) => {
  return {
    type: 'stocks/GET_SUCCESS',
    payload: {
      data,
      lastPage,
      total
    }
  }
}

export const editStock = (stock) => {
  return {
    type: 'stocks/EDIT_STOCK',
    payload: {
      stock
    }
  }
}

export const editStockSite = (stock) => {
  return {
    type: 'stocks/EDIT_STOCK_SITE',
    payload: {
      stock
    }
  }
}

export const resetStockForm = () => {
  return {
    type: 'stocks/RESET_FORM'
  }
}

export const addStockFail = (stock, errors) => {
  return {
    type: 'stocks/ADD_STOCK_FAIL',
    payload: {
      stock,
      errors
    }
  }
}

export const formSuccess = (stock = null) => {
  return {
    type: 'stocks/FORM_SUCCESS',
    stock
  }
}

export const addStockValidate = stock => {
  return {
    type: 'stocks/ADD_STOCK_VALIDATE',
    payload: {stock}
  }
}

export const changeCurrentPage = currentPage => {
  return {
    type: 'stocks/CHANGE_CURRENT_PAGE',
    payload: {currentPage}
  }
}

export const changeFilter = search => {
  return {
    type: 'stocks/CHANGE_FILTER',
    payload: {search}
  }
}

export const changeFilterStatus = status => {
  return {
    type: 'stocks/CHANGE_FILTER_STATUS',
    payload: {status}
  }
}