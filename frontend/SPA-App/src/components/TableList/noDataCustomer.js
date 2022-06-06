// ** React Imports
import React from 'react'
import { useHistory } from 'react-router-dom'

// ** Third Party Components
import {Button, CardBody, CardTitle} from "reactstrap"
import Row from "reactstrap/lib/Row"
import { useDispatch, useSelector } from 'react-redux'
import { addTab } from '../../store/modules/navbar/actions'

const NoDataCustomer = () => {

  const history = useHistory()
  const dispatch = useDispatch()
  const tabs = useSelector(state => state.navbar.tabs)
  const permissions = useSelector(state => state.users.permissions)

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const openFormCustomer = () => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('register-customer')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'register-customer',
              name: 'Cadastro de cliente',
              active: true,
              navLink: '/cadastro-cliente',
              state: { id: 'register-customer' }
            }
          ]
        ))
        history.push(
          {
            pathname: '/cadastro-cliente',
            state: { id: 'register-customer' }
          }
        )
        return
      }

      if (tab.id === 'register-customer') {
        tab.active = true
        history.push({
          pathname: '/cadastro-cliente',
          state: { id: 'register-customer' }
        })
      }

    })
  }

  return (
    <Row>
      <CardBody>
        <CardTitle tag='h4'> =( não encontramos nenhum cliente</CardTitle>
        <Button.Ripple color='primary' className='ml-5' onClick={() => {
          openFormCustomer()
        }}>
          Clique aqui para cadastrar
        </Button.Ripple>
      </CardBody>
    </Row>
  )
}

export default NoDataCustomer
