import {call, put, all, takeLatest, select} from "redux-saga/effects"
import api from "@src/services/api"

import {addTermFail, getTermsSuccess, formSuccess} from './actions'

function* getTerms() {
  try {
    const response = yield call(api.get, `/terms`)
    const terms = response.data.data

    const termList = []

    terms.forEach(element => {
      termList.push({value: element, label: element.title})
    })

    yield put(getTermsSuccess(termList))

  } catch (err) {
  }
}

function* deleteTerm() {
  try {
    const {termUuid} = yield select(
      state => state.terms
    )

    yield call(api.delete, `/terms/${termUuid}`)
  } catch (err) {
  }
}


function* getTermsList() {
  try {
    const {currentPage, filter, sort, perPage} = yield select(
      state => state.terms
    )

    const per = perPage ? `per_page=${perPage.perPage}` : ``

    const search = filter.search ? `&search=${filter.search}` : ``

    const sorting = sort.column ? `&order=${sort.column}&direction=${sort.direction}` : ``

    const response = yield call(api.get, `/terms?page=${search ? search : currentPage + search + sorting + per}`)
    const terms = response.data.data
    const {last_page: lastPage, total} = response.data.meta
    yield put(getTermsSuccess(terms, lastPage, total))
  } catch (err) {
  }
}

function* AddTerm(data) {
  try {
    const term = data.payload.term
    const response = yield call(api.post, '/terms', term)

    if (response.status === 422) {
      yield put(addTermFail(term, response.data.errors))
      return
    }

    yield put(formSuccess())
  } catch (err) {
  }
}

function* EditTerm(data) {
  try {
    const term = data.payload.term
    const response = yield call(api.put, `/terms/${term.uuid}`, term)
    if (response.status === 422) {
      yield put(addTermFail(term, response.data.errors))
      return
    }
    yield put(formSuccess())
  } catch (err) {

  }
}

export default all([
  takeLatest('terms/GET_REQUEST', getTerms),
  takeLatest('terms/GET_REQUEST_LIST', getTermsList),
  takeLatest('terms/ADD_TERM', AddTerm),
  takeLatest('terms/DELETE_TERM', deleteTerm),
  takeLatest('terms/EDIT_TERM', EditTerm)
])
