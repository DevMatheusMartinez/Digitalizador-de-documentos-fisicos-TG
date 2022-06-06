
import { all } from 'redux-saga/effects'

import customers from './customers/sagas'
import users from './users/sagas'
import contracts from './contracts/sagas'
import vehicles from './vehicles/sagas'
import tenants from './tenants/sagas'
import terms from './terms/sagas'
import auth from './auth/sagas'
import imports from './imports/sagas'
import stocks from './stocks/sagas'
import addresses from './address/sagas'
import incomes from './incomes/sagas'
import contacts from './contacts/sagas'
import banks from './banks/sagas'
import navbar from './navbar/sagas'

export default function* rootSaga() {
  return yield all([
    navbar,
    terms,
    customers,
    users,
    vehicles,
    contracts,
    tenants,
    auth,
    imports,
    stocks,
    addresses,
    incomes,
    contacts,
    banks
  ])
}
