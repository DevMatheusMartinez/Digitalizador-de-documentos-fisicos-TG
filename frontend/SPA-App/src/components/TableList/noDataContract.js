// ** React Imports
import React from 'react'
import { useHistory } from 'react-router-dom'

// ** Third Party Components
import { Button, CardBody, CardTitle, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from "reactstrap"
import Row from "reactstrap/lib/Row"
import { useDispatch, useSelector } from 'react-redux'
import { addTab } from '../../store/modules/navbar/actions'
import { Plus } from "react-feather"


const NoDataContract = () => {

  const history = useHistory()
  const dispatch = useDispatch()
  const tabs = useSelector(state => state.navbar.tabs)

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const openFormContract = (type) => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('register-contract')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'register-contract',
              name: 'Cadastro de contrato',
              active: true,
              navLink: '/cadastro-contrato',
              state: { type, id: 'register-contract' }
            }
          ]
        ))
        history.push(
          {
            pathname: '/cadastro-contrato',
            state: { type, id: 'register-contract' }
          }
        )
        return
      }

      if (tab.id === 'register-contract') {
        tab.active = true
        history.push({
          pathname: '/cadastro-contrato',
          state: { type, id: 'register-contract' }
        })
      }

    })
  }

  return (
    <Row>
      <CardBody>
        <CardTitle tag='h4'> =( não encontramos nenhum contrato</CardTitle>
        <UncontrolledDropdown className="data-list-dropdown mr-1">
          <DropdownToggle className="p-1" color="primary">
            <Plus size={15} />
            <span className="align-middle mr-1">Cadastrar contrato</span>
          </DropdownToggle>
          <DropdownMenu tag="div" right>
            <DropdownItem tag="a" onClick={() => openFormContract("compra")}>Compra</DropdownItem>
            <DropdownItem tag="b" onClick={() => openFormContract("venda")}>Venda</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardBody>
    </Row>
  )
}

export default NoDataContract
