import React, { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Button
} from "reactstrap"
import { listColor, listFuel, listManufacturer, listType, typeTerm } from "../../../support/constants"
import { applyMaskToCpfCnpj, maskBirthday, maskYearModel } from "../../../support/masks"
import { useDispatch, useSelector } from "react-redux"
import { CornerUpLeft, Edit, Trash } from "react-feather"
import { addTab } from "../../../store/modules/navbar/actions"
import { FieldEditCopy, SelectEditCopy, TextareaEditCopy } from "../components/fieldEditCopy"
import "../../styles/users.scss"
import { addCustomerValidate, editCustomer } from "../../../store/modules/customers/actions"
import { addVehicleValidate, editVehicle } from "../../../store/modules/vehicles/actions"
import { addContractValidate, deleteContract, editContractView, resetContractsFormEditView } from "../../../store/modules/contracts/actions"
import { useHistory } from "react-router-dom"
import { SweetAlertQuestion, SweetAlertSuccess } from "../components/sweetAlertMessage"
import generatePdf from "./generatePDF"

const ContractView = props => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [contractView, setContractView] = useState(props.location.state.contractDataView)
  const [vehicleView, setVehicleView] = useState(props.location.state.vehicleDataView)
  const [customerView, setCustomerView] = useState(props.location.state.customerDataView)
  const [address, setAddress] = useState(customerView ? customerView.address : [])
  const tabs = useSelector(state => state.navbar.tabs)

  const [isModification, setIsModification] = useState(false)
  const errorsCustomers = useSelector(state => state.customers.errorsEditView)
  const errorsVehicles = useSelector(state => state.vehicles.errorsEditView)
  const errorsContracts = useSelector(state => state.contracts.errorsEditView)
  const formSuccess = useSelector(state => state.contracts.formSuccessEditView)


  const newContract = () => {
    let newPrice = contractView.price
    if (contractView.price) {
      if (contractView.price.toString().includes(',')) {
        newPrice = contractView.price.replace(',', '.')
      }
    }

    return {
      uuid: contractView.uuid,
      price: newPrice,
      documentation: contractView.documentation,
      notes: contractView.notes,
      board: vehicleView.board,
      cpf_cnpj: contractView.cpf_cnpj,
      customer_name: customerView.name,
      sold_at: contractView.sold_at,
      delivered_at: contractView.delivered_at,
      type: contractView.type,
      term: contractView.term,
      customerObj: customerView,
      vehicleObj: vehicleView,
      customer_uuid: contractView.customer_uuid,
      vehicle_uuid: contractView.vehicle_uuid
    }
  }

  const newCustomer = () => {
    return {
      ...customerView,
      address
    }
  }

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

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const openFormContractEdit = (contract, customer, vehicle, type) => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('edit-contract')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'edit-contract',
              name: 'Edição de contrato',
              active: true,
              navLink: '/editar-contrato',
              state: { id: 'edit-contract', contractDataView: contract, customer, vehicle, type }
            }
          ]
        ))
        history.push(
          {
            pathname: '/editar-contrato',
            state: { id: 'edit-contract', contractDataView: contract, customer, vehicle, type }
          }
        )
        return
      }

      if (tab.id === 'edit-contract') {
        tab.active = true
        history.push({
          pathname: '/editar-contrato',
          state: { id: 'edit-contract', contractDataView: contract, customer, vehicle, type }
        })
      }

    })
  }

  const handleCurrentData = () => {
    openFormContractEdit(newContract(), customerView, vehicleView, contractView.type)
  }

  const activeValidateCustomer = () => {
    dispatch(addCustomerValidate(newCustomer()))
  }

  const activeValidateVehicle = () => {
    dispatch(addVehicleValidate(vehicleNew()))
  }

  const activeValidateContract = () => {
    dispatch(addContractValidate(newContract()))
  }

  const saveViewContract = () => {
    dispatch(editContractView(newContract()))
  }

  const saveViewVehicle = () => {
    dispatch(editVehicle(vehicleNew()))
  }

  const saveViewCustomer = () => {
    dispatch(editCustomer(newCustomer()))
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
      pathname: '/contratos',
      state: []
    })
    dispatch(addTab(
      [
        {
          id: 'contracts',
          name: 'Contratos',
          active: true,
          navLink: '/contratos'
        }
      ]
    ))
  }

  const handleDelete = (contract) => {
    dispatch(deleteContract(contract.uuid))
    closeForm()
  }

  useEffect(() => {
    if (formSuccess) {
      SweetAlertSuccess("Finalizado", "O contrato foi alterado com sucesso!", "success", function () { })
      dispatch(resetContractsFormEditView())
    }
  }, [formSuccess])

  function removeById(array, id) {
    return array.filter(function (el) {
      return el.id !== id
    })
  }

  return (
    <React.Fragment>
      <Row>
        <Col sm="12">
          <Card style={{ position: 'fixed', zIndex: '6', left: 'auto', right: '50px' }}>
            <CardBody>
              <Button.Ripple className="mr-1" color="success" onClick={() => { saveViewContract(); saveViewVehicle(); saveViewCustomer(); setIsModification(false) }}>
                <Edit size={15} />
                <span className="align-middle ml-50">Salvar Alterações</span>
              </Button.Ripple>
              <Button.Ripple className="mr-1" color="primary" onClick={() => handleCurrentData()}>
                <Edit size={15} />
                <span className="align-middle ml-50">Abrir Formulário</span>
              </Button.Ripple>
              <Button.Ripple className="mr-1" color="warning" onClick={() => generatePdf(newContract().uuid)}>
                <Edit size={15} />
                <span className="align-middle ml-50">Gerar PDF</span>
              </Button.Ripple>
              <Button.Ripple color="danger" className="mr-1" onClick={() => {
                SweetAlertQuestion("Deseja excluir este contrato", "Não pode ser disfeito", "question", function () { handleDelete(newContract()) }, function () { })
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
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  <div className="users-page-view-table">
                    <FieldEditCopy
                      title="Nome"
                      field="name"
                      obj={customerView}
                      action={activeValidateCustomer}
                      value={customerView.name}
                      errors={errorsCustomers}
                      setObj={e => { setCustomerView({ ...customerView, name: e.target.value }) }}
                      width="25ch"
                    />
                    <FieldEditCopy
                      title="CPF/CNPJ"
                      field="cpf_cnpj"
                      obj={customerView}
                      action={activeValidateCustomer}
                      errors={errorsCustomers}
                      length={18}
                      value={customerView.cpf_cnpj}
                      setObj={e => { setCustomerView({ ...customerView, cpf_cnpj: applyMaskToCpfCnpj(e.target.value) }); setIsModification(true) }}
                      width="18ch"
                    />
                    <FieldEditCopy
                      title="Email"
                      field="email"
                      obj={customerView}
                      action={activeValidateCustomer}
                      errors={errorsCustomers}
                      value={customerView.email}
                      setObj={e => { setCustomerView({ ...customerView, email: e.target.value }); setIsModification(true) }}
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
                      action={activeValidateVehicle}
                      length={7}
                      value={vehicleView.board}
                      errors={errorsVehicles}
                      setObj={e => { setVehicleView({ ...vehicleView, board: e.target.value }); setIsModification(true) }}
                      width="9ch"
                    />
                    <SelectEditCopy
                      title="Fabricante"
                      field="manufacturer"
                      list={listManufacturer}
                      obj={vehicleView}
                      action={activeValidateVehicle}
                      errors={errorsVehicles}
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
                      action={activeValidateVehicle}
                      errors={errorsVehicles}
                      setObj={e => { setVehicleView({ ...vehicleView, model: e.target.value }); setIsModification(true) }}
                      width="17ch"
                    />
                    <FieldEditCopy
                      title="Ano/Modelo"
                      field="year_and_model"
                      obj={vehicleView}
                      action={activeValidateVehicle}
                      errors={errorsVehicles}
                      length={9}
                      value={vehicleView.year_and_model}
                      setObj={e => { setVehicleView({ ...vehicleView, year_and_model: maskYearModel(e.target.value) }); setIsModification(true) }}
                      width="11ch"
                    />
                    <FieldEditCopy
                      title="CRLV"
                      field="crlv"
                      obj={vehicleView}
                      action={activeValidateVehicle}
                      errors={errorsVehicles}
                      value={vehicleView.crlv}
                      setObj={e => { setVehicleView({ ...vehicleView, crlv: e.target.value }); setIsModification(true) }}
                      ch="11ch"
                    />
                    <FieldEditCopy
                      title="CRV"
                      field="crv"
                      obj={vehicleView}
                      action={activeValidateVehicle}
                      errors={errorsVehicles}
                      value={vehicleView.crv}
                      setObj={e => { setVehicleView({ ...vehicleView, crv: e.target.value }); setIsModification(true) }}
                      width="11ch"
                    />
                    <SelectEditCopy
                      title="Tipo"
                      field="type"
                      list={listType}
                      obj={vehicleView}
                      action={activeValidateVehicle}
                      errors={errorsVehicles}
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
                      action={activeValidateVehicle}
                      errors={errorsVehicles}
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
                      action={activeValidateVehicle}
                      errors={errorsVehicles}
                      value={vehicleView.color}
                      setObj={e => { setVehicleView({ ...vehicleView, color: e.target.value }); setIsModification(true) }}
                      width="13ch"
                    />
                    <FieldEditCopy
                      title="KM"
                      field="km"
                      obj={vehicleView}
                      action={activeValidateVehicle}
                      errors={errorsVehicles}
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
              <CardTitle>Informações do contrato</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  <div className="users-page-view-table">
                    <FieldEditCopy
                      title="Preço"
                      field="price"
                      obj={contractView}
                      action={activeValidateContract}
                      value={contractView.price}
                      errors={errorsContracts}
                      setObj={e => { setContractView({ ...contractView, price: e.target.value }); setIsModification(true) }}
                      width="9ch"
                    />

                    <TextareaEditCopy
                      title="Documentação"
                      field="documentation"
                      obj={contractView}
                      action={activeValidateContract}
                      value={contractView.documentation}
                      errors={errorsContracts}
                      setObj={e => { setContractView({ ...contractView, documentation: e.target.value }); setIsModification(true) }}
                      width="9ch"
                    />

                    <TextareaEditCopy
                      title="Notas"
                      field="notes"
                      obj={contractView}
                      action={activeValidateContract}
                      value={contractView.notes}
                      errors={errorsContracts}
                      setObj={e => { setContractView({ ...contractView, notes: e.target.value }); setIsModification(true) }}
                      width="9ch"
                    />

                    <FieldEditCopy
                      title="Vendido em"
                      field="sold_at"
                      obj={contractView}
                      action={activeValidateContract}
                      value={contractView.sold_at}
                      errors={errorsContracts}
                      length={10}
                      setObj={e => { setContractView({ ...contractView, sold_at: maskBirthday(e.target.value) }); setIsModification(true) }}
                      width="11ch"
                    />

                    <FieldEditCopy
                      title="Enviado em"
                      field="delivered_at"
                      obj={contractView}
                      action={activeValidateContract}
                      value={contractView.delivered_at}
                      errors={errorsContracts}
                      length={10}
                      setObj={e => { setContractView({ ...contractView, delivered_at: maskBirthday(e.target.value) }); setIsModification(true) }}
                      width="11ch"
                    />

                    <SelectEditCopy
                      title="Tipo"
                      field="type"
                      list={typeTerm}
                      obj={contractView}
                      action={activeValidateVehicle}
                      errors={errorsContracts}
                      value={contractView.type}
                      setObj={e => { setContractView({ ...contractView, type: e.target.value }); setIsModification(true) }}
                      width="11ch"
                    />

                    <TextareaEditCopy
                      title="Termo"
                      field="term"
                      obj={contractView}
                      action={activeValidateContract}
                      value={contractView.term}
                      errors={errorsContracts}
                      setObj={e => { setContractView({ ...contractView, term: e.target.value }); setIsModification(true) }}
                      width="9ch"
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

export default ContractView
