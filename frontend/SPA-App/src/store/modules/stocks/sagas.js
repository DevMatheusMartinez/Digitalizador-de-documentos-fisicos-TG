import {call, put, all, takeLatest, select} from "redux-saga/effects"
import api from "@src/services/api"

import {getStocksSuccess, addStockFail, formSuccess, resetStockForm} from './actions'

function* getStocks() {
  try {
    const {currentPage, filter, sort, perPage} = yield select(
      state => state.stocks
    )

    const per = perPage ? `&per_page=${perPage.perPage}` : ``

    const search = filter.search ? `&search=${filter.search}` : ``
    const status = filter.status ? `&status=${filter.status}` : ``
    const sorting = sort.column ? `&order=${sort.column}&direction=${sort.direction}` : ``
    const response = yield call(api.get, `/stocks?page=${search ? search : currentPage + search + status + sorting + per}`)
    const stocks = response.data.data
    const {last_page: lastPage, total} = response.data.meta
    yield put(getStocksSuccess(stocks, lastPage, total))
  } catch (err) {
  }
}

function* getStocksPhotos() {
  try {
    const {currentPage, filter, sort, perPage} = yield select(
      state => state.stocks
    )

    const per = perPage ? `&per_page=${perPage.perPage}` : ``

    const search = filter.search ? `&search=${filter.search}` : ``
    const status = filter.status ? `&status=${filter.status}` : ``
    const sorting = sort.column ? `&order=${sort.column}&direction=${sort.direction}` : ``
    const response = yield call(api.get, `/stocks/indexPhotos?page=${search ? search : currentPage + search + status + sorting + per}`)
    const stocks = response.data.data
    const {last_page: lastPage, total} = response.data.meta
    yield put(getStocksSuccess(stocks, lastPage, total))
  } catch (err) {
  }
}

function* editStock(data) {
  try {
    const stock = data.payload.stock
    const response = yield call(api.put, `/stocks/${stock.uuid}`, stock)

    if (response.status === 422) {
      yield put(addStockFail(stock, response.data.errors))
      return
    }

    yield put(formSuccess())
  } catch (err) {
  }
}

function* editStockSite(data) {
  try {
    const stock = data.payload.stock
    const response = yield call(api.put, `/stocks/updateSite/${stock.uuid}`, stock)

    if (response.status === 422) {
      yield put(addStockFail(stock, response.data.errors))
      return
    }

    yield put(formSuccess())
  } catch (err) {
  }
}

function* addStockValidate(data) {
  try {
    const stock = data.payload.stock
    const response = yield call(api.post, `/stocks/validate/${stock.uuid}`, stock)
    if (response.status === 422) {
      yield put(addStockFail(stock, response.data.errors))
      return
    }

    yield put(resetStockForm())

  } catch (err) {

  }
}

export default all([
  takeLatest('stocks/GET_REQUEST_PHOTOS', getStocksPhotos),
  takeLatest('stocks/GET_REQUEST', getStocks),
  takeLatest('stocks/ADD_STOCK_VALIDATE', addStockValidate),
  takeLatest('stocks/EDIT_STOCK', editStock),
  takeLatest('stocks/EDIT_STOCK_SITE', editStockSite)
])
