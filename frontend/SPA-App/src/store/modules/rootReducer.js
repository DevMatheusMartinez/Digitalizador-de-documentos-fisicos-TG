// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import navbar from './navbar/reducer'
import layout from './layout/reducer'
import customers from './customers/reducer'
import users from './users/reducer'
import customizer from './customizer/reducer'
import auth from './auth/reducer'
import contracts from './contracts/reducer'
import vehicles from './vehicles/reducer'
import tenants from './tenants/reducer'
import terms from './terms/reducer'
import imports from './imports/reducer'
import stocks from './stocks/reducer'
import addresses from './address/reducer'
import incomes from './incomes/reducer'
import contacts from './contacts/reducer'
import banks from './banks/reducer'

export default combineReducers({
  navbar,
  layout,
  terms,
  contracts,
  customers,
  vehicles,
  users,
  customizer,
  tenants,
  auth,
  imports,
  stocks,
  addresses,
  incomes,
  contacts,
  banks
})
