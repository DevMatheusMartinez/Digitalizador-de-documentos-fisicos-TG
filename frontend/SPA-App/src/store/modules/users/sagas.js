import {call, put, all, takeLatest, select} from "redux-saga/effects"
import api from "@src/services/api"

import {
  addUserFail,
  formSuccess,
  getUsersSuccess,
  getPermissionsSuccess,
  getUserUuidSuccess,
  resetUserForm,
  formSuccessEdit,
  addUserFailEdit,
  addUserFailEditView,
  formSuccessEditView,
  resetUserFormEditView
} from './actions'

function* getUsers() {
  try {
    const {currentPage, filter, sort} = yield select(
      state => state.users
    )
    const search = filter.search ? `&search=${filter.search}` : ``
    const sorting = sort.column ? `&order=${sort.column}&direction=${sort.direction}` : ``
    const response = yield call(api.get, `/users?page=${search ? search : currentPage + search + sorting}`)
    const users = response.data.data
    const {last_page: lastPage, total} = response.data.meta
    yield put(getUsersSuccess(users, lastPage, total))
  } catch (err) {
  }
}

function* getUser() {
  try {
    const {userUuid} = yield select(
      state => state.users
    )

    const response = yield call(api.get, `/users/${userUuid}`)

    yield put(getUserUuidSuccess(response.data.data))
  } catch (err) {

  }
}

function* deleteUser() {
  try {
    const {userUuid} = yield select(
      state => state.users
    )

    yield call(api.delete, `/users/${userUuid}`)
  } catch (err) {
  }
}

function* getPermissions() {
  try {
    const response = yield call(api.get, `/users/permissions`)
    yield put(getPermissionsSuccess(response.data.data))
  } catch (err) {

  }
}

function* addUser(data) {
  try {
    const user = data.payload.user
    const response = yield call(api.post, `/users`, user)

    if (response.status === 422) {
      yield put(addUserFail(user, response.data.errors))
      return
    }

    yield put(formSuccess())
  } catch (err) {
  }
}

function* addUserValidate(data) {
  try {
    const user = data.payload.user
    const response = yield call(api.post, `/users/validate/${user.uuid}`, user)

    if (response.status === 422) {
      yield put(addUserFailEditView(user, response.data.errors))
      return
    }

    yield put(resetUserFormEditView())

  } catch (err) {
  }
}

function* addUserValidateStep(data) {
  try {
    const user = data.payload.user

    const response = yield call(api.put, `/users/validateStep`, user)

    if (response.status === 422) {
      yield put(addUserFail(user, response.data.errors))
      return
    }

    yield put(formSuccess())
  } catch (err) {
  }
}

function* editUser(data) {
  try {
    const user = data.payload.user
    const response = yield call(api.put, `/users/${user.uuid}`, user)

    if (response.status === 422) {
      yield put(addUserFailEdit(user, response.data.errors))
      return
    }

    yield put(formSuccessEdit())
  } catch (err) {
  }
}

function* editUserView(data) {
  try {
    const user = data.payload.user
    const response = yield call(api.put, `/users/${user.uuid}`, user)

    if (response.status === 422) {
      yield put(addUserFailEditView(user, response.data.errors))
      return
    }

    yield put(formSuccessEditView())
  } catch (err) {
  }
}

function* editLittleUser(data) {
  try {
    const user = data.payload.user
    const response = yield call(api.put, `/users/littleEdit/${user.uuid}`, user)

    if (response.status === 422) {
      yield put(addUserFail(user, response.data.errors))
      return
    }

    yield put(formSuccess())
  } catch (err) {
  }
}

function* editPassword(data) {
  try {
    const user = data.payload.user
    const response = yield call(api.put, `users/passwordReset/${user.uuid}`, user)

    if (response.status === 422) {
      yield put(addUserFail(user, response.data.errors))
      return
    }
    yield put(formSuccess())
  } catch (err) {
  }
}

export default all([
  takeLatest('users/EDIT_USER_VIEW', editUserView),
  takeLatest('users/ADD_USER_VALIDATE', addUserValidate),
  takeLatest('users/DELETE_USER', deleteUser),
  takeLatest('users/GET_USER_UUID', getUser),
  takeLatest('users/GET_PERMISSIONS', getPermissions),
  takeLatest('users/EDIT_USER_LITTLE', editLittleUser),
  takeLatest('users/GET_REQUEST', getUsers),
  takeLatest('users/ADD_USER', addUser),
  takeLatest('users/EDIT_USER', editUser),
  takeLatest('users/EDIT_PASSWORD_INITIAL', editPassword),
  takeLatest('users/ADD_USER_VALIDATE_STEP', addUserValidateStep)
])
