import {
  X
} from "react-feather"
import {
  Form,
  Card,
  CardBody,
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap"
import React, { useEffect, useState } from "react"
import Row from "reactstrap/es/Row"
import Col from "reactstrap/es/Col"
import { applyMaskToCpfCnpj, maskBirthday, maskCoin, maskDateMY } from "../../../support/masks"
import Select from "react-select"
import {
  FaCheck
} from "react-icons/fa"
import { useSelector, useDispatch } from "react-redux"
import { editContract, contractCleanError, resetContractsFormEditSaved, resetContractsForm, addContractEditSaved, addCustomerReseachedEditSaved, addVehicleReseachedEditSaved, addContractSaved, addCustomerReseachedSaved, addVehicleReseachedSaved, resetContractsFormEdit } from "../../../store/modules/contracts/actions"
import api from "../../../services/api"
import * as Icon from "react-feather"
import "react-toastify/dist/ReactToastify.css"
import CardText from 'reactstrap/lib/CardText'
import { AlertErrorRedFull } from "../components/alerts"
import '../../styles/fullFormstyles.scss'
import { useHistory } from "react-router-dom"
import { addTab } from "../../../store/modules/navbar/actions"
import { SweetAlertQuestion, SweetAlertSuccessPDF } from "../components/sweetAlertMessage"
import generatePdf from "./generatePDF"

const FullForm = props => {
  const dispatch = useDispatch()
  const contractSaved = useSelector(state => state.contracts.contractEditSaved)
  const customerSaved = useSelector(state => state.contracts.customerReseachedEditSaved)
  const vehicleSaved = useSelector(state => state.contracts.vehicleReseachedEditSaved)
  const [contract, setContract] = useState(contractSaved.length !== 0 ? contractSaved : props.location.state.contractDataView)
  const [searchCustomer, setSearchCustomer] = useState()
  const [nameCustomer, setNameCustomer] = useState(false)
  const [selectListCustomers, setSelectListCustomers] = useState([])
  const [selectListVehicles, setSelectListVehicles] = useState([])
  const [selectListTerms, setSelectListTerms] = useState([])
  const [customerResearched, setCustomerResearched] = useState(customerSaved.length !== 0 ? customerSaved : props.location.state.customer)
  const [vehicleResearched, setVehicleResearched] = useState(vehicleSaved.length !== 0 ? vehicleSaved : props.location.state.vehicle)
  const formSuccess = useSelector(state => state.contracts.formSuccessEdit)
  const errors = useSelector(state => state.contracts.errorsEdit)
  const [codeSale, setCodeSale] = useState([])
  const fieldsVehicle = ['vehicle', 'board', 'renavam', 'crv', 'chassi']
  const nameFieldsVehicle = ['Veículo', 'Placa', 'Renavam', 'Crv', 'Chassi']
  const tabs = useSelector(state => state.navbar.tabs)
  const history = useHistory()

  function removeById(array, id) {
    return array.filter(function (el) {
        return el.id !== id
    })
}

  useEffect(() => {
    dispatch(addContractEditSaved(contract))
    dispatch(addCustomerReseachedEditSaved(customerResearched))
    dispatch(addVehicleReseachedEditSaved(vehicleResearched))
})

  const handleDataCustomers = () => {
    const listNames = []
    api.get(`/customers/`).then(response => {
      response.data.data.forEach(customerDate => {
        listNames.push({ value: customerDate.name, label: customerDate.name })
      })
    }).catch(err => {
    })
    setSelectListCustomers(listNames)
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
            dispatch(resetContractsFormEditSaved())
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
    dispatch(resetContractsFormEditSaved())
}

  useEffect(() => {
    if (formSuccess) {
        SweetAlertSuccessPDF("Finalizado", "O contrato foi alterado com sucesso!", "success", function () { closeForm() }, function () {
          generatePdf(contract.uuid)
          closeForm()
        })
        
        dispatch(resetContractsFormEdit())
        dispatch(resetContractsFormEditSaved())
    }
}, [formSuccess])

  const handleDataTerms = () => {
    const listTerms = []
    api.get('/terms/').then(response => {
      response.data.data.forEach(termDate => {
        listTerms.push({ value: termDate.term, label: termDate.title })
      })
    }).catch(err => {

    })
    setSelectListTerms(listTerms)
  }

  const handleCodeSale = () => {
    api.get('/sales/generateCode').then(response => {
      setCodeSale(response.data)
    })
  }

  const handleDataVehicles = (field) => {
    const listVehicles = []
    api.get('/vehicles/').then(response => {
      response.data.data.forEach(vehicleDate => {
        listVehicles.push({ value: vehicleDate.board, label: vehicleDate[field] })
      })
    }).catch(err => {
    })
    setSelectListVehicles(listVehicles)
  }

  useEffect(() => {
    handleDataCustomers()
    handleDataVehicles('vehicle')
    handleDataTerms()
    if (contract.uuid) {
      setCodeSale(contract.code)
      return
    }
    handleCodeSale()
  }, [])

  const [index, setindex] = useState(0)

  const cleanError = field => {
    if (errors !== undefined) {
      if (errors[field] !== undefined) {
        delete errors[field]
        dispatch(contractCleanError(errors))
      }
    }
  }

  const handleDataCustomerName = (search) => {
    api.get(`/customers/name/${search}`).then(response => {
      const result = response.data.data
      if (result === undefined) {
        return
      }
      setCustomerResearched(result)
    }).catch(err => {
    })
  }

  const setFieldVehicle = (index) => {
    if (index === 5) {
      index = 0
    }
    handleDataVehicles(fieldsVehicle[index])
    setindex(index)
  }

  const [errorsCustomer, setErrorsCustomer] = useState([])

  const handleDataCustomerCpfCnpj = () => {
    api.get(`/customers/cpfcnpj/${searchCustomer}`).then(response => {
      const result = response.data.data
      if (response.data.errors !== undefined) {
        setErrorsCustomer(response.data.errors)
        return
      }
      setCustomerResearched(result)
    }).catch(err => {
    })
  }

  const handleDataVehicleBoard = (searchVehicle) => {
    api.get(`/vehicles/vehicle/${searchVehicle}`).then(response => {
      const result = response.data.data
      setVehicleResearched(result)
    }).catch(err => {
    })
  }

  const saveContract = async () => {

    let newPrice = contract.price
    if (contract.price) {
      if (contract.price.toString().includes(',')) {
        newPrice = contract.price.replace(',', '.')
      }
    }

    const contractToSave = {
      ...contract,
      cpf_cnpj: customerResearched.cpf_cnpj,
      board: vehicleResearched.board,
      customer_name: customerResearched.name,
      customer_uuid: customerResearched.uuid,
      vehicle_uuid: vehicleResearched.uuid,
      type: props.location.state.type,
      code: codeSale,
      price: parseFloat(newPrice)
    }

    dispatch(editContract(contractToSave))
  }

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const openFormCustomerEdit = (customer) => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('edit-customer')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'edit-customer',
              name: 'Edição de cliente',
              active: true,
              navLink: '/editar-cliente',
              state: { id: 'edit-customer', customerDataView: customerResearched }
            }
          ]
        ))
        history.push(
          {
            pathname: '/editar-cliente',
            state: { id: 'edit-customer', customerDataView: customerResearched }
          }
        )
        return
      }

      if (tab.id === 'edit-customer') {
        tab.active = true
        history.push({
          pathname: '/editar-cliente',
          state: { id: 'edit-customer', customerDataView: customerResearched }
        })
      }
    })
  }

  const openFormVehicleEdit = () => {
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
              state: { id: 'edit-vehicle', vehicleDataView: vehicleResearched }
            }
          ]
        ))
        history.push(
          {
            pathname: '/editar-veiculo',
            state: { id: 'edit-vehicle', vehicleDataView: vehicleResearched }
          }
        )
        return
      }

      if (tab.id === 'edit-vehicle') {
        tab.active = true
        history.push({
          pathname: '/editar-veiculo',
          state: { id: 'edit-vehicle', vehicleDataView: vehicleResearched }
        })
      }
    })
  }

  return (
    <div>
      <Form>
        <Row>
          <div className="data-list-sidebar-header mt-2 mb-2 px-2 d-flex justify-content-between">
            <h4 className='text-primary ml-100'><Icon.FileText size={25} className="fonticon-wrap" /> {props.location.state.type} </h4>
          </div>
        </Row>
        <Row>
          <Col>
            <InputGroup>
              <InputGroupAddon addonType="append" >
                <Button
                  type="button"
                  color="primary"
                  onClick={() => { setNameCustomer(!nameCustomer); setSearchCustomer(""); cleanError("customer_uuid") }}>
                  {nameCustomer ? "Nome" : "CPF/CNPJ"}
                </Button>
              </InputGroupAddon>
              {nameCustomer ? <>
                <Select
                  className="React selectCustomer"
                  classNamePrefix="select"
                  placeholder="Selecione um cliente"
                  onChange={value => { handleDataCustomerName(value.value); cleanError("customer_uuid") }}
                  options={selectListCustomers}
                  name="customer"
                />
              </> : <>
                <Input
                  maxLength="14"
                  name="customer"
                  placeholder="Digite CPF ou CNPJ do cliente"
                  value={searchCustomer ?? ''}
                  onKeyUp={e => { cleanError("customer_uuid") }}
                  onBlur={() => handleDataCustomerCpfCnpj()}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleDataCustomerCpfCnpj()
                    }
                  }}
                  onChange={e => setSearchCustomer(applyMaskToCpfCnpj(e.target.value))}
                />
              </>}
              <InputGroupAddon addonType="append" >
                <Button
                  type="button"
                  color="primary"
                  onClick={() => { }}>
                  Pesquisar
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <AlertErrorRedFull field="customer_uuid" errors={errors} />
          </Col>
          <Col>
            <InputGroup>
              <InputGroupAddon addonType="append" >
                <Button
                  type="button"
                  color="primary"
                  onClick={e => { setFieldVehicle(index + 1); setSearchCustomer(""); cleanError("customer_uuid") }}>
                  {nameFieldsVehicle[index]}
                </Button>
              </InputGroupAddon>
              <Select
                className="React selectCustomer"
                classNamePrefix="select"
                placeholder="Selecione um veículo"
                onChange={value => { handleDataVehicleBoard(value.value); cleanError("customer_uuid") }}
                options={selectListVehicles}
                name="customer"
              />
              <InputGroupAddon addonType="append" >
                <Button
                  type="button"
                  color="primary"
                  onClick={() => { }}>
                  Pesquisar
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <AlertErrorRedFull field="vehicle_uuid" errors={errors} />
          </Col>
        </Row>
        <Row>
          <Col md='6' sm='4'>
            <Card>
              <CardBody className='pt-0'>
                {customerResearched && customerResearched.uuid ? <CardText>
                  <div className='expandable-content p-2'>
                    <p>
                      <span className='font-weight-bold'>Cliente:</span> {customerResearched.name}
                    </p>
                    <p>
                      <span className='font-weight-bold'>CPF:</span> {customerResearched.cpf_cnpj}
                    </p>
                    <p>
                      <span className='font-weight-bold'>Email:</span> {customerResearched.email}
                    </p>
                    <p>
                      <span className='font-weight-bold'>Contato:</span> {customerResearched.contact}
                    </p>
                    <p>
                      <Button.Ripple
                        outline
                        color='primary'
                        size='sm'
                        onClick={() => {
                          openFormCustomerEdit()
                        }}
                      >
                        Editar Cliente
                      </Button.Ripple>
                    </p>

                  </div>
                </CardText> : <CardText>
                  <div className='expandable-content p-2'>
                    <p>
                      Esperando pesquisa...
                    </p>
                  </div>
                </CardText>
                }
              </CardBody>
            </Card>
          </Col>
          <Col md='6' sm='4'>
            <Card>
              <CardBody className='pt-0'>
                {vehicleSaved && vehicleResearched.uuid ? <CardText>
                  <div className='expandable-content p-2'>
                    <p>
                      <span className='font-weight-bold'>Veículo:</span> {vehicleResearched.vehicle}
                    </p>
                    <p>
                      <span className='font-weight-bold'>Placa:</span> {vehicleResearched.board}
                    </p>
                    <p>
                      <span className='font-weight-bold'>Cor:</span> {vehicleResearched.color}
                    </p>
                    <p>
                      <span className='font-weight-bold'>Licenciamento:</span> {vehicleResearched.crlv}
                    </p>
                    <p>
                      <Button.Ripple
                        outline
                        color='primary'
                        size='sm'
                        onClick={() => {
                          openFormVehicleEdit()
                        }}
                      >
                        Editar Veiculo
                      </Button.Ripple>
                    </p>

                  </div>
                </CardText> : <CardText>
                  <div className='expandable-content p-2'>
                    <p>
                      Esperando pesquisa...
                    </p>
                  </div>
                </CardText>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-1">
          <Col lg="4" md="12">
            <p>
              Preço *
            </p>
            <InputGroup>
              <InputGroupAddon addonType="prepend">R$</InputGroupAddon>
              <Input
                placeholder="0,00"
                value={contract.price ?? ''}
                onChange={e => setContract({ ...contract, price: maskCoin(e.target.value) })}
                onKeyDown={() => cleanError("price")}
                name="price"
              />
            </InputGroup>
            <AlertErrorRedFull field="price" errors={errors} />
          </Col>
        </Row>
        <Row>
          <CardBody>
            <p>
              Documentação
            </p>
            <Input
              type="textarea"
              name="text"
              id="dataDoc"
              rows="3"
              placeholder="Digite os documentos do veículo..."
              value={contract.documentation ?? ''}
              onChange={e => setContract({ ...contract, documentation: e.target.value })}
            />
          </CardBody>
        </Row>
        <Row>
          <CardBody>
            <p>
              Observações
            </p>
            <Input
              type="textarea"
              name="text"
              id="exampleText"
              rows="3"
              placeholder="Digite suas observações sobre contrato..."
              value={contract.notes ?? ''}
              onChange={e => setContract({ ...contract, notes: e.target.value })}
            />
          </CardBody>
        </Row>
        <Row>
          <Col lg="4" md="12">
            <p>
              Titulo do termo
            </p>
            <Select
              placeholder="Selecione"
              className="React"
              classNamePrefix="Select"
              name="titleterm"
              invalid={errors ? (errors[props.field] !== undefined) : false}
              options={selectListTerms}
              id="data-term"
              onChange={e => { setContract({ ...contract, term: e.value }); cleanError("term") }}
            />
          </Col>
          <Col>
            <p>
              Termo *
            </p>
            <Input
              value={contract.term ?? ""}
              onChange={e => setContract({ ...contract, term: e.target.value })}
              onKeyDown={() => cleanError("term")}
              type="textarea"
              style={{ height: '300px' }}
            />
            <AlertErrorRedFull field="term" errors={errors} />
          </Col>
        </Row>
        <Row>
          <Col>
            <CardBody>
              <p>
                Vendido em *
              </p>
              <Input
                type="text"
                name="dateSold"
                placeholder="Digite a data da venda"
                value={contract.sold_at ?? ''}
                onChange={e => setContract({ ...contract, sold_at: maskBirthday(e.target.value) })}
                onKeyDown={() => cleanError("sold_at")}
              />
              <AlertErrorRedFull field="sold_at" errors={errors} />
            </CardBody>
          </Col>
          <Col>
            <CardBody>
              <p>
                Entregue em *
              </p>
              <Input
                type="text"
                name="date"
                placeholder="Digite a data da entrega"
                value={contract.delivered_at ?? ''}
                onChange={e => setContract({ ...contract, delivered_at: maskBirthday(e.target.value) })}
                onKeyDown={() => cleanError("delivered_at")}
              />
              <AlertErrorRedFull field="delivered_at" errors={errors} />
            </CardBody>
          </Col>
        </Row>
        <Row>
          <Col className='d-flex justify-content-end'>
            <FormGroup>
              <Button.Ripple outline className="ml-1" color="danger" onClick={() => SweetAlertQuestion("Deseja cancelar o cadastro?", "", "question", closeForm, function () { }) }>
                <X size={14} /> Cancelar
              </Button.Ripple>
              <Button.Ripple type="button" outline className="ml-1" color="success" onClick={() => saveContract()}>
                <FaCheck size={14} /> {contract.uuid ? "Alterar" : " Cadastrar"}
              </Button.Ripple>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </div>

  )
}
export default FullForm
