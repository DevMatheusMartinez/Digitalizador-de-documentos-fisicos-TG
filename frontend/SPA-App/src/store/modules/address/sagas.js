import {call, put, all, takeLatest} from "redux-saga/effects"
import api from "../../../services/api"
import {formSuccess, addAddressFail} from './actions'

function* editAddress(data) {
  try {
    const address = data.payload.address

    const response = yield call(api.put, `/address/${address.uuid}`, address)

    if (response.status === 422) {
      yield put(addAddressFail(address, response.data.errors))
      return
    }

    yield put(formSuccess(response.data.data))

  } catch (err) {
  }
}

function* addAddress(data) {
  try {
    const address = data.payload.address
    const customer = data.payload.customer

    const response = yield call(api.post, `/address/${customer.uuid}`, address)

    if (response.status === 422) {
      yield put(addAddressFail(address, response.data.errors))
      return
    }

    yield put(formSuccess(response.data.data))
  } catch (err) {

  }
}

export default all([
  takeLatest('addresses/EDIT_ADDRESS', editAddress),
  takeLatest('addresses/ADD_ADDRESS', addAddress)
])