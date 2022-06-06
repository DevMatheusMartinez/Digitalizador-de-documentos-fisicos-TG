import {call, put, all, takeLatest, select} from "redux-saga/effects"
import api from "@src/services/api"

import {getImportsSuccess} from './actions'

function* getImports() {
  try {
    const {currentPage, filter, sort, perPage} = yield select(
      state => state.imports
    )

    const per = perPage ? `&per_page=${perPage.perPage}` : ``

    const search = filter.search ? `&search=${filter.search}` : ``
    const sorting = sort.column ? `&order=${sort.column}&direction=${sort.direction}` : ``
    const response = yield call(api.get, `/imports?page=${search ? search : currentPage + search + sorting + per}`)
    const imports = response.data.data
    const {last_page: lastPage, total} = response.data.meta
    yield put(getImportsSuccess(imports, lastPage, total))
  } catch (err) {
  }
}

export default all([takeLatest('imports/GET_REQUEST', getImports)])
