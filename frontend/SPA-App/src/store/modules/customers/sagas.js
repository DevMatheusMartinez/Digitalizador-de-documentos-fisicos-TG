import { call, put, all, takeLatest, select } from "redux-saga/effects"
import api from "../../../services/api"

import {
  getCustomersSuccess,
  getCustomersSuccessCpfCnpj,
  formSuccess,
  addCustomerFail,
  getDataExcel,
  resetCustomerForm,
  addCustomerFailEdit,
  formSuccessEdit,
  addCustomerFailEditView,
  formSuccessEditView,
  resetCustomerFormEditView
} from './actions'

function* getCustomers() {
  try {
    const { currentPage, filter, sort, perPage } = yield select(
      state => state.customers
    )

    const per = perPage ? `&per_page=${perPage.perPage}` : ``

    const search = filter.search ? `&search=${filter.search}` : ``
    const sorting = sort.column ? `&order=${sort.column}&direction=${sort.direction}` : ``
    const response = yield call(api.get, `/customers?page=${search ? search : currentPage + search + sorting + per}`)
    const customers = response.data.data
    const { last_page: lastPage, total } = response.data.meta
    yield put(getCustomersSuccess(customers, lastPage, total))
  } catch (err) {
  }
}

function* addCustomer(data) {
  try {
    const customer = data.payload.customer

    const response = yield call(api.post, `/customers`, customer)


    if (response.status === 422) {
      yield put(addCustomerFail(customer, response.data.errors))
      return
    }

    yield put(formSuccess(response.data.data))
  } catch (err) {
  }
}

function* importData(file) {
  try {
    const fData = new FormData()
    fData.append('import', file.payload.file)

    const response = yield call(api.post, '/customers/importData', fData)

    if (response.status === 422) {
      return
    }

    yield put(getDataExcel(response.data, ('fieldsRequired' in response.data)))

  } catch (err) {

  }
}

function* getCustomerCpfCnpj() {
  try {
    const { cpf_cnpj } = yield select(
      state => state.customers
    )

    const CpfCnpj = cpf_cnpj.replace("/", "x")

    const response = yield call(api.get, `customers/cpfcnpj/${CpfCnpj}`)
    const customer = response.data.data
    yield put(getCustomersSuccessCpfCnpj(customer))
  } catch (err) {

  }
}

function* getAllCustomerCpfCnpj() {
  try {
    const { cpf_cnpj } = yield select(
      state => state.customers
    )

    const CpfCnpj = cpf_cnpj.replace("/", "x")

    const response = yield call(api.get, `customers/cpfcnpj/all/${CpfCnpj}`)
    const customer = response.data[0]
    const tenant = response.data[1]
    yield put(getCustomersSuccessCpfCnpj(customer, tenant))
  } catch (err) {

  }
}

function* editCustomer(data) {
  try {
    const customer = data.payload.customer

    const response = yield call(api.put, `/customers/${customer.uuid}`, customer)

    if (response.status === 422) {
      yield put(addCustomerFailEdit(customer, response.data.errors))
      return
    }

    yield put(formSuccessEdit(response.data.data))

  } catch (err) {
  }
}

function* editCustomerView(data) {
  try {
    const customer = data.payload.customer

    const response = yield call(api.put, `/customers/${customer.uuid}`, customer)

    if (response.status === 422) {
      yield put(addCustomerFailEditView(customer, response.data.errors))
      return
    }

    yield put(formSuccessEditView(response.data.data))

  } catch (err) {
  }
}

function* deleteCustomer() {
  try {
    const { customerUuid } = yield select(state => state.customers)

    yield call(api.delete, `/customers/${customerUuid}`)
  } catch (err) {
  }
}

function* addCustomerValidate(data) {
  try {
    const customer = data.payload.customer
    const response = yield call(api.post, `/customers/validate/${customer.uuid}`, customer)
    if (response.status === 422) {
      yield put(addCustomerFailEditView(customer, response.data.errors))
      return
    }

    yield put(resetCustomerFormEditView())

  } catch (err) {
  }
}

export default all([
  takeLatest('customers/EDIT_CUSTOMER_VIEW', editCustomerView),
  takeLatest('customers/ADD_CUSTOMER_VALIDATE', addCustomerValidate),
  takeLatest('customers/GET_ALL_CUSTOMER_CPF_CNPJ', getAllCustomerCpfCnpj),
  takeLatest('customers/DELETE_CUSTOMER', deleteCustomer),
  takeLatest('customers/GET_REQUEST', getCustomers),
  takeLatest('customers/ADD_CUSTOMER', addCustomer),
  takeLatest('customers/GET_CUSTOMER_CPF_CNPJ', getCustomerCpfCnpj),
  takeLatest('customers/EDIT_CUSTOMER', editCustomer),
  takeLatest('customers/IMPORT_DATA', importData)
])
