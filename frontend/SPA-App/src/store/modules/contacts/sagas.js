import { call, put, all, takeLatest } from "redux-saga/effects"
import api from "../../../services/api"
import { formSuccess, addContactFail } from './actions'

function* editContact(data) {
  try {
    const contact = data.payload.contact

    const response = yield call(api.put, `/contacts/${contact.uuid}`, contact)

    if (response.status === 422) {
      yield put(addContactFail(contact, response.data.errors))
      return
    }

    yield put(formSuccess(response.data.data))

  } catch (err) {
  }
}

function* addContactValidateStep(data) {
  try {
    const contact = data.payload.contact

    const response = yield call(api.put, `/contacts/validateStep`, contact)

    if (response.status === 422) {
      yield put(addContactFail(contact, response.data.errors))
      return
    }

    yield put(formSuccess())
  } catch (err) {
  }
}

export default all([
  takeLatest('contacts/EDIT_CONTACT', editContact),
  takeLatest('contacts/ADD_CONTACT_VALIDATE_STEP', addContactValidateStep)
])