import { call, put, all, takeLatest, select } from "redux-saga/effects"
import api from "@src/services/api"
import { getLoggedUserSuccess, getTenantsLogged, addLoginFail, addLoginSuccess, addLoginFirstAcessSuccess } from './actions'

function* getLoggedUser() {
  try {
    const response = yield call(api.get, `/users/userLogged`)
    const loggedUser = response.data.data

    yield put(getLoggedUserSuccess(loggedUser))
  } catch (err) {
  }
}

function* submitLogin() {
  try {
    const { userLogging } = yield select(
      state => state.auth
    )

    const response = yield call(api.post, '/login',
      {
        email: userLogging.email,
        password: userLogging.password,
        selectedTenant: userLogging.selectedTenant
      })

    const tenants = response.data.tenants

    if (response.status === 422 || response.status === 401) {
      yield put(addLoginFail(true))
    }

    if (tenants !== undefined) {
      yield put(getTenantsLogged(tenants))
    }

    if (response.data.logged_tenant_uuid || response.data.support) {
      localStorage.setItem("@masterrevenda-app:token", `${response.data.access_token}`)
      api.get('/users/userLogged').then(
        response => {
          if (response.data.data.firstAccess) {
            put(addLoginFirstAcessSuccess(true))
          }
        }
      )
      yield put(addLoginSuccess(true))
    }
  } catch (err) {
  }
}

export default all([
  takeLatest('auth/GET_LOGGED_USER', getLoggedUser),
  takeLatest('login/SUBMIT_LOGIN', submitLogin)
])
