// ** React Imports
import { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { handleLogout } from '@store/actions/auth'
import api from "@src/services/api"


// ** Third Party Components
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import { User, Power } from 'react-feather'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'
import { addTab } from '../../../../store/modules/navbar/actions'

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const history = useHistory()
  const tabs = useSelector(state => state.navbar.tabs)

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const openFormConfiguration = () => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('configuration')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'configuration',
              name: 'Configurações',
              active: true,
              navLink: '/configurações',
              state: { id: 'configuration' }
            }
          ]
        ))
        history.push(
          {
            pathname: '/configurações',
            state: { id: 'configuration' }
          }
        )
        return
      }

      if (tab.id === 'configuration') {
        tab.active = true
        history.push({
          pathname: '/configurações',
          state: { id: 'configuration' }
        })
      }

    })
  }

  const logout = () => {
    localStorage.removeItem("@masterrevenda-app:token")
    history.push("/login")
  }

  // ** State
  const [userData, setUserData] = useState(null)

  const [userLogged, setUserLogged] = useState([])
  const [tenantsLogged, setTenantsLogged] = useState([])

  const handleCurrentUserLogged = () => {
    api.get(`/users/userLogged`).then(response => {

      setUserLogged(response.data.data)
      setTenantsLogged(response.data.data.tenants[0])
    }).catch(err => {
    }
    )
  }

  const getInitial = name => {
    const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')

    if (typeof name === 'string') {
      const initials = [...name.matchAll(rgx)] || []

      return (
        (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
      ).toUpperCase()
    }
    return ''
  }

  //** ComponentDidMount
  useEffect(() => {
    handleCurrentUserLogged()
  }, [])

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar

  console.log(userLogged)
  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name font-weight-bold'>{userLogged.name}</span>
          <span className='user-status'>{tenantsLogged.name}</span>
        </div>
        {userLogged.avatar ? <Avatar img={userLogged.avatar} imgHeight='40' imgWidth='40' status='online' /> : <div className="avatar mr-1 bg-default">
          <span className="avatar-content">{getInitial(userLogged.name)}</span>
        </div>}

      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to='#' onClick={e => { e.preventDefault(); openFormConfiguration() }}>
          <User size={14} className='mr-75' />
          <span className='align-middle'>Configurações</span>
        </DropdownItem>
        <DropdownItem onClick={() => logout()}>
          <Power size={14} className='mr-75' />
          <span className='align-middle'>Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
