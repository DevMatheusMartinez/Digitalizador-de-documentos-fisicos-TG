// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from 'react-feather'

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
import { ActionsComponent } from '../components/actionsComponentsList'
import api from "@src/services/api"
import { addTab } from '../../../store/modules/navbar/actions'
import { useHistory } from 'react-router-dom'
import { SweetAlertQuestion } from '../components/sweetAlertMessage'
import { getCustomersRequest, changeFilter, resetCustomerFormEditSaved, deleteCustomer, changeCurrentPage } from '../../../store/modules/customers/actions'
import NoDataCustomer from '../../../components/TableList/noDataCustomer'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const CustomersList = () => {

  const history = useHistory()

  // ** States
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(changeFilter(searchValue))
    dispatch(getCustomersRequest())
  }, [dispatch])

  const customers = useSelector(state => state.customers.data)
  const totalPages = useSelector(state => state.customers.lastPage)
  const currentPage = useSelector(state => state.customers.currentPage)
  const tabs = useSelector(state => state.navbar.tabs)

  const handleDelete = (customerDelete) => {
    dispatch(deleteCustomer(customerDelete.uuid))
    dispatch(getCustomersRequest())
  }

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const openFormCustomerEdit = (customer) => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('edit-customer')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'edit-customer',
              name: 'Edição de cliente',
              active: true,
              navLink: '/editar-cliente',
              state: { id: 'edit-customer', customerDataView: customer }
            }
          ]
        ))
        history.push(
          {
            pathname: '/editar-cliente',
            state: { id: 'edit-customer', customerDataView: customer }
          }
        )
        return
      }

      if (tab.id === 'edit-customer') {
        tab.active = true
        history.push({
          pathname: '/editar-cliente',
          state: { id: 'edit-customer', customerDataView: customer }
        })
      }
    })
  }

  const openFormCustomerView = (customer) => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('view-customer')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'view-customer',
              name: 'Visualização de clientes',
              active: true,
              navLink: '/visualizar-cliente',
              state: { id: 'view-customer', customerDataView: customer }
            }
          ]
        ))
        history.push(
          {
            pathname: '/visualizar-cliente',
            state: { id: 'view-customer', customerDataView: customer }
          }
        )
        return
      }

      if (tab.id === 'view-customer') {
        tab.active = true
        history.push({
          pathname: '/visualizar-cliente',
          state: { id: 'view-customer', customerDataView: customer }
        })
      }
    })
  }

  const handleCurrentDataView = customer => {
    api.get(`/customers/${customer.uuid}`).then(response => {
      openFormCustomerView(response.data.data)
    }).catch(err => {
    })
  }

  const handleCurrentData = customerSelect => {
    dispatch(resetCustomerFormEditSaved())
    api
      .get(`/customers/${customerSelect.uuid}`)
      .then(customer => {
        openFormCustomerEdit(customer.data.data)
      })
      .catch(err => {
      })
  }

  const handleSearch = search => {
    dispatch(changeFilter(search))
    setSearchValue(search)
    dispatch(getCustomersRequest())
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

  const handlePagination = page => {
    dispatch(changeCurrentPage(page.selected + 1))
    dispatch(getCustomersRequest())
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
      name:'CPF/CNPJ',
      sortable: true,
      selector: row => row.cpf_cnpj
    },
    {
      name:'Estado Cívil',
      sortable: true,
      selector: row => row.marital_status
    },
    {
      name:'Nascimento',
      sortable: true,
      selector: row => row.birthday
    },
    {
      name: "Email",
      sortable: true,
      selector: row => row.email
    },
    {
      name: 'Ações',
      selector: row => <ActionsComponent
        row={row}
        currentData={handleCurrentData}
        deleteRow={() => {
          SweetAlertQuestion("Deseja excluir este cliente", "Não pode ser disfeito", "question", function () { handleDelete(row) }, function () { })
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
              openFormCustomer()
            }}>
              <Plus size={15} />
              <span className='align-middle ms-50'>Cadastrar cliente</span>
            </Button>
          </div>
        </CardHeader>
        <div className='react-dataTable'>
          <DataTable
            noDataComponent={
              <NoDataCustomer/>
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
            selectableRows
            onRowClicked={row => handleCurrentDataView(row)}
            pointerOnHover
            responsive
            subHeader
            customStyles={selectedStyle}
            columns={columns}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            data={customers}
            selectableRowsComponent={BootstrapCheckbox}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default CustomersList
