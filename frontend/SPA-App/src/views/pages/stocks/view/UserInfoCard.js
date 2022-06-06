// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import Select from 'react-select'
import { Check, Briefcase, X } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { FieldEditCopy, SelectEditCopy } from '../../components/fieldEditCopy'
import { useDispatch, useSelector } from 'react-redux'

import { addVehicleValidate, editVehicle, resetVehicleForm } from "../../../../store/modules/vehicles/actions"
import { listColor, listFuel, listType } from '../../../../support/constants'
import { SweetAlertSuccess } from '../../components/sweetAlertMessage'


const roleColors = {
  editor: 'light-info',
  admin: 'light-danger',
  author: 'light-warning',
  maintainer: 'light-success',
  subscriber: 'light-primary'
}

const statusColors = {
  active: 'light-success',
  pending: 'light-warning',
  inactive: 'light-secondary'
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' }
]

const countryOptions = [
  { value: 'uk', label: 'UK' },
  { value: 'usa', label: 'USA' },
  { value: 'france', label: 'France' },
  { value: 'russia', label: 'Russia' },
  { value: 'canada', label: 'Canada' }
]

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'dutch', label: 'Dutch' }
]

const MySwal = withReactContent(Swal)

const UserInfoCard = ({ selectedUser }) => {
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [stock, setStock] = useState(selectedUser)
  const errorsStocks = useSelector(state => state.stocks.errors)
  const errorsVehicles = useSelector(state => state.vehicles.errors)
  const formSuccess = useSelector(state => state.vehicles.formSuccess)

  useEffect(() => {
    if (formSuccess) {
      SweetAlertSuccess("Finalizado", "O veículo foi alterado com sucesso!", "success", function () { })
      dispatch(resetVehicleForm())
    }
  }, [formSuccess])

  const getStockNew = () => {
    return {
      board: stock.board,
      chassi: stock.chassi,
      color: stock.color,
      crlv: stock.crlv,
      crv: stock.crv,
      engine: stock.engine,
      files: [],
      fuel: stock.fuel,
      in_stock: stock.in_stock,
      km: stock.km,
      manufacturer: stock.manufacturer,
      model: stock.model,
      notes: stock.notes,
      owner: stock.owner,
      owner_doc: stock.owner_doc,
      renavam: stock.renavam,
      type: stock.type,
      uuid: stock.vehicle.uuid,
      year_and_model: stock.year_and_model
    }
  }

  const activeValidateVehicle = () => {
    dispatch(addVehicleValidate(getStockNew()))
  }

  const saveViewVehicle = () => {
    dispatch(editVehicle(getStockNew()))
  }

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className='user-avatar-section'>
            <div className='d-flex align-items-center flex-column'>
              <div className='d-flex flex-column align-items-center text-center'>
                <div className='user-info'>
                  <h4>{stock !== null ? stock.fullName : 'Eleanor Aguilar'}</h4>
                  {stock !== null ? (
                    <Badge color={roleColors[stock.role]} className='text-capitalize'>
                      {stock.role}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-around my-2 pt-75'>
            <div className='d-flex align-items-start me-2'>
              <Badge color='light-primary' className='rounded p-75'>
                <Check className='font-medium-2' />
              </Badge>
              <div className='ms-75'>
                <h4 className='mb-0'>1.23k</h4>
                <small>Visualizações</small>
              </div>
            </div>
            <div className='d-flex align-items-start'>
              <Badge color='light-primary' className='rounded p-75'>
                <Briefcase className='font-medium-2' />
              </Badge>
              <div className='ms-75'>
                <h4 className='mb-0'>568</h4>
                <small>Interessados</small>
              </div>
            </div>
          </div>
          <h4 className='fw-bolder border-bottom pb-50 mb-1'>Informações do Veículo</h4>
          <div className='info-container'>
            {stock !== null ? (
              <ul className='list-unstyled'>
                <li className='mb-75'>
                  <FieldEditCopy
                    title="Placa"
                    field="board"
                    length={7}
                    action={activeValidateVehicle}
                    errors={errorsVehicles}
                    value={stock.board}
                    valueInput={stock.board}
                    setObj={e => {
                      setStock({
                        ...stock, board: e.target.value
                      })
                    }}
                    width="9ch"
                  />
                </li>
                <li className='mb-75'>
                  <FieldEditCopy
                    title="Fabricante"
                    field="manufacturer"
                    action={activeValidateVehicle}
                    errors={errorsVehicles}
                    value={stock.manufacturer}
                    valueInput={stock.manufacturer}
                    setObj={e => {
                      setStock({
                        ...stock, manufacturer: e.target.value
                      })
                    }}
                    width="13ch"
                  />
                </li>
                <li className='mb-75'>
                  <FieldEditCopy
                    title="Modelo"
                    field="model"
                    action={activeValidateVehicle}
                    errors={errorsVehicles}
                    value={stock.model}
                    valueInput={stock.model}
                    setObj={e => {
                      setStock({
                        ...stock, model: e.target.value
                      })
                    }}
                    width="13ch"
                  />
                </li>
                <li className='mb-75'>
                  <FieldEditCopy
                    title="Ano/Modelo"
                    field="year_and_model"
                    action={activeValidateVehicle}
                    errors={errorsVehicles}
                    value={stock.year_and_model}
                    valueInput={stock.year_and_model}
                    setObj={e => {
                      setStock({
                        ...stock, year_and_model: e.target.value
                      })
                    }}
                    width="13ch"
                  />
                </li>
                <li className='mb-75'>
                  <FieldEditCopy
                    title="CRLV"
                    field="crlv"
                    action={activeValidateVehicle}
                    errors={errorsVehicles}
                    value={stock.crlv}
                    valueInput={stock.crlv}
                    setObj={e => {
                      setStock({
                        ...stock, crlv: e.target.value
                      })
                    }}
                    width="13ch"
                  />
                </li>
                <li className='mb-75'>
                  <SelectEditCopy
                    title="Tipo"
                    field="type"
                    list={listType}
                    obj={stock}
                    action={activeValidateVehicle}
                    errors={errorsVehicles}
                    value={stock.type}
                    valueInput={stock.type}
                    setObj={e => { setStock({ ...stock, type: e.target.value }) }}
                    width="15ch"
                  />
                </li>
                <li className='mb-75'>
                  <SelectEditCopy
                    title="Combustivel"
                    field="fuel"
                    list={listFuel}
                    obj={stock}
                    action={activeValidateVehicle}
                    errors={errorsVehicles}
                    value={stock.fuel}
                    valueInput={stock.fuel}
                    setObj={e => { setStock({ ...stock, fuel: e.target.value }) }}
                    width="19ch"
                  />
                </li>
                <li className='mb-75'>
                  <SelectEditCopy
                    title="Cor"
                    field="color"
                    list={listColor}
                    obj={stock}
                    action={activeValidateVehicle}
                    errors={errorsVehicles}
                    value={stock.color}
                    valueInput={stock.color}
                    setObj={e => { setStock({ ...stock, color: e.target.value }) }}
                    width="13ch"
                  />
                </li>
                <li className='mb-75'>
                  <FieldEditCopy
                    title="KM"
                    field="km"
                    action={activeValidateVehicle}
                    errors={errorsVehicles}
                    value={stock.km}
                    valueInput={stock.km}
                    setObj={e => {
                      setStock({
                        ...stock, km: e.target.value
                      })
                    }}
                    width="13ch"
                  />
                </li>
                <li className='mb-75'>
                  <FieldEditCopy
                    title="Renavam"
                    field="renavam"
                    action={activeValidateVehicle}
                    errors={errorsVehicles}
                    value={stock.renavam}
                    valueInput={stock.renavam}
                    setObj={e => {
                      setStock({
                        ...stock, renavam: e.target.value
                      })
                    }}
                    width="13ch"
                  />
                </li>
                <li className='mb-75'>
                  <FieldEditCopy
                    title="Proprietário"
                    field="owner"
                    action={activeValidateVehicle}
                    errors={errorsVehicles}
                    value={stock.owner}
                    valueInput={stock.owner}
                    setObj={e => {
                      setStock({
                        ...stock, owner: e.target.value
                      })
                    }}
                    width="25ch"
                  />
                </li>
                <li className='mb-75'>
                  <FieldEditCopy
                    title="CPF"
                    field="owner_doc"
                    action={activeValidateVehicle}
                    errors={errorsVehicles}
                    value={stock.owner_doc}
                    valueInput={stock.owner_doc}
                    setObj={e => {
                      setStock({
                        ...stock, owner_doc: e.target.value
                      })
                    }}
                    width="25ch"
                  />
                </li>
              </ul>
            ) : null}
          </div>
          <div className='d-flex justify-content-center pt-2'>
            <Button color='primary' onClick={() => saveViewVehicle()}>
              Salvar
            </Button>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default UserInfoCard
