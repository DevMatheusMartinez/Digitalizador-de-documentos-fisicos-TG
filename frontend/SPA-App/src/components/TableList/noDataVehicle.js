// ** React Imports
import React from 'react'
import { useHistory } from 'react-router-dom'

// ** Third Party Components
import {Button, CardBody, CardTitle} from "reactstrap"
import Row from "reactstrap/lib/Row"
import { useDispatch, useSelector } from 'react-redux'
import { addTab } from '../../store/modules/navbar/actions'

const NoDataVehicle = () => {

  const history = useHistory()
  const dispatch = useDispatch()
  const tabs = useSelector(state => state.navbar.tabs)

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const openFormVehicle = () => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('register-vehicle')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'register-vehicle',
              name: 'Cadastro de veículo',
              active: true,
              navLink: '/cadastro-veiculo',
              state: { id: 'register-vehicle' }
            }
          ]
        ))
        history.push(
          {
            pathname: '/cadastro-veiculo',
            state: { id: 'register-vehicle' }
          }
        )
        return
      }

      if (tab.id === 'register-vehicle') {
        tab.active = true
        history.push({
          pathname: '/cadastro-veiculo',
          state: { id: 'register-vehicle' }
        })
      }

    })
  }

  return (
    <Row>
      <CardBody>
        <CardTitle tag='h4'> =( não encontramos nenhum veículo</CardTitle>
        <Button.Ripple color='primary' className='ml-5' onClick={() => {
          openFormVehicle()
        }}>
          Clique aqui para cadastrar
        </Button.Ripple>
      </CardBody>
    </Row>
  )
}

export default NoDataVehicle
