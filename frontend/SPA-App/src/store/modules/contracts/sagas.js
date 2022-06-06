import { call, put, all, takeLatest, select } from "redux-saga/effects"
import api from "@src/services/api"

import {
  formSuccess,
  addContractFail,
  getContractsSuccess,
  resetContractsForm,
  addContractUuidSuccess,
  formSuccessEditView,
  formSuccessEdit,
  addContractFailEdit,
  addContractFailEditView,
  resetContractsFormEditView
} from './actions'

function* getContracts() {
  try {
    const { currentPage, filter, sort, filterType } = yield select(
      state => state.contracts
    )

    const search = filter.search ? `&search=${filter.search}` : ``

    const type = filterType.type ? `&type=${filterType.type}` : ``

    const sorting = sort.column ? `&order=${sort.column}$direction=${sort.direction}` : ``
    const response = yield call(api.get, `/sales?page=${search ? search : currentPage + search + sorting + type}`)
    const contracts = response.data.data
    const { last_page: lastPage, total } = response.data.meta
    yield put(getContractsSuccess(contracts, lastPage, total))
  } catch (err) {
  }
}

function* addContract(data) {
  try {
    const contract = data.payload.contract

    const response = yield call(api.post, '/sales', contract)
    if (response.status === 422) {
      yield put(addContractFail(contract, response.data.errors))
      return
    }

    yield put(addContractUuidSuccess(response.data.data.uuid))
    yield put(formSuccess())

  } catch (err) {
  }
}

function* editContract(data) {
  try {
    const contract = data.payload.contract

    const response = yield call(api.put, `/sales/${contract.uuid}`, contract)
    if (response.status === 422) {
      yield put(addContractFailEdit(contract, response.data.errors))
      return
    }

    yield put(formSuccessEdit())
  } catch (err) {
  }
}

function* editContractView(data) {
  try {
    const contract = data.payload.contract

    const response = yield call(api.put, `/sales/${contract.uuid}`, contract)
    if (response.status === 422) {
      yield put(addContractFailEditView(contract, response.data.errors))
      return
    }
    
    yield put(formSuccessEditView())
  } catch (err) {
  }
}

function* deleteContract() {
  try {
    const { contractUuid } = yield select(
      state => state.contracts
    )

    yield call(api.delete, `/sales/${contractUuid}`)
  } catch (err) {
  }
}

function* addContractValidate(data) {
  try {
    const contract = data.payload.contract

    const response = yield call(api.post, `/sales/validate/${contract.uuid}`, contract)
    if (response.status === 422) {
      yield put(addContractFailEditView(contract, response.data.errors))
      return
    }

    yield put(resetContractsFormEditView())

  } catch (err) {
  }
}

export default all([
  takeLatest('contracts/EDIT_CONTRACT_VIEW', editContractView),
  takeLatest('contracts/GET_REQUEST', getContracts),
  takeLatest('contracts/DELETE_CONTRACT', deleteContract),
  takeLatest('contracts/ADD_CONTRACT', addContract),
  takeLatest('contracts/EDIT_CONTRACT', editContract),
  takeLatest('contracts/ADD_CONTRACT_VALIDATE', addContractValidate)
])
