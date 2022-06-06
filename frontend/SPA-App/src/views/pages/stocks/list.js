// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { Bookmark, CheckCircle, ChevronDown, Image, MinusCircle, Octagon, Plus, RefreshCcw, Trash, User, UserCheck, UserPlus, UserX } from 'react-feather'

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
import api from "@src/services/api"
import { addTab } from '../../../store/modules/navbar/actions'
import { useHistory } from 'react-router-dom'
import { SweetAlertQuestion } from '../components/sweetAlertMessage'
import { getStocksRequest, changeFilter, changeCurrentPage, changeFilterStatus, getStocksPhotosRequest } from '../../../store/modules/stocks/actions'
import NoDataVehicle from '../../../components/TableList/noDataVehicle'
import Row from 'reactstrap/lib/Row'
import StatsHorizontal from '../../../@core/components/widgets/stats/StatsHorizontal'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const StockList = () => {

  const history = useHistory()

  // ** States
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useDispatch()

  const [quantityActive, setQuantityActive] = useState(0)
  const [quantityAll, setQuantityAll] = useState(0)
  const [quantityAvailabre, setQuantityAvailabre] = useState(0)
  const [quantityPhotos, setQuantityPhotos] = useState(0)
  const [quantityPreparing, setQuantityPreparing] = useState(0)
  const [quantityTransfer, setQuantityTransfer] = useState(0)

  useEffect(() => {
    api.get(`/stocks/quantityStock`).then(response => {
      setQuantityActive(response.data.quantityActive)
      setQuantityAll(response.data.quantityAll)
      setQuantityAvailabre(response.data.quantityAvailabre)
      setQuantityPhotos(response.data.quantityPhotos)
      setQuantityPreparing(response.data.quantityPreparing)
      setQuantityTransfer(response.data.quantityTransfer)
    }).catch(err => {
    })
    dispatch(changeFilter(searchValue))
    dispatch(getStocksRequest())

  }, [dispatch])

  const stocks = useSelector(state => state.stocks.data)
  const totalPages = useSelector(state => state.stocks.lastPage)
  const currentPage = useSelector(state => state.stocks.currentPage)
  const tabs = useSelector(state => state.navbar.tabs)

  const handleDelete = (vehicleDelete) => {
    dispatch(deleteStocksVehicle(vehicleDelete.uuid))
    dispatch(getStocksRequest())
  }

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const handleSearch = search => {
    dispatch(changeFilter(search))
    setSearchValue(search)
    dispatch(getStocksRequest())
  }

  const openFormStockView = (stock) => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('view-stock')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'view-stock',
              name: 'Visualização de estoque',
              active: true,
              navLink: '/visualizar-estoque',
              state: { id: 'view-stock', stockDataView: stock }
            }
          ]
        ))
        history.push(
          {
            pathname: '/visualizar-estoque',
            state: { id: 'view-stock', stockDataView: stock }
          }
        )
        return
      }

      if (tab.id === 'view-stock') {
        tab.active = true
        history.push({
          pathname: '/visualizar-estoque',
          state: { id: 'view-stock', stockDataView: stock }
        })
      }

    })
  }

  const handleCurrentDataView = stock => {
    api.get(`/stocks/${stock.uuid}`).then(response => {
      openFormStockView(response.data.data)
    }).catch(err => {
    })
  }

  const handlePagination = page => {
    dispatch(changeCurrentPage(page.selected + 1))
    dispatch(getStocksRequest())
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
      name: 'Veículo',
      sortable: true,
      selector: row => row.vehicleName
    },
    {
      name: 'Placa',
      sortable: true,
      selector: row => row.board
    },
    {
      name: 'Cor',
      sortable: true,
      selector: row => row.color
    },
    {
      name: 'ANO/MODELO',
      sortable: true,
      selector: row => row.year_and_model
    },
    {
      name: 'Status',
      sortable: true,
      selector: row => row.status
    },
    {
      name: 'Ações',
      selector: row => <Trash
        className="cursor-pointer"
        size={20}
        onClick={() => {
          SweetAlertQuestion("Deseja excluir este veículo", "Não pode ser disfeito", "question", function () { handleDelete(row) }, function () { })
        }}
      />
    }
  ]

  return (
    <Fragment>
      <div className='app-user-list'>
        <Row>
          <Col>
            <StatsHorizontal
              color='success'
              statTitle={`Ativo: ${quantityActive}`}
              icon={<CheckCircle size={20} onClick={() => {
                dispatch(changeFilterStatus('Ativo'))
                dispatch(getStocksRequest())
              }} />}
            />
          </Col>
          <Col>
            <StatsHorizontal
              color='warning'
              statTitle={`Preparando: ${quantityPreparing}`}
              icon={<MinusCircle size={20} onClick={() => {
                dispatch(changeFilterStatus('Preparando'))
                dispatch(getStocksRequest())
              }}/>}
            />
          </Col>
          <Col>
            <StatsHorizontal
              color='primary'
              statTitle={`Disponivel: ${quantityAvailabre}`}
              icon={<Bookmark size={20} onClick={() => {
                dispatch(changeFilterStatus('Disponivel'))
                dispatch(getStocksRequest())
              }}/>}
            />
          </Col>
          <Col>
            <StatsHorizontal
              color='dark'
              statTitle={`Repasse: ${quantityTransfer}`}
              icon={<RefreshCcw size={20} onClick={() => {
                dispatch(changeFilterStatus('Repasse'))
                dispatch(getStocksRequest())
              }} />}
            />
          </Col>
          <Col>
            <StatsHorizontal
              color='danger'
              statTitle={`Fotos: ${quantityPhotos}`}
              icon={<Image size={20} onClick={() => {
                dispatch(getStocksPhotosRequest())
              }} />}
            />
          </Col>
          <Col>
            <StatsHorizontal
              color='dark'
              statTitle={`Total: ${quantityAll}`}
              icon={<Octagon size={20} onClick={() => {
                dispatch(changeFilterStatus(''))
                dispatch(getStocksRequest())
              }} />}
            />
          </Col>
        </Row>
      </div>
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
        </CardHeader>
        <div className='react-dataTable'>
          <DataTable
            noDataComponent={
              <NoDataVehicle />
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
            data={stocks}
            selectableRowsComponent={BootstrapCheckbox}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default StockList
