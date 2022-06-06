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
import NoDataUser from '../../../components/TableList/noDataUser'
import NoDataVehicle from '../../../components/TableList/noDataVehicle'
import { changeFilter, deleteTerm, getTermsRequestList } from '../../../store/modules/terms/actions'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const TermsList = () => {

  const history = useHistory()

  // ** States
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(changeFilter(searchValue))
    dispatch(getTermsRequestList())
  }, [dispatch])

  const terms = useSelector(state => state.terms.data)
  const totalPages = useSelector(state => state.terms.lastPage)
  const currentPage = useSelector(state => state.terms.currentPage)
  const tabs = useSelector(state => state.navbar.tabs)

  const handleDelete = (TermDelete) => {
    dispatch(deleteTerm(TermDelete.uuid))
    dispatch(getTermsRequestList())
  }

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const openFormTermEdit = (term) => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('edit-term')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'edit-term',
              name: 'Edição de termo',
              active: true,
              navLink: '/editar-termo',
              state: { id: 'edit-term', termDataView: term }
            }
          ]
        ))
        history.push(
          {
            pathname: '/editar-termo',
            state: { id: 'edit-term', termDataView: term }
          }
        )
        return
      }

      if (tab.id === 'edit-term') {
        tab.active = true
        history.push({
          pathname: '/editar-termo',
          state: { id: 'edit-term', termDataView: term }
        })
      }
    })
  }

  const handleCurrentData = termSelect => {
    api
      .get(`/terms/${termSelect.uuid}`)
      .then(term => {
        openFormTermEdit(term.data.data)
      })
      .catch(err => {
      })
  }

  const handleSearch = search => {
    dispatch(changeFilter(search))
    setSearchValue(search)
    dispatch(getTermsRequestList())
  }

  const openFormTerm = () => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('register-term')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'register-term',
              name: 'Cadastro de termo',
              active: true,
              navLink: '/cadastro-termo',
              state: { id: 'register-term' }
            }
          ]
        ))
        history.push(
          {
            pathname: '/cadastro-termo',
            state: { id: 'register-term' }
          }
        )
        return
      }

      if (tab.id === 'register-term') {
        tab.active = true
        history.push({
          pathname: '/cadastro-termo',
          state: { id: 'register-term' }
        })
      }

    })
  }

  const handlePagination = page => {
    dispatch(changeCurrentPage(page.selected + 1))
    dispatch(getTermsRequestList())
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
      name: 'Titulo',
      sortable: true,
      selector: row => row.title
    },
    {
      name:'Tipo',
      sortable: true,
      selector: row => row.type
    },
    {
      name: 'Ações',
      selector: row => <ActionsComponent
        row={row}
        currentData={handleCurrentData}
        deleteRow={() => {
          SweetAlertQuestion("Deseja excluir este termo", "Não pode ser disfeito", "question", function () { handleDelete(row) }, function () { })
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
              openFormTerm()
            }}>
              <Plus size={15} />
              <span className='align-middle ms-50'>Cadastrar termo</span>
            </Button>
          </div>
        </CardHeader>
        <div className='react-dataTable'>
          <DataTable
            noDataComponent={
              <NoDataVehicle/>
            }
            pagination
            paginationServer
            onRowClicked={row => handleCurrentDataView(row)}
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
            selectableRows
            pointerOnHover
            responsive
            subHeader
            customStyles={selectedStyle}
            columns={columns}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            data={terms}
            selectableRowsComponent={BootstrapCheckbox}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default TermsList
