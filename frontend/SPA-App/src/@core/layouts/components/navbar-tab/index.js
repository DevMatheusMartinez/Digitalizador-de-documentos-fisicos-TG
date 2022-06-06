// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Custom Components
import Nav from "reactstrap/lib/Nav"
import NavItem from "reactstrap/lib/NavItem"
import NavLink from "reactstrap/lib/NavLink"
import { XCircle } from "react-feather"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from 'react-router'
import { addTab } from '../../../../store/modules/navbar/actions'
import { resetUserFormEditSaved, resetUserFormSaved } from '../../../../store/modules/users/actions'
import { resetCustomerForm, resetCustomerFormEditSaved, resetCustomerFormSaved } from '../../../../store/modules/customers/actions'
import { fileDigitalize, resetVehicleFormEditSaved } from '../../../../store/modules/vehicles/actions'
import { resetContractsFormEditSaved, resetContractsFormSaved } from '../../../../store/modules/contracts/actions'
import { SweetAlertQuestion } from '../../../../views/pages/components/sweetAlertMessage'

const NavbarTab = props => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  // ** States
  const tabs = useSelector(state => state.navbar.tabs)

  const [tabLink, setTabLink] = useState("")

  const history = useHistory()

  const dispatch = useDispatch()

  function removeById(array, id) {
    return array.filter(function (el) {
      return el.id !== id
    })
  }
  //guias
  return (
    <Fragment>
      <Nav tabs>
        {tabs.map(tab => {
          return (
            <NavItem key={tab.id}>
              <NavLink active={tab.active}>
                <span onClick={() => {
                  tabs.map(tabMap => {
                    if (tabMap.id === tab.id) {
                      tabMap.active = true
                      return
                    }
                    tabMap.active = false
                  })

                  tabs.map(tabMap => {
                    if (tabMap.id === tab.id) {
                      history.push({
                        pathname: tabMap.navLink,
                        state: tabMap.state
                      })
                      return
                    }
                    tabMap.active = false
                  })

                  dispatch(addTab([...tabs]))
                }}>{tab.name}</span>
                {!tab.active || tabs.length === 1 ? '' : <XCircle className="ml-1" size="15" onClick={() => {
                  SweetAlertQuestion("Deseja fechar esta aba?", "Vocẽ poderá perder os dados não salvo", 'question', function () {
                    if (tabs.length > 1) {
                      const objTabs = removeById(tabs, tab.id)

                      if (objTabs.length - 1 >= 0) {
                        const itemCurrent = objTabs[objTabs.length - 1]
                        itemCurrent.active = true
                        history.push({
                          pathname: itemCurrent.navLink,
                          state: itemCurrent.state
                        })
                      }

                      if (tab.id === 'edit-user') {
                        dispatch(resetUserFormEditSaved())
                      }

                      if (tab.id === 'register-user') {
                        dispatch(resetUserFormSaved())
                      }

                      if (tab.id === 'register-customer') {
                        dispatch(resetCustomerFormSaved())
                        dispatch(resetCustomerForm())
                      }

                      if (tab.id === 'edit-customer') {
                        dispatch(resetCustomerFormEditSaved())
                      }

                      if (tab.id === 'file-digitalize') {
                        dispatch(fileDigitalize())
                      }

                      if (tab.id === 'file-scanner') {
                        dispatch(fileScanner())
                      }

                      if (tab.id === 'register-contract') {
                        dispatch(resetContractsFormSaved())
                      }

                      if (tab.id === 'edit-contract') {
                        dispatch(resetContractsFormEditSaved())
                      }

                      dispatch(addTab([...objTabs]))
                    }
                  }, function () { })

                }} />}
              </NavLink>
            </NavItem>
          )
        })}
      </Nav>
    </Fragment>
  )
}

export default NavbarTab
