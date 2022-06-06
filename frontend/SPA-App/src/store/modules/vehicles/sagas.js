import { call, put, all, takeLatest, select } from "redux-saga/effects"
import api from "@src/services/api"

import {
  addVehicleFail,
  getDataExcel,
  getVehiclesSuccess,
  getVehicleSuccessBoard,
  formSuccess,
  formSuccessEdit,
  addVehicleFailEdit,
  addVehicleFailEditView,
  resetVehicleFormEditView,
  formSuccessEditView
} from './actions'

function* getVehicles() {
  try {
    const { currentPage, filter, sort, perPage } = yield select(
      state => state.vehicles
    )

    const per = perPage ? `&per_page=${perPage.perPage}` : ``

    const search = filter.search ? `&search=${filter.search}` : ``
    const sorting = sort.column ? `&order=${sort.column}&direction=${sort.direction}` : ``
    const response = yield call(api.get, `/files?page=${search ? search : currentPage + search + sorting + per}`)
    const vehicles = response.data.data
    const { last_page: lastPage, total } = response.data.meta
    yield put(getVehiclesSuccess(vehicles, lastPage, total))
  } catch (err) {
  }
}

function* addVehicle(data) {
  try {
    const vehicle = data.payload.vehicle
    const response = yield call(api.post, '/files', vehicle)

    if (response.status === 422) {
      yield put(addVehicleFail(vehicle, response.data.errors))
      return
    }
    yield put(formSuccess())
  } catch (err) {
  }
}

function* editVehicle(data) {
  try {
    const vehicle = data.payload.vehicle

    const response = yield call(api.put, `/vehicles/${vehicle.uuid}`, vehicle)

    if (response.status === 422) {
      yield put(addVehicleFailEdit(vehicle, response.data.errors))
      return
    }
    yield put(formSuccessEdit())
  } catch (err) {
  }
}

function* editVehicleView(data) {
  try {
    const vehicle = data.payload.vehicle

    const response = yield call(api.put, `/vehicles/${vehicle.uuid}`, vehicle)

    if (response.status === 422) {
      yield put(addVehicleFailEditView(vehicle, response.data.errors))
      return
    }
    yield put(formSuccessEditView())
  } catch (err) {
  }
}

function* deleteVehicle() {
  try {
    const { vehicleUuid } = yield select(
      state => state.vehicles
    )

    yield call(api.delete, `/vehicles/${vehicleUuid}`)
  } catch (err) {
  }
}

function* deleteFiles(data) {
  try {
    const vehicle = data.payload.vehicle
    const paths = data.payload.paths

    yield call(api.post, `vehicles/deleteFile/${vehicle.uuid}/${paths}`)

  } catch (err) {

  }
}

function* addFile(data) {
  try {
    const vehicle = data.payload.vehicle
    const files = data.payload.files
    const response = yield call(api.post, `/${vehicle.uuid}/files`, files)

    if (response.status === 422) {

    }
  } catch (err) {

  }
}

function* importData(file) {
  try {

    const fData = new FormData()
    fData.append('import', file.payload.file)

    const response = yield call(api.post, '/vehicles/importData', fData)

    if (response.status === 422) {
      return
    }

    yield put(getDataExcel(response.data, ('fieldsRequired' in response.data)))

  } catch (err) {

  }
}

function* getVehicleBoard() {
  try {
    const { board } = yield select(
      state => state.vehicles
    )
    const response = yield call(api.get, `/vehicles/vehicle/${board}`)
    const vehicle = response.data.data
    yield put(getVehicleSuccessBoard(vehicle))
  } catch (err) {

  }
}

function* addVehicleValidate(data) {
  try {
    const vehicle = data.payload.vehicle
    const response = yield call(api.post, `/vehicles/validate/${vehicle.uuid}`, vehicle)
    if (response.status === 422) {
      yield put(addVehicleFailEditView(vehicle, response.data.errors))
      return
    }

    yield put(resetVehicleFormEditView())

  } catch (err) {
  }
}

export default all([
  takeLatest('vehicles/EDIT_VEHICLE_VIEW', editVehicleView),
  takeLatest('vehicles/ADD_VEHICLE_VALIDATE', addVehicleValidate),
  takeLatest('vehicles/DELETE_VEHICLE', deleteVehicle),
  takeLatest('vehicles/GET_VEHICLE', getVehicleBoard),
  takeLatest('vehicles/GET_REQUEST', getVehicles),
  takeLatest('vehicles/ADD_VEHICLE', addVehicle),
  takeLatest('vehicles/EDIT_VEHICLE', editVehicle),
  takeLatest('vehicles/ADD_FILE', addFile),
  takeLatest('vehicles/DELETE_FILES', deleteFiles),
  takeLatest('vehicles/IMPORT_DATA', importData)
])
