import React, { Fragment, useEffect, useState } from "react"
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody
} from "reactstrap"
import classnames from "classnames"
import { Settings, Lock } from "react-feather"
import ProfileTab from "./profile"
import '../../styles/account-settings.scss'
import { useDispatch } from "react-redux"
import * as Icon from "react-feather"
import ChangePassword from "./changePassword"
import TermsList from "../terms/list"
import Tenant from "./tenant"

const AccountSettings = () => {
  const dispatch = useDispatch()
  const [state, setState] = useState({
    activeTab: "1",
    windowWidth: null
  })
  const page = <Fragment> <Icon.User size={24} /> Editar Perfil</Fragment>

  const toggle = tab => {
    setState({
      activeTab: tab
    })
  }

  const updateWidth = () => {
    setState({ windowWidth: window.innerWidth })
  }

  useEffect(() => {
    if (window !== undefined) {
      updateWidth()
      window.addEventListener("resize", updateWidth())
      toggle("1")
    }
  }, [])

  const { windowWidth } = state
  return (
    <React.Fragment>
      <div className={`${windowWidth >= 769 ? "nav-vertical" : "account-setting-wrapper"}`}>
        <Nav className="account-settings-tab nav-left mr-0 mr-sm-3" tabs>
          <NavItem>
            <NavLink
              className={classnames({
                active: state.activeTab === "1"
              })}
              onClick={() => {
                toggle("1")
              }}
            >
              <Settings size={16} />
              <span className="d-md-inline-block d-none align-middle ml-1">Conta</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: state.activeTab === "2"
              })}
              onClick={() => {
                toggle("2")
              }}
            >
              <Icon.Home size={16} />
              <span className="d-md-inline-block d-none align-middle ml-1">Empresa</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: state.activeTab === "3"
              })}
              onClick={() => {
                toggle("3")
              }}
            >
              <Lock size={16} />
              <span className="d-md-inline-block d-none align-middle ml-1">Alterar Banco</span>
            </NavLink>
          </NavItem>
        </Nav>
        <Card>
          <CardBody>
            <TabContent activeTab={state.activeTab}>
              <TabPane tabId="1">
                <ProfileTab />
              </TabPane>
              <TabPane tabId="2">
                <Tenant />
              </TabPane>
              <TabPane tabId="3">
                <ChangePassword />
              </TabPane>
              <TabPane tabId="4">
                <TermsList />
              </TabPane>
              <TabPane tabId="5">
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  )
}


export default AccountSettings
