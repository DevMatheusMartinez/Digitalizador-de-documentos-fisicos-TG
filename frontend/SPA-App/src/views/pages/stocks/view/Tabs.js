// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

// ** Icons Imports
import { User, Lock, Bookmark, Bell, Link } from 'react-feather'

// ** User Components
import SecurityTab from './SecurityTab'

const UserTabs = ({ active, toggleTab, stock, setStock }) => {

  return (
    <Fragment>
      <Nav pills className='mb-2'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <Lock className='font-medium-3 me-50' />
            <span className='fw-bold'>Site</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <SecurityTab stock={stock} setStock={obj => setStock(obj)} />
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default UserTabs
