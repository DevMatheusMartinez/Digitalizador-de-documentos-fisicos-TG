import { AlertTriangle, MapPin } from "react-feather"
import {
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap"
import React, { useState, useEffect } from "react"
import Row from "reactstrap/es/Row"
import {
  getOnlyNumberFromString
} from '../../../support/masks'
import {
  FaRegAddressCard,
  FaRegAddressBook
} from "react-icons/fa"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { addAddressSaved, addContactSaved, addUser, addUserSaved, editUser, resetUserForm, resetUserFormSaved, userCleanError } from "../../../store/modules/users/actions"
import { CheckboxForm, InputForm, SelectForm } from "../components/componentsForm"
import { DividerText } from "../components/dividerText"
import { TableForm } from "../components/tableForm"
import { AddressForm } from "../components/addressForm"
import { GroupButtons } from "../components/groupButtons"
import { SweetAlertQuestion, SweetAlertSuccess } from "../components/sweetAlertMessage"
import { addTab } from "../../../store/modules/navbar/actions"
import { useHistory } from "react-router-dom"
import { ContactForm } from "../components/contactForm"

const FullForm = props => {
  const dispatch = useDispatch()
  const tabs = useSelector(state => state.navbar.tabs)
  const userSaved = useSelector(state => state.users.userSaved)
  const contactSaved = useSelector(state => state.users.contactSaved)
  const addressSaved = useSelector(state => state.users.addressSaved)
  const [user, setUser] = useState(userSaved ?? {})
  const [userPermissions, setUserPermissions] = useState([])
  const [address, setAddress] = useState(addressSaved ?? {})
  const [active, setActive] = useState("personalData")
  const errors = useSelector(state => state.users.errors)
  const formSuccess = useSelector(state => state.users.formSuccess)
  const [inputContacts, setInputContacts] = useState(contactSaved ?? [])
  const [permissionsUuid, setPermissionsUuid] = useState([])
  const history = useHistory()

  useEffect(() => {
    dispatch(addUserSaved(user))
    dispatch(addContactSaved(inputContacts))
    dispatch(addAddressSaved(address))
  })

  const toggle = tab => {
    return active !== tab && setActive(tab)
  }

  const getAddressByZipcode = zipcode => {
    if (zipcode.length === 8) {
      axios.get(`https://viacep.com.br/ws/${zipcode}/json/`)
        .then(response => {
          const addressInfo = response.data
          setAddress({
            ...address,
            address: addressInfo.logradouro ?? '',
            city: addressInfo.localidade ?? '',
            neighborhood: addressInfo.bairro ?? ''
          })
        })
        .catch(err => {
        })
    }
  }

  const saveUser = () => {
    const permissions = userPermissions.map(permissions => permissions.uuid)

    const userToSave = {
      ...user,
      contacts: inputContacts,
      address: { ...address },
      permissions
    }

    dispatch(addUser(userToSave))
  }

  const updateUserPermissions = (element) => {
    let permissions = userPermissions.filter(permission => permission.permission !== element.value)
    const permissionsUi = permissionsUuid.filter(permission => permission.permission === element.value)

    const elementName = element.value.split(".")[0]

    if (element.checked) {
      switch (element.value) {
        case `${elementName}.destroy`: {
          permissions = [
            ...userPermissions,
            {
              permission: element.value,
              uuid: permissionsUi[0].uuid
            },
            {
              permission: `${elementName}.update`,
              uuid: permissionsUuid.filter(permission => permission.permission === `${elementName}.update`)[0].uuid
            },
            {
              permission: `${elementName}.store`,
              uuid: permissionsUuid.filter(permission => permission.permission === `${elementName}.store`)[0].uuid
            },
            {
              permission: `${elementName}.index`,
              uuid: permissionsUuid.filter(permission => permission.permission === `${elementName}.index`)[0].uuid
            }
          ]
          break
        }
        case `${elementName}.update`: {
          permissions = [
            ...userPermissions,
            {
              permission: element.value,
              uuid: permissionsUi[0].uuid
            },
            {
              permission: `${elementName}.store`,
              uuid: permissionsUuid.filter(permission => permission.permission === `${elementName}.store`)[0].uuid
            },
            {
              permission: `${elementName}.index`,
              uuid: permissionsUuid.filter(permission => permission.permission === `${elementName}.index`)[0].uuid
            }
          ]
          break
        }
        case `${elementName}.store`: {
          permissions = [
            ...userPermissions,
            {
              permission: element.value,
              uuid: permissionsUi[0].uuid
            },
            {
              permission: `${elementName}.index`,
              uuid: permissionsUuid.filter(permission => permission.permission === `${elementName}.index`)[0].uuid
            }
          ]
          break
        }
        case `${elementName}.index`: {
          permissions = [
            ...userPermissions,
            {
              permission: element.value,
              uuid: permissionsUi[0].uuid
            }
          ]
          break
        }
      }
    }

    permissions = permissions.map(permission => JSON.stringify(permission))
      .reduce((acc, cur) => (acc.includes(cur) || acc.push(cur), acc), [])
      .map(permission => JSON.parse(permission))
    setUserPermissions(permissions)
  }

  const cleanError = field => {
    if (errors !== undefined) {
      if (errors[field] !== undefined) {
        delete errors[field]
        dispatch(userCleanError(errors))
      }
    }
  }

  const hasPermission = permissionName => {
    return userPermissions.filter(permission => permission.permission === permissionName).length > 0
  }

  useEffect(() => {

    setPermissionsUuid(props.location.state.permissions)

    if (user.uuid === undefined) {
      setUser({ ...user, admin: false })
    }
  }, [])

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
        dispatch(resetUserFormSaved())
        return
      }
    }
    history.push({
      pathname: '/usuarios',
      state: []
    })
    dispatch(addTab(
      [
        {
          id: 'users',
          name: 'Usuários',
          active: true,
          navLink: '/usuarios'
        }
      ]
    ))
    dispatch(resetUserFormSaved())
  }


  useEffect(() => {
    if (formSuccess) {
      SweetAlertSuccess("Finalizado", "O usuário foi cadastrado com sucesso!", "success", function () {
        closeForm()
      }
      )
      dispatch(resetUserForm())
      dispatch(resetUserFormSaved())
    }

  }, [formSuccess])

  const activeClass = { borderBottom: '#106aae solid 2px', borderRadius: '2px', color: '#106aae' }
  const errorClass = { borderBottom: '#ea5455 solid 2px', borderRadius: '2px', color: '#ea5455' }
  const [styleTabPersonal, setStyleTabPersonal] = useState(activeClass)
  const [styleTabResidential, setStyleTabResidential] = useState({})
  const [styleTabContact, setStyleTabContact] = useState({})
  const [errorPersonal, setErrorPersonal] = useState(false)
  const [errorResidential, setErrorResidential] = useState(false)
  const [errorContact, setErrorContact] = useState(false)

  useEffect(() => {
    setErrorPersonal(false)
    setErrorResidential(false)
    setErrorContact(false)

    if ((errors['name'] !== undefined || errors['email'] !== undefined || errors['cpf'] !== undefined)) {
      setStyleTabPersonal(errorClass)
      setErrorPersonal(true)
    }

    if ((errors['address.address'] !== undefined ||
      errors['address.city'] !== undefined ||
      errors['address.neighborhood'] !== undefined ||
      errors['address.number'] !== undefined ||
      errors['address.uf'] !== undefined)) {
      setStyleTabResidential(errorClass)
      setErrorResidential(true)
    }

    inputContacts.map((input, index) => {
      if (errors[`contacts.${index}.type`] !== undefined || errors[`contacts.${index}.contact`] !== undefined) {
        setStyleTabContact(errorClass)
        setErrorContact(true)
      }
    })

  }, [errors])

  return (
    <div>
      <Card className='app-user-edit'>
        <CardBody>
          <Nav tabs>
            <NavItem style={styleTabPersonal} >
              <NavLink id="controlledPopover1" style={{ color: styleTabPersonal.color }}
                onClick={() => {
                  toggle("personalData")
                  setStyleTabPersonal(activeClass)
                  setStyleTabResidential(errorResidential ? errorClass : {})
                  setStyleTabContact(errorContact ? errorClass : {})
                }}
              >
                {
                  errorPersonal ? <AlertTriangle size='18' /> : <FaRegAddressCard size='18' />
                }
                {" Pessoais"}

              </NavLink>
            </NavItem>
            <NavItem className="mx-1" style={styleTabResidential}>
              <NavLink id="controlledPopover2" style={{ color: styleTabResidential.color }}
                onClick={() => {
                  toggle("residentialData")
                  setStyleTabPersonal(errorPersonal ? errorClass : {})
                  setStyleTabResidential(activeClass)
                  setStyleTabContact(errorContact ? errorClass : {})
                }}
              >
                {
                  errorResidential ? <AlertTriangle size='18' /> : <MapPin size='18' />
                }
                {" Residenciais"}
              </NavLink>
            </NavItem>
            <NavItem className="mx-1" style={styleTabContact}>
              <NavLink id="controlledPopover3" style={{ color: styleTabContact.color }}
                onClick={() => {
                  toggle("contactData")
                  setStyleTabPersonal(errorPersonal ? errorClass : {})
                  setStyleTabResidential(errorResidential ? errorClass : {})
                  setStyleTabContact(activeClass)
                }}
              >
                {
                  errorContact ? <AlertTriangle size='18' /> : <FaRegAddressBook size='18' />
                }
                {" Contato"}
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={active}>
            <TabPane tabId="personalData">
              <Row>
                <InputForm
                  errors={errors}
                  ch='25ch'
                  field="name"
                  id="data-name"
                  placeholder="Nome"
                  value={user.name ?? ''}
                  className="form-control"
                  classNameFormGroup="mr-1 ml-1"
                  type="text"
                  title="Nome *"
                  name="name"
                  functionChange={e => setUser({ ...user, name: e.target.value })}
                />
                <InputForm
                  errors={errors}
                  ch="32ch"
                  field="email"
                  id="data-email"
                  placeholder="Email"
                  value={user.email ?? ''}
                  className="form-control"
                  type="email"
                  title="Email *"
                  name="email"
                  functionChange={e => setUser({ ...user, email: e.target.value })}
                />
              </Row>
              <Row>
                <CheckboxForm
                  lg="8"
                  md="8"
                  sm="12"
                  id="data-admin"
                  label="Administrador"
                  value="admin"
                  defaultChecked={user.admin}
                  onChange={e => setUser({ ...user, admin: e.target.checked })}
                />
              </Row>
              <DividerText title="Permissões" />
              <TableForm
                checkedUserIndex={user.admin || hasPermission('users.index')} valueUserIndex={'users.index'}
                checkedUserStore={user.admin || hasPermission('users.store')} valueUserStore={'users.store'}
                checkedUserUpdate={user.admin || hasPermission('users.update')} valueUserUpdate={'users.update'}
                checkedUserDestroy={user.admin || hasPermission('users.destroy')} valueUserDestroy={'users.destroy'}
                checkedFileIndex={user.admin || hasPermission('files.index')} valueFileIndex={'files.index'}
                checkedFileStore={user.admin || hasPermission('files.store')} valueFileStore={'files.store'}
                checkedFileDestroy={user.admin || hasPermission('files.destroy')} valueFileDestroy={'files.destroy'}
                onChange={e => { updateUserPermissions(e.target); cleanError('permissions') }} field={'permissions'} errors={errors}
              />
            </TabPane>
            <TabPane tabId="residentialData">
              <AddressForm address={address} errors={errors}
                functionChangeZipcode={e => {
                  if (e.target.value === "") {
                    setAddress({})
                    return
                  }
                  setAddress({ ...address, zipcode: e.target.value })

                }}
                onBlurZipcode={e => { getAddressByZipcode(getOnlyNumberFromString(e.target.value)) }}
                functionChangeAddress={e => setAddress({ ...address, address: e.target.value })}
                functionChangeNumber={e => setAddress({ ...address, number: e.target.value })}
                functionChangeComplement={e => setAddress({ ...address, complement: e.target.value })}
                functionChangeNeighborhood={e => setAddress({ ...address, neighborhood: e.target.value })}
                functionChangeCity={e => setAddress({ ...address, city: e.target.value })}
                functionChangeUF={uf => setAddress({ ...address, uf: uf.value })}
                activeExtraFields={false}
              />
            </TabPane>
            <TabPane tabId="contactData">
              <ContactForm
                inputContacts={inputContacts}
                errors={errors}
                setInputContacts={obj => setInputContacts(obj)}
              />
            </TabPane>
          </TabContent>
          <hr />

          <GroupButtons uuid={user.uuid} functionCancel={() => SweetAlertQuestion("Deseja cancelar o cadastro?", "", "question", closeForm, function () { })} functionSave={() => saveUser()} />
        </CardBody>
      </Card>
    </div>

  )
}
export default FullForm
