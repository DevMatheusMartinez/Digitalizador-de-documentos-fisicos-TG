export const changeRole = role => {
  return dispatch => dispatch({type: "CHANGE_ROLE", userRole: role})
}

export const loginCleanError = () => {
  return {
    type: 'login/CLEAN_ERROR'
  }
}

export const getLoggedUser = () => {
  return {
    type: 'auth/GET_LOGGED_USER'
  }
}

export const getLoggedUserSuccess = loggedUser => {
  return {
    type: 'auth/GET_LOGGED_USER_SUCCESS',
    payload: {
      loggedUser
    }
  }
}

export const getTenantsLogged = (tenants) => {
  return {
    type: 'login/GET_TENANTS',
    payload: {
      tenants
    }
  }
}

export const addLoginFail = (errors) => {
  return {
    type: 'login/ADD_LOGIN_FAIL',
    payload: {
      errors
    }
  }
}

export const addLoginSuccess = (loginSuccess) => {
  return {
    type: 'login/LOGIN_SUCCESS',
    payload: {
      loginSuccess
    }
  }
}

export const addLoginFirstAcessSuccess = (loginFirstAcessSucess) => {
  return {
    type: 'login/LOGIN_FIRST_ACESS_SUCCESS',
    payload: {
      loginFirstAcessSucess
    }
  }
}

export const submitLogin = (email, password, selectedTenant) => {
  return {
    type: 'login/SUBMIT_LOGIN',
    payload: {
      email, 
      password,
      selectedTenant
    }
  }
}