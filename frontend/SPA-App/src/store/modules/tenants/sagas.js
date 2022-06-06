import { call, put, all, takeLatest, select } from "redux-saga/effects"
import api from "@src/services/api"

import { addTenantFail, getTenantSuccessCnpj, formSuccess, resetTenantForm, formSuccessSteps, addTenantUuid } from './actions'

function* getTenantCnpj() {
  try {
    const { cnpj } = yield select(
      state => state.tenants
    )

    const Cnpj = cnpj.replace("/", "x")
    const response = yield call(api.get, `/tenants/tenant/${Cnpj}`)
    const tenant = response.data.data
    yield put(getTenantSuccessCnpj(tenant))
  } catch (err) {
  }
}

function* addTenant(data) {
  try {
    const tenant = data.payload.tenant
    const response = yield call(api.post, `/tenants`, tenant)

    if (response.status === 422) {
      yield put(addTenantFail(tenant, response.data.errors))
      return
    }

    yield put(addTenantUuid(response.data.data.uuid))
    yield put(formSuccessSteps())
  } catch (err) {
  }
}

function* editTenant(data) {
  try {
    const tenant = data.payload.tenant
    const response = yield call(api.put, `/tenants/${tenant.uuid}`, tenant)

    if (response.status === 422) {
      yield put(addTenantFail(tenant, response.data.errors))
      return
    }

    yield put(formSuccess())

  } catch (err) {

  }
}

function* addTenantValidate(data) {
  try {
    const tenant = data.payload.tenant

    const response = yield call(api.put, `/tenants/validate/`, tenant)

    if (response.status === 422) {
      yield put(addTenantFail(tenant, response.data.errors))
      return
    }

    yield put(formSuccess())
  } catch (err) {
  }
}

export default all([
  takeLatest('tenants/EDIT_TENANT', editTenant),
  takeLatest('tenants/GET_TENANT_CNPJ', getTenantCnpj),
  takeLatest('tenants/ADD_TENANT', addTenant),
  takeLatest('tenants/ADD_TENANT_VALIDATE', addTenantValidate)
])
