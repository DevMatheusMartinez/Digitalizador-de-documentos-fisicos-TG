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
import { ActionsComponent } from '../components/actionsComponentsList'
import api from "@src/services/api"
import { addTab } from '../../../store/modules/navbar/actions'
import { useHistory } from 'react-router-dom'
import { SweetAlertQuestion } from '../components/sweetAlertMessage'
import { changeCurrentPage, changeFilter, deleteVehicle, getVehiclesRequest } from '../../../store/modules/vehicles/actions'
import NoDataUser from '../../../components/TableList/noDataUser'
import NoDataVehicle from '../../../components/TableList/noDataVehicle'
import Avatar from '@components/avatar'


// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const VehiclesList = () => {

  const history = useHistory()

  // ** States
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(changeFilter(searchValue))
    dispatch(getVehiclesRequest())
  }, [dispatch])

  const vehicles = useSelector(state => state.vehicles.data)
  const totalPages = useSelector(state => state.vehicles.lastPage)
  const currentPage = useSelector(state => state.vehicles.currentPage)
  const tabs = useSelector(state => state.navbar.tabs)

  const handleDelete = (vehicleDelete) => {
    dispatch(deleteVehicle(vehicleDelete.uuid))
    dispatch(getVehiclesRequest())
  }

  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const openFormVehicleEdit = (vehicle) => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('file-digitalize')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'file-digitalize',
              name: 'Digitalizar arquivo',
              active: true,
              navLink: '/file-digitalize',
              state: { id: 'file-digitalize', vehicleDataView: vehicle }
            }
          ]
        ))
        history.push(
          {
            pathname: '/editar-veiculo',
            state: { id: 'edit-vehicle', vehicleDataView: vehicle }
          }
        )
        return
      }

      if (tab.id === 'edit-vehicle') {
        tab.active = true
        history.push({
          pathname: '/editar-veiculo',
          state: { id: 'edit-vehicle', vehicleDataView: vehicle }
        })
      }
    })
  }

  const handleCurrentData = vehicleSelect => {
    dispatch(resetVehicleFormEditSaved())
    api
      .get(`/vehicles/${vehicleSelect.uuid}`)
      .then(vehicle => {
        openFormVehicleEdit(vehicle.data.data)
      })
      .catch(err => {
      })
  }

  const openFormVehiclePhotos = (vehicle) => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('register-image-vehicle')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'register-image-vehicle',
              name: 'Cadastrar imagem',
              active: true,
              navLink: '/cadastro-imagem-veiculo',
              state: { id: 'register-image-vehicle', vehicleDataView: vehicle }
            }
          ]
        ))
        history.push(
          {
            pathname: '/cadastro-imagem-veiculo',
            state: { id: 'register-image-vehicle', vehicleDataView: vehicle }
          }
        )
        return
      }

      if (tab.id === 'register-image-vehicle') {
        tab.active = true
        history.push({
          pathname: '/cadastro-imagem-veiculo',
          state: { id: 'register-image-vehicle', vehicleDataView: vehicle }
        })
      }
    })
  }

  const openPageImagesVehicle = vehicleSelect => {
    api
      .get(`/vehicles/${vehicleSelect.uuid}`)
      .then(vehicle => {
        openFormVehiclePhotos(vehicle.data.data)
      })
      .catch(err => {
      })
  }

  const handleSearch = search => {
    dispatch(changeFilter(search))
    setSearchValue(search)
    dispatch(getVehiclesRequest())
  }

  const openFormVehicle = () => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('digitalize-file')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'file-digitalize',
              name: 'Digitalizar File',
              active: true,
              navLink: '/digitalizar-arquivo',
              state: { id: 'file-digitalize' }
            }
          ]
        ))
        history.push(
          {
            pathname: '/digitalizar-arquivo',
            state: { id: 'file-digitalize' }
          }
        )
        return
      }

      if (tab.id === 'file-digitalize') {
        tab.active = true
        history.push({
          pathname: '/digitalizar-arquivo',
          state: { id: 'file-digitalize' }
        })
      }

    })
  }

  const openFormVehicleView = (vehicle) => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('view-vehicle')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'view-vehicle',
              name: 'Visualização de veículo',
              active: true,
              navLink: '/visualizar-veiculo',
              state: { id: 'view-vehicle', vehicleDataView: vehicle }
            }
          ]
        ))
        history.push(
          {
            pathname: '/visualizar-veiculo',
            state: { id: 'view-vehicle', vehicleDataView: vehicle }
          }
        )
        return
      }

      if (tab.id === 'view-vehicle') {
        tab.active = true
        history.push({
          pathname: '/visualizar-vehicle',
          state: { id: 'view-vehicle', vehicleDataView: vehicle }
        })
      }

    })
  }

  const handleCurrentDataView = vehicle => {
    api.get(`/vehicles/${vehicle.uuid}`).then(response => {
      openFormVehicleView(response.data.data)
    }).catch(err => {
    })
  }

  const handlePagination = page => {
    dispatch(changeCurrentPage(page.selected + 1))
    dispatch(getVehiclesRequest())
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
      name: 'Foto',
      cell: row => <div>
          {row.files.length > 0 ? (
            <Avatar img={row.files[0].url} size='lg'/>
          ) : (
            <Avatar color={`light-dark`} content={"img"}  />
          )}
        </div>
    },
    {
      name: 'Veículo',
      sortable: true,
      selector: row => row.vehicle
    },
    {
      name: 'Ano/Modelo',
      sortable: true,
      selector: row => row.year_and_model
    },
    {
      name: 'Cor',
      sortable: true,
      selector: row => row.color
    },
    {
      name: 'Ações',
      selector: row => <ActionsComponent
        row={row}
        image={true}
        currentData={handleCurrentData}
        openPageImage={openPageImagesVehicle}
        deleteRow={() => {
          SweetAlertQuestion("Deseja excluir este veículo", "Não pode ser disfeito", "question", function () { handleDelete(row) }, function () { })
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
              openFormVehicle()
            }}>
              <span className='align-middle ms-50'>Digitalizar arquivo</span>
            </Button>
          </div>
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
            // selectableRows
            pointerOnHover
            responsive
            subHeader
            customStyles={selectedStyle}
            columns={columns}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            data={vehicles}
            selectableRowsComponent={BootstrapCheckbox}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default VehiclesList
