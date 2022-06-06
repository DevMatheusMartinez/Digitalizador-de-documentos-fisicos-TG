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
import { Lock, Edit, Trash, CornerUpLeft, Plus } from "react-feather"
import { applyMaskToPhone, getOnlyNumberFromString } from "../../../support/masks"
import { useDispatch, useSelector } from "react-redux"
import { contactTypes, ufList } from "../../../support/constants"
import { v4 as uuidv4 } from 'uuid'
import Axios from "axios"
import { FieldEditCopy, SelectEditCopy } from "../components/fieldEditCopy"
import { CheckboxForm } from "../components/componentsForm"
import { TableForm } from "../components/tableForm"
import '../../styles/users.scss'
import { addUserValidate, deleteUser, editUserView, resetUserFormEditView } from "../../../store/modules/users/actions"
import { useHistory } from "react-router-dom"
import { addTab } from "../../../store/modules/navbar/actions"
import { SweetAlertQuestion, SweetAlertSuccess } from "../components/sweetAlertMessage"

const UserView = props => {
  const [userView, setUserView] = useState(props.location.state.userDataView)
  const [address, setAddress] = useState(userView ? userView.address : [])
  const [contacts, setContacts] = useState(userView ? userView.contacts : [])
  const [permissionsUuid, setPermissionsUuid] = useState([])
  const tabs = useSelector(state => state.navbar.tabs)
  const permissions = useSelector(state => state.users.permissions)
  const [userPermissions, setUserPermissions] = useState(props.location.state.userDataView ? props.location.state.userDataView.permissions : [])
  const [isModification, setIsModification] = useState(false)
  const errors = useSelector(state => state.users.errorsEditView)
  const formSuccess = useSelector(state => state.users.formSuccessEditView)
  const history = useHistory()
  
  const dispatch = useDispatch()

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
  }

  const handleDelete = (user) => {
    dispatch(deleteUser(user.uuid))
    closeForm()
  }

  const getAddressByZipcode = zipcode => {
    if (zipcode.length === 8) {
      Axios.get(`https://viacep.com.br/ws/${zipcode}/json/`)
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

  const newUser = () => {
    const permissions = userPermissions.map(permissions => permissions.uuid)

    return {
      ...userView,
      address: { ...address },
      contacts,
      permissions
    }
  }

  const newUserFullForm = () => {
    return {
      ...userView,
      address: { ...address },
      contacts,
      permissions: userPermissions
    }
  }

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const openFormUserEdit = (user) => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('edit-user')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'edit-user',
              name: 'Edição de usuário',
              active: true,
              navLink: '/editar-usuario',
              state: { permissions, id: 'edit-user', userDataView: user }
            }
          ]
        ))
        history.push(
          {
            pathname: '/editar-usuario',
            state: { permissions, id: 'edit-user', userDataView: user }
          }
        )
        return
      }

      if (tab.id === 'edit-user') {
        tab.active = true
        history.push({
          pathname: '/editar-usuario',
          state: { permissions, id: 'edit-user', userDataView: user }
        })
      }

    })
  }

  const hasPermission = permissionName => {
    return userPermissions.filter(permission => permission.permission === permissionName).length > 0
  }

  const saveViewUser = () => {
    dispatch(editUserView(newUser()))
  }

  const activeValidate = () => {
    dispatch(addUserValidate(newUser()))
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
    setIsModification(true)
  }

  const cleanError = field => {
    if (errors !== undefined) {
      if (errors[field] !== undefined) {
        delete errors[field]
        dispatch(userCleanError(errors))
      }
    }
  }

  useEffect(() => {
    if (formSuccess) {
      SweetAlertSuccess("Finalizado", "O usuário foi alterado com sucesso!", "success", function () { })
      dispatch(resetUserFormEditView())
    }
  }, [formSuccess])

  useEffect(() => {
    setPermissionsUuid(props.location.state.permissions)
  }, [])

  return (
    <React.Fragment>
      <Row>
        <Col sm="12">
          <Card style={{ position: 'fixed', zIndex: '6', left: 'auto', right: '50px' }}>
            <CardBody>
              <Button.Ripple className="mr-1" color="success" onClick={() => { saveViewUser(); setIsModification(false) }}>
                <Edit size={15} />
                <span className="align-middle ml-50">Salvar Alterações</span>
              </Button.Ripple>
              <Button.Ripple className="mr-1" color="primary" onClick={() => openFormUserEdit(newUserFullForm())}>
                <Edit size={15} />
                <span className="align-middle ml-50">Abrir Formulário</span>
              </Button.Ripple>
              <Button.Ripple color="danger" className="mr-1" onClick={() => {
                SweetAlertQuestion("Deseja excluir este usuário", "Não pode ser disfeito", "question", function () { handleDelete(newUserFullForm()) }, function () { })
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
              <CardTitle>Usuário</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  <div className="users-page-view-table">
                    <FieldEditCopy
                      title="Nome"
                      field="name"
                      obj={userView}
                      action={activeValidate}
                      value={userView.name}
                      errors={errors}
                      setObj={e => { setUserView({ ...userView, name: e.target.value }); setIsModification(true) }}
                      width="25ch"
                    />
                    <FieldEditCopy
                      title="Email"
                      field="email"
                      obj={userView}
                      value={userView.email}
                      action={activeValidate}
                      errors={errors}
                      setObj={e => { setUserView({ ...userView, email: e.target.value }); setIsModification(true) }}
                      width="32ch"
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
                      zipcode={e => { getAddressByZipcode(getOnlyNumberFromString(e.target.value)) }}
                      action={activeValidate}
                      errors={errors}
                      value={address ? address.zipcode ?? '' : ''}
                      setObj={e => { setAddress({ ...address, zipcode: e.target.value }); setIsModification(true) }}
                      width="11ch"
                    />
                    <FieldEditCopy
                      title="Rua"
                      field="address.address"
                      obj={address}
                      action={activeValidate}
                      errors={errors}
                      value={address ? address.address ?? '' : ''}
                      setObj={e => { setAddress({ ...address, address: e.target.value }); setIsModification(true) }}
                      width="25ch"
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
                      errors={errors}
                      value={address ? address.city ?? '' : ''}
                      setObj={e => { setAddress({ ...address, city: e.target.value }); setIsModification(true) }}
                      width="21ch"
                    />
                    <FieldEditCopy
                      title="Complemento"
                      field="address.complement"
                      obj={address}
                      action={activeValidate}
                      errors={errors}
                      value={address ? address.complement ?? '' : ''}
                      setObj={e => { setAddress({ ...address, complement: e.target.value }); setIsModification(true) }}
                      width="21ch"
                    />
                    <FieldEditCopy
                      title="Nº"
                      field="address.number"
                      obj={address}
                      action={activeValidate}
                      errors={errors}
                      value={address ? address.number ?? '' : ''}
                      setObj={e => { setAddress({ ...address, number: e.target.value }); setIsModification(true) }}
                      width="6ch"
                    />
                    <SelectEditCopy
                      title="Estado"
                      field="address.uf"
                      list={ufList}
                      obj={address}
                      action={activeValidate}
                      errors={errors}
                      value={address ? address.uf ?? '' : ''}
                      setObj={e => { setAddress({ ...address, uf: e.target.value }); setIsModification(true) }}
                      width="6ch"
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
              <CardTitle>Contatos</CardTitle>
            </CardHeader>
            <CardBody>
              {contacts ? contacts.map((contact, index) => {
                return <div>
                  <Row>
                    <Col>
                      <div className="users-page-view-table">
                        <SelectEditCopy
                          title="Tipo de Telefone"
                          field={`contacts.${index}.type`}
                          list={contactTypes}
                          action={activeValidate}
                          errors={errors}
                          value={contact.type}
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
                          width="10ch"
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className="users-page-view-table">
                        <FieldEditCopy
                          title="Número"
                          field={`contacts.${index}.contact`}
                          action={activeValidate}
                          errors={errors}
                          value={contact.contact}
                          setObj={contactField => {
                            const newInputContact = contacts.map(input => {
                              if (contact.id === input.id) {
                                input["contact"] = applyMaskToPhone(contactField.target.value)
                              }
                              return input
                            })
                            setContacts(newInputContact)
                            setIsModification(true)
                          }}
                          width="11ch"
                        />
                      </div>
                    </Col>
                    <Col>
                      <Button
                        color="danger"
                        outline
                        size='sm'
                        onClick={id => {
                          const values = [...contacts]
                          values.splice(values.findIndex(value => value.id === id), 1)
                          setContacts(values)
                        }}
                      >Excluir</Button>
                    </Col>
                  </Row>
                </div>
              }) : <div>Não Inserido</div>}
              <Button.Ripple className='btn-icon' color='primary'
                onClick={() => setContacts([...contacts, { id: uuidv4(), type: 'Celular', contact: '' }])}>
                <Plus size={14} />
                <span className='align-middle ml-25'>Adicionar novo</span>
              </Button.Ripple>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12">
          <Card>
            <CardHeader className="border-bottom pb-1 mx-2 px-0">
              <CardTitle>
                <Lock size={18} />
                <span className="align-middle ml-50">Permissões</span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <CheckboxForm
                  lg="8"
                  md="8"
                  sm="12"
                  id="data-admin"
                  label="Administrador"
                  value="admin"
                  defaultChecked={userView.admin}
                  onChange={e => { setUserView({ ...userView, admin: e.target.checked }); setIsModification(true) }}
                />
              </Row>
              <TableForm
               checkedUserIndex={userView.admin || hasPermission('users.index')} valueUserIndex={'users.index'}
                checkedUserStore={userView.admin || hasPermission('users.store')} valueUserStore={'users.store'}
                checkedUserUpdate={userView.admin || hasPermission('users.update')} valueUserUpdate={'users.update'}
                checkedUserDestroy={userView.admin || hasPermission('users.destroy')} valueUserDestroy={'users.destroy'}
                checkedFileIndex={userView.admin || hasPermission('files.index')} valueFileIndex={'files.index'}
                checkedFileStore={userView.admin || hasPermission('files.store')} valueFileStore={'files.store'}
                checkedFileDestroy={userView.admin || hasPermission('files.destroy')} valueFileDestroy={'files.destroy'}
                onChange={e => { updateUserPermissions(e.target); cleanError('permissions') }} field={'permissions'} errors={errors}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default UserView