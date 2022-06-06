// ** React Imports
import React from 'react'
import { useHistory } from 'react-router-dom'

// ** Third Party Components
import {Button, CardBody, CardTitle} from "reactstrap"
import Row from "reactstrap/lib/Row"
import { useDispatch, useSelector } from 'react-redux'
import { addTab } from '../../store/modules/navbar/actions'

const NoDataUser = () => {

  const history = useHistory()
  const dispatch = useDispatch()
  const tabs = useSelector(state => state.navbar.tabs)
  const permissions = useSelector(state => state.users.permissions)

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const openFormUser = () => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('register-user')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'register-user',
              name: 'Cadastro de usuário',
              active: true,
              navLink: '/cadastro-usuario',
              state: { permissions, id: 'register-user' }
            }
          ]
        ))
        history.push(
          {
            pathname: '/cadastro-usuario',
            state: { permissions, id: 'register-user' }
          }
        )
        return
      }

      if (tab.id === 'register-user') {
        tab.active = true
        history.push({
          pathname: '/cadastro-usuario',
          state: { permissions, id: 'register-user' }
        })
      }

    })
  }

  return (
    <Row>
      <CardBody>
        <CardTitle tag='h4'> =( não encontramos nenhum usuário</CardTitle>
        <Button.Ripple color='primary' className='ml-5' onClick={() => {
          openFormUser()
        }}>
          Clique aqui para cadastrar
        </Button.Ripple>
      </CardBody>
    </Row>
  )
}

export default NoDataUser
