export const resetContactForm = () => {
  return {
    type: 'contacts/RESET_FORM'
  }
}

export const editContacts = contact => {
  return {
    type: 'contacts/EDIT_CONTACT',
    payload: {contact}
  }
}

export const addContactFail = (contact, errors) => {
  return {
    type: 'contacts/ADD_CONTACT_FAIL',
    payload: {
      contact,
      errors
    }
  }
}

export const formSuccess = (contact) => {
  return {
    type: 'contacts/FORM_SUCCESS',
    payload: {
      contactsEdited: contact
    }
  }
}

export const addContactValidateStep = (contact) => {
  return {
    type: 'contacts/ADD_CONTACT_VALIDATE_STEP',
    payload: {contact}
  }
}