export const editBank = bank => {
  return {
    type: 'banks/EDIT_BANK',
    payload: {bank}
  }
}

export const addBankFail = (bank, errors) => {
  return {
    type: 'banks/ADD_BANK_FAIL',
    payload: {
      bank,
      errors
    }
  }
}

export const formSuccess = (bank) => {
  return {
    type: 'banks/FORM_SUCCESS',
    payload: {
      bankEdited: bank
    }
  }
}
  