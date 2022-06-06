export const getImportsRequest = () => {
  return {
    type: 'imports/GET_REQUEST'
  }
}

export const getImportsSuccess = (data, lastPage, total) => {
  return {
    type: 'imports/GET_SUCCESS',
    payload: {
      data,
      lastPage,
      total
    }
  }
}

export const changeFilter = search => {
  return {
    type: 'imports/CHANGE_FILTER',
    payload: {search}
  }
}

export const applySorting = (column, direction) => {
  return {
    type: 'imports/APPLY_SORTING',
    payload: {column, direction}
  }
}

export const changeCurrentPage = currentPage => {
  return {
    type: 'imports/CHANGE_CURRENT_PAGE',
    payload: {currentPage}
  }
}

