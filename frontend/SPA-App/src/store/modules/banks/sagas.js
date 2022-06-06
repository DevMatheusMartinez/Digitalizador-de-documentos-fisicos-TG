import {call, put, all, takeLatest} from "redux-saga/effects"
import api from "../../../services/api"
import {formSuccess, addBankFail} from './actions'

function* editBank(data) {
  try {
    const bank = data.payload.bank

    const response = yield call(api.put, `/banks/${bank.uuid}`, bank)

    if (response.status === 422) {
      yield put(addBankFail(bank, response.data.errors))
      return
    }

    yield put(formSuccess(response.data.data))

  } catch (err) {
  }
}

export default all([takeLatest('banks/EDIT_BANK', editBank)])