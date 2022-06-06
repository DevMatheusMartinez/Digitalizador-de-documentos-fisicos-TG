// ** React Imports
import { useEffect } from 'react'
import { NavLink, useLocation, matchPath, useParams } from 'react-router-dom'

// ** Third Party Components
import { Badge } from 'reactstrap'
import classnames from 'classnames'

// ** Vertical Menu Array Of Items
import navigation from '@src/navigation/vertical'

// ** Utils
import { isNavLinkActive, search, getAllParents } from '@layouts/utils'
import { useDispatch, useSelector } from 'react-redux'
import { addTab } from '../../../../../store/modules/navbar/actions'

const VerticalNavMenuLink = ({
  item,
  groupActive,
  setGroupActive,
  activeItem,
  setActiveItem,
  groupOpen,
  setGroupOpen,
  toggleActiveGroup,
  parentItem,
  routerProps,
  currentActiveItem
}) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink

  // ** URL Vars
  const location = useLocation()
  const currentURL = location.pathname

  const dispatch = useDispatch()
  const tabs = useSelector(state => state.navbar.tabs)

  // ** To match path
  const match = matchPath(currentURL, {
    path: `${item.navLink}/:param`,
    exact: true,
    strict: false
  })

  // ** Search for current item parents
  const searchParents = (navigation, currentURL) => {
    const parents = search(navigation, currentURL, routerProps) // Search for parent object
    const allParents = getAllParents(parents, 'id') // Parents Object to Parents Array
    return allParents
  }

  // ** URL Vars
  const resetActiveGroup = navLink => {
    const parents = search(navigation, navLink, match)
    toggleActiveGroup(item.id, parents)
  }

  // ** Reset Active & Open Group Arrays
  const resetActiveAndOpenGroups = () => {
    setGroupActive([])
    setGroupOpen([])
  }

  // ** Checks url & updates active item
  useEffect(() => {
    if (currentActiveItem !== null) {
      setActiveItem(currentActiveItem)
      const arr = searchParents(navigation, currentURL)
      setGroupActive([...arr])
    }
  }, [location])

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  return (
    <li
      className={classnames({
        'nav-item': !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem
      })}
    >
      <LinkTag
        className='d-flex align-items-center'
        target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
            href: item.navLink || '/'
          }
          : {
            to: item.navLink || '/',
            isActive: (match, location) => {
              if (!match) {
                return false
              }

              if (match.url && match.url !== '' && match.url === item.navLink) {
                currentActiveItem = item.navLink
              }
            }
          })}
        /*eslint-enable */
        onClick={e => {

          // {
          //   id: item.id,
          //   name: item.title,
          //   active: true
          // }

          if (!item.navLink.length) {
            e.preventDefault()
          }
          parentItem ? resetActiveGroup(item.navLink) : resetActiveAndOpenGroups()

          tabs.map(tab => {
            tab.active = false
          })

          if (!exist(item.id)) {
            dispatch(addTab(
              [
                ...tabs,
                {
                  id: item.id,
                  name: item.title,
                  active: true,
                  navLink: item.navLink
                }
              ]
            ))
            return
          }

          tabs.map(tab => {
            if (tab.id === item.id) {
              tab.active = true
            }
          })

          dispatch(addTab([...tabs]))
        }}
      >
        {item.icon}
        <span className='menu-item text-truncate'>{item.title}</span>

        {item.badge && item.badgeText ? (
          <Badge className='ml-auto mr-1' color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  )
}

export default VerticalNavMenuLink
