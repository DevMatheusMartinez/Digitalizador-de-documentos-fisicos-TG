// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Plus } from 'react-feather'

// ** Reactstrap Imports
import {
  Col,
  Card,
  Input,
  Label,
  Button,
  CardHeader
} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUsersRequest, changeFilter, getPermissions, resetUserFormEditSaved, changeCurrentPage, deleteUser } from '../../../store/modules/users/actions'
import { ActionsComponent } from '../components/actionsComponentsList'
import api from "@src/services/api"
import { addTab } from '../../../store/modules/navbar/actions'
import { useHistory } from 'react-router-dom'
import { SweetAlertQuestion } from '../components/sweetAlertMessage'
import NoDataUser from '../../../components/TableList/noDataUser'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const UsersList = () => {

  const history = useHistory()

  // ** States
  const [searchValue, setSearchValue] = useState('')
  const [userToDelete, setUserToDelete] = useState(null)
  const [defaultAlert, setDefaultAlert] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(changeFilter(searchValue))
    dispatch(getUsersRequest())
    dispatch(getPermissions())
  }, [dispatch])

  const users = useSelector(state => state.users.data)
  const totalPages = useSelector(state => state.users.lastPage)
  const currentPage = useSelector(state => state.users.currentPage)
  const permissions = useSelector(state => state.users.permissions)
  const tabs = useSelector(state => state.navbar.tabs)

  const handleDelete = (userDelete) => {
    dispatch(deleteUser(userDelete.uuid))
    dispatch(getUsersRequest())
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

  const openFormUserView = (user) => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('view-user')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'view-user',
              name: 'Visualização de usuário',
              active: true,
              navLink: '/visualizar-usuario',
              state: { permissions, id: 'view-user', userDataView: user }
            }
          ]
        ))
        history.push(
          {
            pathname: '/visualizar-usuario',
            state: { permissions, id: 'view-user', userDataView: user }
          }
        )
        return
      }

      if (tab.id === 'view-user') {
        tab.active = true
        history.push({
          pathname: '/visualizar-usuario',
          state: { permissions, id: 'view-user', userDataView: user }
        })
      }

    })
  }

  const handleCurrentDataView = user => {
    api.get(`/users/${user.uuid}`).then(response => {
      openFormUserView(response.data.data)
    }).catch(err => {
    })
  }

  const handleCurrentData = userSelect => {
    dispatch(resetUserFormEditSaved())
    api
      .get(`/users/${userSelect.uuid}`)
      .then(user => {
        openFormUserEdit(user.data.data)
      })
      .catch(err => {
      })
  }

  const handleSearch = search => {
    dispatch(changeFilter(search))
    setSearchValue(search)
    dispatch(getUsersRequest())
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

  const handlePagination = page => {
    dispatch(changeCurrentPage(page.selected + 1))
    dispatch(getUsersRequest())
  }

  const selectedStyle = {
    rows: {
      selectedHighlighStyle: {
        backgroundColor: "rgba(115,103,240,.05)",
        color: "#7367F0 !important",
        boxShadow: "0 0 1px 0 #7367F0 !important",
        "&:hover": {
          transform: "translateY(0px) !important"
        }
      }
    }
  }

  const columns = [
    {
      name: 'Nome',
      sortable: true,
      selector: row => row.name
    },
    {
      name: 'Email',
      sortable: true,
      selector: row => row.email
    },
    {
      name: 'Ações',
      selector: row => <ActionsComponent
        row={row}
        currentData={handleCurrentData}
        deleteRow={() => {
          setUserToDelete(row)
          SweetAlertQuestion("Deseja excluir este usuário", "Não pode ser disfeito", "question", function () { handleDelete(row) }, function () { })
        }}
      />
    }
  ]

  return (
    <Fragment>
      <Card>
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
            <Label className='me-1 mr-1' for='search-input'>
              Pesquisar
            </Label>
            <Input
              className='dataTable-filter mb-50'
              type='text'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={e => handleSearch(e.target.value)}
            />
          </Col>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ms-2' color='primary' onClick={() => {
              openFormUser()
            }}>
              <Plus size={15} />
              <span className='align-middle ms-50'>Cadastrar usuário</span>
            </Button>
          </div>
        </CardHeader>
        <div className='react-dataTable'>
          <DataTable
            noDataComponent={
              <NoDataUser/>
            }
            pagination
            paginationServer
            paginationComponent={() => (
              <ReactPaginate
                nextLabel=''
                breakLabel='...'
                previousLabel=''
                breakClassName="break-me"
                pageCount={totalPages}
                pageClassName='page-item'
                breakClassName='page-item'
                nextLinkClassName='page-link'
                pageLinkClassName='page-link'
                breakLinkClassName='page-link'
                previousLinkClassName='page-link'
                nextClassName='page-item next-item'
                previousClassName='page-item prev-item'
                containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
                activeClassName="active"
                forcePage={currentPage - 1}
                onPageChange={page => handlePagination(page)}
              />
            )}
            noHeader
            onRowClicked={row => handleCurrentDataView(row)}
            selectableRows
            pointerOnHover
            responsive
            subHeader
            customStyles={selectedStyle}
            columns={columns}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            data={users}
            selectableRowsComponent={BootstrapCheckbox}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default UsersList
