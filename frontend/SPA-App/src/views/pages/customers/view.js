import React, { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button
} from "reactstrap"
import { applyMaskToCpfCnpj, applyMaskToPhone, maskBirthday } from "../../../support/masks"
import { useDispatch, useSelector } from "react-redux"
import { listOccupation, maritalStatusList, ufList, contactTypes, banksList, accountTypeList } from "../../../support/constants"
import { CornerUpLeft, Edit, Plus, Trash } from "react-feather"
import { v4 as uuidv4 } from 'uuid'
import { FieldEditCopy, SelectEditCopy } from "../components/fieldEditCopy"
import "../../styles/users.scss"
import { addCustomerValidate, deleteCustomer, editCustomerView, resetCustomerFormEditView } from "../../../store/modules/customers/actions"
import { addTab } from "../../../store/modules/navbar/actions"
import { useHistory } from "react-router-dom"
import { SweetAlertQuestion, SweetAlertSuccess } from "../components/sweetAlertMessage"

const CustomerView = props => {
  const [customerView, setCustomerView] = useState(props.location.state.customerDataView)
  const [incomes, setIncomes] = useState(customerView ? customerView.incomes : [])
  const [contacts, setContacts] = useState(customerView ? customerView.contacts : [])
  const [address, setAddress] = useState(customerView ? customerView.address : [])
  const [banking_references, setBanking_references] = useState(customerView ? customerView.banking_references : [])
  const [isModification, setIsModification] = useState(false)
  const tabs = useSelector(state => state.navbar.tabs)

  const errors = useSelector(state => state.customers.errorsEditView)
  const formSuccess = useSelector(state => state.customers.formSuccessEditView)

  const dispatch = useDispatch()

  const history = useHistory()

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
      pathname: '/clientes',
      state: []
    })
    dispatch(addTab(
      [
        {
          id: 'customers',
          name: 'Clientes',
          active: true,
          navLink: '/clientes'
        }
      ]
    ))
  }

  const handleDelete = (customer) => {
    dispatch(deleteCustomer(customer.uuid))
    closeForm()
  }

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const newCustomer = () => {
    const spouse_on = customerView.spouse_on === 1
    return {
      ...customerView,
      spouse_on,
      incomes,
      contacts,
      address,
      banking_references
    }
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
              state: { id: 'edit-customer', customerDataView: customer }
            }
          ]
        ))
        history.push(
          {
            pathname: '/editar-cliente',
            state: { id: 'edit-customer', customerDataView: customer }
          }
        )
        return
      }

      if (tab.id === 'edit-customer') {
        tab.active = true
        history.push({
          pathname: '/editar-cliente',
          state: { id: 'edit-customer', customerDataView: customer }
        })
      }
    })
  }

  useEffect(() => {
    if (formSuccess) {
      SweetAlertSuccess("Finalizado", "O cliente foi alterado com sucesso!", "success", function () {
        dispatch(resetCustomerFormEditView())
      }
      )
    }
  }, [formSuccess])

  const handleCurrentData = () => {
    openFormCustomerEdit(newCustomer())
  }

  const saveViewCustomer = () => {
    dispatch(editCustomerView(newCustomer()))
  }

  const activeValidate = () => {
    dispatch(addCustomerValidate(newCustomer()))
  }

  const [activeIncome, setActiveIncome] = useState('income-0')
  const [activeContact, setActiveContact] = useState('contact-0')
  const [activeBank, setActiveBank] = useState('bank-0')

  const toggleIncome = tab => {
    if (activeIncome !== tab) {
      setActiveIncome(tab)
    }
  }

  const toggleContact = tab => {
    if (activeContact !== tab) {
      setActiveContact(tab)
    }
  }

  const toggleBank = tab => {
    if (activeBank !== tab) {
      setActiveBank(tab)
    }
  }

  return (
    <React.Fragment>
      <Row>
        <Col sm="12">
          <Card style={{ position: 'fixed', zIndex: '6', left: 'auto', right: '50px' }}>
            <CardBody>
              <Button.Ripple className="mr-1" color="success" onClick={() => { saveViewCustomer(); setIsModification(false) }}>
                <Edit size={15} />
                <span className="align-middle ml-50">Salvar Alterações</span>
              </Button.Ripple>
              <Button.Ripple className="mr-1" color="primary" onClick={() => handleCurrentData()}>
                <Edit size={15} />
                <span className="align-middle ml-50">Abrir Formulário</span>
              </Button.Ripple>
              <Button.Ripple color="danger" className="mr-1" onClick={() => {
                SweetAlertQuestion("Deseja excluir este usuário", "Não pode ser disfeito", "question", function () { handleDelete(newCustomer()) }, function () { })
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
                      action={activeValidate}
                      value={customerView.name}
                      errors={errors}
                      setObj={e => { setCustomerView({ ...customerView, name: e.target.value }); setIsModification(true) }}
                      width="25ch"
                    />
                    <FieldEditCopy
                      title="Data de Nascimento"
                      field="birthday"
                      length={10}
                      obj={customerView}
                      value={customerView.birthday}
                      action={activeValidate}
                      errors={errors}
                      setObj={e => { setCustomerView({ ...customerView, birthday: maskBirthday(e.target.value) }); setIsModification(true) }}
                      width="10ch"
                    />
                    <FieldEditCopy
                      title="CPF/CNPJ"
                      field="cpf_cnpj"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      length={18}
                      value={customerView.cpf_cnpj}
                      setObj={e => { setCustomerView({ ...customerView, cpf_cnpj: applyMaskToCpfCnpj(e.target.value) }); setIsModification(true) }}
                      width="18ch"
                    />
                    <FieldEditCopy
                      title="RG"
                      field="rg"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.rg}
                      setObj={e => { setCustomerView({ ...customerView, rg: e.target.value }); setIsModification(true) }}
                      width="16ch"
                    />
                    <FieldEditCopy
                      title="Data de missão do RG"
                      field="rg_date"
                      obj={customerView}
                      action={activeValidate}
                      length={10}
                      errors={errors}
                      value={customerView.rg_date}
                      setObj={e => { setCustomerView({ ...customerView, rg_date: maskBirthday(e.target.value) }); setIsModification(true) }}
                      width="10ch"
                    />
                    <FieldEditCopy
                      title="Orgão do RG"
                      field="rg_org"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.rg_org}
                      setObj={e => { setCustomerView({ ...customerView, rg_org: e.target.value }); setIsModification(true) }}
                      width="6ch"
                    />
                    <SelectEditCopy
                      title="Estado do RG"
                      field="rg_uf"
                      list={ufList}
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.rg_uf}
                      valueInput={customerView.rg_uf}
                      setObj={e => { setCustomerView({ ...customerView, rg_uf: e.target.value }); setIsModification(true) }}
                      width="6ch"
                    />
                    <SelectEditCopy
                      title="Estado Cívil"
                      field="marital_status"
                      list={maritalStatusList}
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.marital_status}
                      valueInput={customerView.marital_status}
                      setObj={e => { setCustomerView({ ...customerView, marital_status: e.target.value }); setIsModification(true) }}
                      width="16ch"
                    />
                    <FieldEditCopy
                      title="Email"
                      field="email"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.email}
                      setObj={e => { setCustomerView({ ...customerView, email: e.target.value }); setIsModification(true) }}
                    />
                    <FieldEditCopy
                      title="Nacionalidade"
                      field="nationality"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.nationality}
                      setObj={e => { setCustomerView({ ...customerView, nationality: e.target.value }); setIsModification(true) }}
                    />
                    <FieldEditCopy
                      title="Naturalidade"
                      field="naturalness"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.naturalness}
                      setObj={e => { setCustomerView({ ...customerView, naturalness: e.target.value }); setIsModification(true) }}
                    />
                    <SelectEditCopy
                      title="Naturalidade UF"
                      field="naturalness_uf"
                      list={ufList}
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.naturalness_uf}
                      valueInput={customerView.naturalness_uf}
                      setObj={e => { setCustomerView({ ...customerView, naturalness_uf: e.target.value }); setIsModification(true) }}
                      width="6ch"
                    />
                    <FieldEditCopy
                      title="Nome da mãe"
                      field="mother"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.mother}
                      setObj={e => { setCustomerView({ ...customerView, mother: e.target.value }); setIsModification(true) }}
                    />
                    <FieldEditCopy
                      title="Nome do pai"
                      field="father"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.father}
                      setObj={e => { setCustomerView({ ...customerView, father: e.target.value }); setIsModification(true) }}
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
              <CardTitle>Conjuge</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  <div className="users-page-view-table">
                    <FieldEditCopy
                      title="Nome"
                      field="spouse"
                      obj={customerView}
                      action={activeValidate}
                      value={customerView.spouse}
                      errors={errors}
                      setObj={e => { setCustomerView({ ...customerView, spouse: e.target.value }); setIsModification(true) }}
                      width="25ch"
                    />
                    <FieldEditCopy
                      title="Data de Nascimento"
                      field="spouse_birthday"
                      obj={customerView}
                      value={customerView.spouse_birthday}
                      action={activeValidate}
                      length={10}
                      errors={errors}
                      setObj={e => { setCustomerView({ ...customerView, spouse_birthday: maskBirthday(e.target.value) }); setIsModification(true) }}
                      width="10ch"
                    />
                    <FieldEditCopy
                      title="CPF/CNPJ"
                      field="spouse_cpf"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      length={18}
                      value={customerView.spouse_cpf}
                      setObj={e => { setCustomerView({ ...customerView, spouse_cpf: applyMaskToCpfCnpj(e.target.value) }); setIsModification(true) }}
                      width="18ch"
                    />
                    <FieldEditCopy
                      title="RG"
                      field="spouse_rg"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.spouse_rg}
                      setObj={e => { setCustomerView({ ...customerView, spouse_rg: e.target.value }); setIsModification(true) }}
                      width="16ch"
                    />
                    <FieldEditCopy
                      title="Data de missão do RG"
                      field="spouse_rg_date"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      length={10}
                      value={customerView.spouse_rg_date}
                      setObj={e => { setCustomerView({ ...customerView, spouse_rg_date: maskBirthday(e.target.value) }); setIsModification(true) }}
                      width="10ch"
                    />
                    <FieldEditCopy
                      title="Orgão do RG"
                      field="spouse_rg_org"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.spouse_rg_org}
                      setObj={e => { setCustomerView({ ...customerView, spouse_rg_org: e.target.value }); setIsModification(true) }}
                      width="6ch"
                    />
                    <SelectEditCopy
                      title="Estado do RG"
                      field="spouse_rg_uf"
                      list={ufList}
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.spouse_rg_uf}
                      valueInput={customerView.naturalness_uf}
                      setObj={e => { setCustomerView({ ...customerView, spouse_rg_uf: e.target.value }); setIsModification(true) }}
                      width="6ch"
                    />
                    <SelectEditCopy
                      title="Estado Cívil"
                      ch='16ch'
                      field="marital_status"
                      list={maritalStatusList}
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.marital_status}
                      valueInput={customerView.marital_status}
                      setObj={e => { setCustomerView({ ...customerView, rg_uf: e.target.value }); setIsModification(true) }}
                      width="6ch"
                    />
                    <FieldEditCopy
                      title="Email"
                      field="spouse_email"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.spouse_email}
                      setObj={e => { setCustomerView({ ...customerView, spouse_email: e.target.value }); setIsModification(true) }}
                    />
                    <FieldEditCopy
                      title="Nacionalidade"
                      field="spouse_nationality"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.spouse_nationality}
                      setObj={e => { setCustomerView({ ...customerView, spouse_nationality: e.target.value }); setIsModification(true) }}
                    />
                    <FieldEditCopy
                      title="Naturalidade"
                      field="spouse_naturalness"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.spouse_naturalness}
                      setObj={e => { setCustomerView({ ...customerView, spouse_naturalness: e.target.value }); setIsModification(true) }}
                    />
                    <SelectEditCopy
                      title="Naturalidade UF"
                      field="spouse_naturalness_uf"
                      list={ufList}
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.spouse_naturalness_uf}
                      valueInput={customerView.spouse_naturalness_uf}
                      setObj={e => { setCustomerView({ ...customerView, spouse_naturalness_uf: e.target.value }); setIsModification(true) }}
                      width="6ch"
                    />
                    <FieldEditCopy
                      title="Nome da mãe"
                      field="spouse_mother"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.spouse_mother}
                      setObj={e => { setCustomerView({ ...customerView, spouse_mother: e.target.value }); setIsModification(true) }}
                    />
                    <FieldEditCopy
                      title="Nome do pai"
                      field="spouse_father"
                      obj={customerView}
                      action={activeValidate}
                      errors={errors}
                      value={customerView.spouse_father}
                      setObj={e => { setCustomerView({ ...customerView, spouse_father: e.target.value }); setIsModification(true) }}
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
              <CardTitle>Rendas</CardTitle>
            </CardHeader>
            <CardBody>
              <Nav tabs>
                {incomes.length > 0 ? incomes.map((income, index) => {
                  return <NavItem>
                    <NavLink
                      active={activeIncome === `income-${index}`}
                      onClick={() => {
                        toggleIncome(`income-${index}`)
                      }}
                    >
                      Renda {index + 1}
                    </NavLink>
                  </NavItem>
                }) : <div></div>}
                <NavItem>
                  <NavLink
                    onClick={() => setIncomes([
                      ...incomes, {
                        id: uuidv4(),
                        occupation: '',
                        company: '',
                        cnpj: '',
                        role: '',
                        value: '',
                        start_date: '',
                        spouse: false
                      }
                    ])}
                  >
                    <Plus size={14} />
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeIncome}>
                {incomes.length > 0 ? incomes.map((income, index) => {
                  return <TabPane tabId={`income-${index}`}>
                    <Row>
                      <Col>
                        <div className="users-page-view-table">
                          <SelectEditCopy
                            title="Ocupação"
                            field={`incomes.${index}.occupation`}
                            list={listOccupation}
                            obj={incomes}
                            action={activeValidate}
                            errors={errors}
                            value={income.occupation}
                            valueInput={income.occupation}
                            setObj={occupation => {
                              const newInputOccupation = incomes.map(input => {
                                if (income.id === input.id) {
                                  input["occupation"] = occupation.target.value
                                }
                                return input
                              })

                              setIncomes(newInputOccupation)
                              setIsModification(true)
                            }}
                            width="26ch"
                          />
                          <FieldEditCopy
                            title="Empresa"
                            field={`incomes.${index}.company`}
                            obj={incomes}
                            action={activeValidate}
                            errors={errors}
                            value={income.company}
                            setObj={company => {
                              const newInputCompany = incomes.map(input => {
                                if (income.id === input.id) {
                                  input["company"] = company.target.value
                                }
                                return input
                              })
                              setIncomes(newInputCompany)
                              setIsModification(true)
                            }}
                            width="26ch"
                          />
                          <FieldEditCopy
                            title="CNPJ"
                            field={`incomes.${index}.cnpj`}
                            obj={incomes}
                            action={activeValidate}
                            errors={errors}
                            value={income.cnpj}
                            length={18}
                            setObj={cnpj => {
                              const newInputCnpj = incomes.map(input => {
                                if (income.id === input.id) {
                                  input["cnpj"] = cnpj.target.value
                                }
                                return input
                              })
                              setIncomes(newInputCnpj)
                              setIsModification(true)
                            }}
                            width="17ch"
                          />
                          <FieldEditCopy
                            title="Cargo"
                            field={`incomes.${index}.role`}
                            obj={incomes}
                            action={activeValidate}
                            errors={errors}
                            value={income.role}
                            setObj={role => {
                              const newInputRole = incomes.map(input => {
                                if (income.id === input.id) {
                                  input["role"] = role.target.value
                                }
                                return input
                              })
                              setIncomes(newInputRole)
                              setIsModification(true)
                            }}
                            width="10ch"
                          />
                          <FieldEditCopy
                            title="Renda"
                            field={`incomes.${index}.value`}
                            obj={incomes}
                            action={activeValidate}
                            errors={errors}
                            value={income.value}
                            setObj={value => {
                              const newInputValue = incomes.map(input => {
                                if (income.id === input.id) {
                                  input["value"] = value.target.value
                                }
                                return input
                              })
                              setIncomes(newInputValue)
                              setIsModification(true)
                            }}
                            width="10ch"
                          />
                          <FieldEditCopy
                            title="Inicio"
                            field={`incomes.${index}.start_date`}
                            obj={incomes}
                            action={activeValidate}
                            errors={errors}
                            value={income.start_date}
                            setObj={startDate => {
                              const newInputStartDate = incomes.map(input => {
                                if (income.id === input.id) {
                                  input["start_date"] = maskBirthday(startDate.target.value)
                                }
                                return input
                              })
                              setIncomes(newInputStartDate)
                              setIsModification(true)
                            }}
                            width="10ch"
                            length={10}
                          />
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                }) : <div></div>}

              </TabContent>
            </CardBody>
          </Card>
        </Col>

        <Col sm="12">
          <Card>
            <CardHeader>
              <CardTitle>Contatos</CardTitle>
            </CardHeader>
            <CardBody>
              <Nav tabs>
                {contacts.length > 0 ? contacts.map((contact, index) => {
                  return <NavItem>
                    <NavLink
                      active={activeContact === `contact-${index}`}
                      onClick={() => {
                        toggleContact(`contact-${index}`)
                      }}
                    >
                      Contato {index + 1}
                    </NavLink>
                  </NavItem>
                }) : <div></div>}
                <NavItem>
                  <NavLink
                    onClick={() => setContacts([...contacts, { id: uuidv4(), type: 'Celular', contact: '' }])}
                  >
                    <Plus size={14} />
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeContact}>
                {contacts.length > 0 ? contacts.map((contact, index) => {
                  return <TabPane tabId={`contact-${index}`}>
                    <Row>
                      <Col>
                        <div className="users-page-view-table">
                          <SelectEditCopy
                            title="Tipo de Telefone"
                            field={`contacts.${index}.type`}
                            list={contactTypes}
                            obj={contacts}
                            action={activeValidate}
                            errors={errors}
                            value={contact.type}
                            valueInput={contact.type}
                            setObj={type => {
                              const newImputType = contacts.map(input => {
                                if (contact.id === input.id) {
                                  input["type"] = type.target.value
                                }
                                return input
                              })
                              setContacts(newImputType)
                              setIsModification(true)
                            }}
                            width="26ch"
                          />
                          <FieldEditCopy
                            title="Número"
                            field={`contacts.${index}.contact`}
                            obj={contacts}
                            action={activeValidate}
                            errors={errors}
                            value={contact.contact}
                            setObj={contactObj => {
                              const newInputContact = contacts.map(input => {
                                if (contact.id === input.id) {
                                  input["contact"] = applyMaskToPhone(contactObj.target.value)
                                }
                                return input
                              })
                              setContacts(newInputContact)
                              setIsModification(true)
                            }}
                            width="26ch"
                          />
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                }) : <div></div>}
              </TabContent>
            </CardBody>
          </Card>
        </Col>

        <Col sm="12">
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  <div className="users-page-view-table">
                    <FieldEditCopy
                      title="CEP"
                      field="address.zipcode"
                      obj={address}
                      action={activeValidate}
                      value={address ? address.zipcode ?? '' : ''}
                      errors={errors}
                      setObj={e => { setAddress({ ...address, zipcode: e.target.value }); setIsModification(true) }}
                      width="11ch"
                    />
                    <FieldEditCopy
                      title="Logradouro"
                      field="address.address"
                      obj={address}
                      action={activeValidate}
                      value={address ? address.address ?? '' : ''}
                      errors={errors}
                      setObj={e => { setAddress({ ...address, address: e.target.value }); setIsModification(true) }}
                      width="25ch"
                    />
                    <FieldEditCopy
                      title="Nº"
                      field="address.number"
                      obj={address}
                      action={activeValidate}
                      value={address ? address.number ?? '' : ''}
                      errors={errors}
                      setObj={e => { setAddress({ ...address, number: e.target.value }); setIsModification(true) }}
                      width="6ch"
                    />
                    <FieldEditCopy
                      title="Complemento"
                      field="address.complement"
                      obj={address}
                      action={activeValidate}
                      value={address ? address.complement ?? '' : ''}
                      errors={errors}
                      setObj={e => { setAddress({ ...address, complement: e.target.value }); setIsModification(true) }}
                      width="15ch"
                    />
                    <FieldEditCopy
                      title="Bairro"
                      field="address.neighborhood"
                      obj={address}
                      action={activeValidate}
                      value={address ? address.neighborhood ?? '' : ''}
                      errors={errors}
                      setObj={e => { setAddress({ ...address, neighborhood: e.target.value }); setIsModification(true) }}
                      width="15ch"
                    />
                    <FieldEditCopy
                      title="Cidade"
                      field="address.city"
                      obj={address}
                      action={activeValidate}
                      value={address ? address.city ?? '' : ''}
                      errors={errors}
                      setObj={e => { setAddress({ ...address, city: e.target.value }); setIsModification(true) }}
                      width="21ch"
                    />
                    <SelectEditCopy
                      title="UF"
                      field="address.uf"
                      obj={address}
                      list={ufList}
                      action={activeValidate}
                      value={address ? address.uf ?? '' : ''}
                      valueInput={address ? address.uf ?? '' : ''}
                      errors={errors}
                      setObj={e => { setAddress({ ...address, uf: e.target.value }); setIsModification(true) }}
                      width="7ch"
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
              <CardTitle>Bancos</CardTitle>
            </CardHeader>
            <CardBody>
              <Nav tabs>
                {banking_references.length > 0 ? banking_references.map((bank, index) => {
                  return <NavItem>
                    <NavLink
                      active={activeBank === `bank-${index}`}
                      onClick={() => {
                        toggleBank(`bank-${index}`)
                      }}
                    >
                      Banco {index + 1}
                    </NavLink>
                  </NavItem>
                }) : <div></div>}
                <NavItem>
                  <NavLink
                    onClick={() => setBanking_references([
                      ...banking_references, {
                        id: uuidv4(),
                        bank_code: '',
                        bank_name: '',
                        account_type: '',
                        opening_date: '',
                        agency: '',
                        account: ''
                      }
                    ])}
                  >
                    <Plus size={14} />
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeBank}>
                {banking_references.length > 0 ? banking_references.map((bank, index) => {
                  return <TabPane tabId={`bank-${index}`}>
                    <Row>
                      <Col>
                        <div className="users-page-view-table">
                          <SelectEditCopy
                            title="Banco"
                            field={`banking_references.${index}.bank_code`}
                            obj={banking_references}
                            list={banksList}
                            action={activeValidate}
                            value={bank.bank_name}
                            valueInput={bank.bank_code}
                            errors={errors}
                            setObj={bankObj => {
                              const newInputBankAccount = banking_references.map(input => {
                                if (bank.id === input.id) {
                                  input["bank_code"] = bankObj.target.value
                                  input['bank_name'] = bankObj.target.options[bankObj.target.selectedIndex].text
                                }
                                return input
                              })
                              setBanking_references(newInputBankAccount)
                              setIsModification(true)
                            }}
                            width="34ch"
                          />
                          <FieldEditCopy
                            title="Agência"
                            field={`banking_references.${index}.agency`}
                            obj={banking_references}
                            action={activeValidate}
                            value={bank.agency}
                            errors={errors}
                            setObj={bankObj => {
                              const newInputBankAgendcy = banking_references.map(input => {
                                if (bank.id === input.id) {
                                  input["agency"] = bankObj.target.value
                                }
                                return input
                              })
                              setBanking_references(newInputBankAgendcy)
                              setIsModification(true)
                            }}
                            width="20ch"
                          />
                          <FieldEditCopy
                            title="Conta"
                            field={`banking_references.${index}.account`}
                            obj={banking_references}
                            action={activeValidate}
                            value={bank.account}
                            errors={errors}
                            setObj={bankObj => {
                              const newInputBankAgendcy = banking_references.map(input => {
                                if (bank.id === input.id) {
                                  input["account"] = bankObj.target.value
                                }
                                return input
                              })
                              setBanking_references(newInputBankAgendcy)
                              setIsModification(true)
                            }}
                            width="20ch"
                          />
                          <FieldEditCopy
                            title="Data de Abertura"
                            field={`banking_references.${index}.opening_date`}
                            obj={banking_references}
                            action={activeValidate}
                            value={bank.opening_date}
                            length={10}
                            errors={errors}
                            setObj={bankObj => {
                              const newInputBankAgendcy = banking_references.map(input => {
                                if (bank.id === input.id) {
                                  input["opening_date"] = maskBirthday(bankObj.target.value)
                                }
                                return input
                              })
                              setBanking_references(newInputBankAgendcy)
                              setIsModification(true)
                            }}
                            width="10ch"
                          />
                          <SelectEditCopy
                            title="Banco"
                            field={`banking_references.${index}.account_type`}
                            obj={banking_references}
                            list={accountTypeList}
                            action={activeValidate}
                            value={bank.account_type}
                            valueInput={bank.account_type}
                            errors={errors}
                            setObj={bankObj => {
                              const newInputBankAccount = banking_references.map(input => {
                                if (bank.id === input.id) {
                                  input["account_type"] = bankObj.target.value
                                }
                                return input
                              })
                              setBanking_references(newInputBankAccount)
                              setIsModification(true)
                            }}
                            width="14ch"
                          />
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                }) : <div></div>}
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default CustomerView