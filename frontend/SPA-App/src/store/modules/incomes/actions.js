export const editIncomes = incomes => {
  return {
    type: 'incomes/EDIT_INCOMES',
    payload: {incomes}
  }
}

export const addIncomesFail = (incomes, errors) => {
  return {
    type: 'incomes/ADD_INCOMES_FAIL',
    payload: {
      incomes,
      errors
    }
  }
}

export const formSuccess = (incomes) => {
  return {
    type: 'incomes/FORM_SUCCESS',
    payload: {
      incomesEdited: incomes
    }
  }
}