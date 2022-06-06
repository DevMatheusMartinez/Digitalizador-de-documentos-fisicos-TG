export const getUsersRequest = () => {
  return {
    type: 'users/GET_REQUEST'
  }
}

export const getLoggedTenant = () => {
  return {
    type: 'users/GET_LOGGED_TENANT'
  }
}

export const getPermissions = () => {
  return {
    type: 'users/GET_PERMISSIONS'
  }
}

export const getLoggedTenantSuccess = (data) => {
  return {
    type: 'users/GET_LOGGED_TENANT_SUCCESS',
    payload: {
      data
    }
  }
}

export const getPermissionsSuccess = (permissions) => {
  return {
    type: 'users/GET_PERMISSIONS_SUCCESS',
    payload: {
      permissions
    }
  }
}

export const getUsersSuccess = (data, lastPage, total) => {
  return {
    type: 'users/GET_SUCCESS',
    payload: {
      data,
      lastPage,
      total
    }
  }
}

export const addUserSavedEdit = (userSavedEdit) => {
  return {
    type: 'users/USER_SAVED_EDIT',
    payload: {
      userSavedEdit
    }
  }
}

export const addUserSaved = (userSaved) => {
  return {
    type: 'users/USER_SAVED',
    payload: {
      userSaved
    }
  }
}

export const addPermissionsSaved = (permissionsSaved) => {
  return {
    type: 'users/PERMISSIONS_SAVED',
    payload: {
      permissionsSaved
    }
  }
}

export const addPermissionsEditSaved = (permissionsEditSaved) => {
  return {
    type: 'users/PERMISSIONS_EDIT_SAVED',
    payload: {
      permissionsEditSaved
    }
  }
}

export const addContactSaved = (contactSaved) => {
  return {
    type: 'users/CONTACT_SAVED',
    payload: {
      contactSaved
    }
  }
}

export const addContactSavedEdit = (contactSavedEdit) => {
  return {
    type: 'users/CONTACT_SAVED_EDIT',
    payload: {
      contactSavedEdit
    }
  }
}

export const addAddressSaved = (addressSaved) => {
  return {
    type: 'users/ADDRESS_SAVED',
    payload: {
      addressSaved
    }
  }
}

export const addAddressSavedEdit = (addressSavedEdit) => {
  return {
    type: 'users/ADDRESS_SAVED_EDIT',
    payload: {
      addressSavedEdit
    }
  }
}

export const getUserUuidSuccess = (user) => {
  return {
    type: 'users/GET_USER_UUID_SUCCESS',
    payload: {
      user
    }
  }
}

export const changeFilter = search => {
  return {
    type: 'users/CHANGE_FILTER',
    payload: { search }
  }
}

export const saveSearchBeforeUnmouting = search => {
  return {
    type: 'users/SAVE_SEARCH_BEFORE_UNMOUTING',
    payload: { search }
  }
}

export const saveOpenFormBeforeUnmouting = (openForm, user, active) => {
  return {
    type: 'users/SAVE_OPEN_FORM_BEFORE_UNMOUTING',
    payload: {
      openForm,
      user,
      active
    }
  }
}

export const getUserUuid = userUuid => {
  return {
    type: 'users/GET_USER_UUID',
    payload: { userUuid }
  }
}

export const deleteUser = (userUuid) => {
  return {
    type: 'users/DELETE_USER',
    payload: { userUuid }
  }
}

export const applySorting = (column, direction) => {
  return {
    type: 'users/APPLY_SORTING',
    payload: { column, direction }
  }
}

export const changeCurrentPage = currentPage => {
  return {
    type: 'users/CHANGE_CURRENT_PAGE',
    payload: { currentPage }
  }
}

export const addUser = user => {
  return {
    type: 'users/ADD_USER',
    payload: { user }
  }
}

export const addUserValidate = user => {
  return {
    type: 'users/ADD_USER_VALIDATE',
    payload: { user }
  }
}

export const addUserValidateStep = (user) => {
  return {
    type: 'users/ADD_USER_VALIDATE_STEP',
    payload: { user }
  }
}

export const addUserFail = (user, errors) => {
  return {
    type: 'users/ADD_USER_FAIL',
    payload: {
      user,
      errors
    }
  }
}

export const addUserFailEdit = (user, errors) => {
  return {
    type: 'users/ADD_USER_FAIL_EDIT',
    payload: {
      user,
      errors
    }
  }
}

export const addUserFailEditView = (user, errors) => {
  return {
    type: 'users/ADD_USER_FAIL_EDIT_VIEW',
    payload: {
      user,
      errors
    }
  }
}


export const userCleanError = (errors) => {
  return {
    type: 'users/CLEAN_ERROR',
    payload: {
      errors
    }
  }
}

export const formSuccess = () => {
  return {
    type: 'users/FORM_SUCCESS'
  }
}

export const formSuccessEdit = () => {
  return {
    type: 'users/FORM_SUCCESS_EDIT'
  }
}

export const formSuccessEditView = () => {
  return {
    type: 'users/FORM_SUCCESS_EDIT_VIEW'
  }
}

export const resetUserForm = () => {
  return {
    type: 'users/RESET_FORM'
  }
}

export const resetUserFormEdit = () => {
  return {
    type: 'users/RESET_FORM_EDIT'
  }
}

export const resetUserFormEditView = () => {
  return {
    type: 'users/RESET_FORM_EDIT_VIEW'
  }
}

export const resetUserFormSaved = () => {
  return {
    type: 'users/RESET_FORM_SAVED'
  }
}

export const resetUserFormEditSaved = () => {
  return {
    type: 'users/RESET_FORM_EDIT_SAVED'
  }
}

export const editUser = user => {
  return {
    type: 'users/EDIT_USER',
    payload: { user }
  }
}

export const editUserView = user => {
  return {
    type: 'users/EDIT_USER_VIEW',
    payload: { user }
  }
}

export const editLittleUser = (user) => {
  return {
    type: 'users/EDIT_USER_LITTLE',
    payload: { user }
  }
}

export const editPasswordInitial = user => {
  return {
    type: 'users/EDIT_PASSWORD_INITIAL',
    payload: { user }
  }
}

export const forgotPassword = email => {
  return {
    type: 'users/FORGOT_PASSWORD',
    payload: { email }
  }
}

