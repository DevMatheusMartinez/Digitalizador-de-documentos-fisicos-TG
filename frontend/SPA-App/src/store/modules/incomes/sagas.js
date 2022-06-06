import {call, put, all, takeLatest} from "redux-saga/effects"
import api from "@src/services/api"
import {formSuccess, addIncomesFail} from './actions'

function* editIncomes(data) {
  try {
    const incomes = data.payload.incomes

    const response = yield call(api.put, `/incomes/${incomes.uuid}`, incomes)

    if (response.status === 422) {
      yield put(addIncomesFail(incomes, response.data.errors))
      return
    }

    yield put(formSuccess(response.data.data))

  } catch (err) {
  }
}

export default all([takeLatest('incomes/EDIT_INCOMES', editIncomes)])
