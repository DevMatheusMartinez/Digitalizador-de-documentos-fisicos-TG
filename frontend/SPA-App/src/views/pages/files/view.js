import React, { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Button
} from "reactstrap"
import { Edit, Trash, CornerUpLeft } from "react-feather"
import { applyMaskToCpfCnpj, maskBirthday, maskYearModel } from "../../../support/masks"
import { useDispatch, useSelector } from "react-redux"
import { listColor, listFuel, listManufacturer, listType, ufList } from "../../../support/constants"
import { FieldEditCopy, SelectEditCopy } from "../components/fieldEditCopy"
import '../../styles/users.scss'
import { addTab } from "../../../store/modules/navbar/actions"
import { useHistory } from "react-router-dom"
import { addVehicleValidate, deleteVehicle, editVehicle, editVehicleView, resetVehicleFormEditView } from "../../../store/modules/vehicles/actions"
import { SweetAlertQuestion, SweetAlertSuccess } from "../components/sweetAlertMessage"

const VehicleView = props => {
  const [vehicleView, setVehicleView] = useState(props.location.state.vehicleDataView)
  const [isModification, setIsModification] = useState(false)
  const errors = useSelector(state => state.vehicles.errorsEditView)
  const formSuccess = useSelector(state => state.vehicles.formSuccessEditView)
  const tabs = useSelector(state => state.navbar.tabs)
  const history = useHistory()

  const dispatch = useDispatch()

  const vehicleNew = () => {
    return {
      uuid: vehicleView.uuid,
      board: vehicleView.board,
      renavam: vehicleView.renavam,
      type: vehicleView.type,
      fuel: vehicleView.fuel,
      manufacturer: vehicleView.manufacturer,
      crlv: vehicleView.crlv,
      crv: vehicleView.crv,
      model: vehicleView.model,
      km: vehicleView.km,
      year_and_model: vehicleView.year_and_model,
      owner: vehicleView.owner,
      files: vehicleView.files,
      owner_doc: vehicleView.owner_doc,
      color: vehicleView.color,
      chassi: vehicleView.chassi,
      engine: vehicleView.engine,
      in_stock: vehicleView.in_stock,
      notes: vehicleView.notes
    }
  }

  function removeById(array, id) {
    return array.filter(function (el) {
      return el.id !== id
    })
  }

  const closeForm = () => {
    if (tabs.length > 1) {
      const objTabs = removeById(tabs, props.location.state.id)

      if (objTabs.length - 1 >= 0) {
        const itemCurrent = objTabs[objTabs.length - 1]
        itemCurrent.active = true
        history.push({
          pathname: itemCurrent.navLink,
          state: itemCurrent.state
        })
        dispatch(addTab([...objTabs]))
        return
      }
    }
    history.push({
      pathname: '/veiculos',
      state: []
    })
    dispatch(addTab(
      [
        {
          id: 'vehicles',
          name: 'Veículos',
          active: true,
          navLink: '/veiculos'
        }
      ]
    ))
  }

  const handleDelete = (vehicle) => {
    dispatch(deleteVehicle(vehicle.uuid))
    closeForm()
  }

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const openFormVehicleEdit = (vehicle) => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('edit-vehicle')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'edit-vehicle',
              name: 'Edição de veículo',
              active: true,
              navLink: '/editar-veiculo',
              state: { id: 'edit-vehicle', vehicleDataView: vehicle }
            }
          ]
        ))
        history.push(
          {
            pathname: '/editar-veiculo',
            state: { id: 'edit-vehicle', vehicleDataView: vehicle }
          }
        )
        return
      }

      if (tab.id === 'edit-vehicle') {
        tab.active = true
        history.push({
          pathname: '/editar-veiculo',
          state: { id: 'edit-vehicle', vehicleDataView: vehicle }
        })
      }
    })
  }

  useEffect(() => {
    if (formSuccess) {
      SweetAlertSuccess("Finalizado", "O veiculo foi alterado com sucesso!", "success", function () { })
      dispatch(resetVehicleFormEditView())
    }
  }, [formSuccess])

  const saveViewVehicle = () => {
    dispatch(editVehicleView(vehicleNew()))
  }

  const activeValidate = () => {
    dispatch(addVehicleValidate(vehicleNew()))
  }

  return (
    <React.Fragment>
      <Row>
        <Col sm="12">
          <Card style={{ position: 'fixed', zIndex: '6', left: 'auto', right: '50px' }}>
            <CardBody>
              <Button.Ripple className="mr-1" color="success" onClick={() => { saveViewVehicle(); setIsModification(false) }}>
                <Edit size={15} />
                <span className="align-middle ml-50">Salvar Alterações</span>
              </Button.Ripple>
              <Button.Ripple className="mr-1" color="primary" onClick={() => openFormVehicleEdit(vehicleNew())}>
                <Edit size={15} />
                <span className="align-middle ml-50">Abrir Formulário</span>
              </Button.Ripple>
              <Button.Ripple color="danger" className="mr-1" onClick={() => {
                SweetAlertQuestion("Deseja excluir este usuário", "Não pode ser disfeito", "question", function () { handleDelete(vehicleNew()) }, function () { })
              }}>
                <Trash size={15} />
                <span className="align-middle ml-50">Deletar</span>
              </Button.Ripple>
              <Button.Ripple color="dark" onClick={() => {
                if (isModification) {
                  SweetAlertQuestion("existe alterações não salvas!", "Deseja sair sem salvar", "question", () => { closeForm() }, () => { })
                  return
                }
                closeForm()
              }}>
                <CornerUpLeft size={15} />
                <span className="align-middle ml-50">Sair</span>
              </Button.Ripple>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Veículo</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  <div className="users-page-view-table">
                    <FieldEditCopy
                      title="Placa"
                      field="board"
                      obj={vehicleView}
                      action={activeValidate}
                      length={7}
                      value={vehicleView.board}
                      errors={errors}
                      setObj={e => { setVehicleView({ ...vehicleView, board: e.target.value }); setIsModification(true) }}
                      width="9ch"
                    />
                    <SelectEditCopy
                      title="Fabricante"
                      field="manufacturer"
                      list={listManufacturer}
                      obj={vehicleView}
                      action={activeValidate}
                      errors={errors}
                      value={vehicleView.manufacturer}
                      valueInput={vehicleView.manufacturer}
                      setObj={e => { setVehicleView({ ...vehicleView, manufacturer: e.target.value }); setIsModification(true) }}
                      width="15ch"
                    />
                    <FieldEditCopy
                      title="Modelo"
                      field="model"
                      obj={vehicleView}
                      value={vehicleView.model}
                      action={activeValidate}
                      errors={errors}
                      setObj={e => { setVehicleView({ ...vehicleView, model: e.target.value }); setIsModification(true) }}
                      width="17ch"
                    />
                    <FieldEditCopy
                      title="Ano/Modelo"
                      field="year_and_model"
                      obj={vehicleView}
                      action={activeValidate}
                      errors={errors}
                      length={9}
                      value={vehicleView.year_and_model}
                      setObj={e => { setVehicleView({ ...vehicleView, year_and_model: maskYearModel(e.target.value) }); setIsModification(true) }}
                      width="11ch"
                    />
                    <FieldEditCopy
                      title="CRLV"
                      field="crlv"
                      obj={vehicleView}
                      action={activeValidate}
                      errors={errors}
                      value={vehicleView.crlv}
                      setObj={e => { setVehicleView({ ...vehicleView, crlv: maskBirthday(e.target.value) }); setIsModification(true) }}
                      ch="11ch"
                    />
                    <FieldEditCopy
                      title="CRV"
                      field="crv"
                      obj={vehicleView}
                      action={activeValidate}
                      errors={errors}
                      value={vehicleView.crv}
                      setObj={e => { setVehicleView({ ...vehicleView, crv: e.target.value }); setIsModification(true) }}
                      width="11ch"
                    />
                    <SelectEditCopy
                      title="Tipo"
                      field="type"
                      list={listType}
                      obj={vehicleView}
                      action={activeValidate}
                      errors={errors}
                      value={vehicleView.type}
                      valueInput={vehicleView.type}
                      setObj={e => { setVehicleView({ ...vehicleView, type: e.target.value }); setIsModification(true) }}
                      width="15ch"
                    />
                    <SelectEditCopy
                      title="Combustível"
                      field="fuel"
                      list={listFuel}
                      obj={vehicleView}
                      action={activeValidate}
                      errors={errors}
                      value={vehicleView.fuel}
                      valueInput={vehicleView.fuel}
                      setObj={e => { setVehicleView({ ...vehicleView, fuel: e.target.value }); setIsModification(true) }}
                      width="19ch"
                    />
                    <SelectEditCopy
                      title="Cor"
                      field="color"
                      list={listColor}
                      obj={vehicleView}
                      action={activeValidate}
                      errors={errors}
                      value={vehicleView.color}
                      setObj={e => { setVehicleView({ ...vehicleView, color: e.target.value }); setIsModification(true) }}
                      width="13ch"
                    />
                    <FieldEditCopy
                      title="KM"
                      field="km"
                      obj={vehicleView}
                      action={activeValidate}
                      errors={errors}
                      length={7}
                      value={vehicleView.km}
                      setObj={e => { setVehicleView({ ...vehicleView, km: e.target.value }); setIsModification(true) }}
                      width="8ch"
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12">
          <Card>
            <CardHeader>
              <CardTitle>Proprietário</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  <div className="users-page-view-table">
                    <FieldEditCopy
                      title="Nome"
                      field="owner"
                      obj={vehicleView}
                      action={activeValidate}
                      errors={errors}
                      value={vehicleView.owner}
                      setObj={e => { setVehicleView({ ...vehicleView, owner: e.target.value }); setIsModification(true) }}
                      width="25ch"
                    />
                    <FieldEditCopy
                      title="CPF"
                      field="owner_doc"
                      obj={vehicleView}
                      action={activeValidate}
                      errors={errors}
                      length={14}
                      value={vehicleView.owner_doc}
                      setObj={e => { setVehicleView({ ...vehicleView, owner_doc: applyMaskToCpfCnpj(e.target.value) }); setIsModification(true) }}
                      width="15ch"
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

    </React.Fragment>
  )
}

export default VehicleView
