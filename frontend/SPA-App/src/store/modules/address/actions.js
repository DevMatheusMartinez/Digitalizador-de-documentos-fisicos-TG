export const editAddress = address => {
  return {
    type: 'addresses/EDIT_ADDRESS',
    payload: {address}
  }
}

export const addAddressFail = (address, errors) => {
  return {
    type: 'addresses/ADD_ADDRESS_FAIL',
    payload: {
      address,
      errors
    }
  }
}

export const formSuccess = (address) => {
  return {
    type: 'addresses/FORM_SUCCESS',
    payload: {
      addressEdited: address
    }
  }
}

export const addAddress = (customer, address) => {
  return {
    type: 'addresses/ADD_ADDRESS',
    payload: {
      customer,
      address
    }
  }
}