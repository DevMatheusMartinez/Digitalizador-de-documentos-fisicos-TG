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
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Input,
    Label,
    CardHeader,
    FormGroup
} from 'reactstrap'

import { useDispatch, useSelector } from 'react-redux'
import { ActionsComponent } from '../components/actionsComponentsList'
import api from "@src/services/api"

import { addTab } from '../../../store/modules/navbar/actions'
import { useHistory } from 'react-router-dom'
import { SweetAlertQuestion } from '../components/sweetAlertMessage'
import { changeCurrentPage, changeFilter, deleteContract, getContractsRequest, resetContractsFormEditSaved } from '../../../store/modules/contracts/actions'
import NoDataContract from '../../../components/TableList/noDataContract'
import generatePdf from './generatePDF'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
        <Input type='checkbox' ref={ref} {...props} />
    </div>
))

const ContractList = () => {
    const history = useHistory()

    const [searchValue, setSearchValue] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(changeFilter(searchValue))
        dispatch(getContractsRequest())
    }, [dispatch])

    const contracts = useSelector(state => state.contracts.data)
    const totalPages = useSelector(state => state.contracts.lastPage)
    const currentPage = useSelector(state => state.contracts.currentPage)
    const tabs = useSelector(state => state.navbar.tabs)

    const handleDelete = (contractDelete) => {
        dispatch(deleteContract(contractDelete.uuid))
        dispatch(getContractsRequest())
    }

    const exist = (id) => {
        return tabs.some(function (el) {
            return el.id === id
        })
    }

    const openFormContractEdit = (contract, customer, vehicle, type) => {
        tabs.map(tab => {
            tab.active = false

            if (!exist('edit-contract')) {
                dispatch(addTab(
                    [
                        ...tabs,
                        {
                            id: 'edit-contract',
                            name: 'Edição de contrato',
                            active: true,
                            navLink: '/editar-contrato',
                            state: { id: 'edit-contract', contractDataView: contract, customer, vehicle, type }
                        }
                    ]
                ))
                history.push(
                    {
                        pathname: '/editar-contrato',
                        state: { id: 'edit-contract', contractDataView: contract, customer, vehicle, type }
                    }
                )
                return
            }

            if (tab.id === 'edit-contract') {
                tab.active = true
                history.push({
                    pathname: '/editar-contrato',
                    state: { id: 'edit-contract', contractDataView: contract, customer, vehicle, type }
                })
            }
        })
    }

    const openFormContractView = (contract, customer, vehicle) => {
        tabs.map(tab => {
          tab.active = false

          if (!exist('view-contract')) {
            dispatch(addTab(
              [
                ...tabs,
                {
                  id: 'view-contract',
                  name: 'Visualização de contratos',
                  active: true,
                  navLink: '/visualizar-contrato',
                  state: { id: 'view-contract', contractDataView: contract, vehicleDataView: vehicle, customerDataView: customer }
                }
              ]
            ))
            history.push(
              {
                pathname: '/visualizar-contrato',
                state: { id: 'view-contract', contractDataView: contract, vehicleDataView: vehicle, customerDataView: customer }
              }
            )
            return
          }

          if (tab.id === 'view-contract') {
            tab.active = true
            history.push({
              pathname: '/visualizar-contrato',
              state: { id: 'view-contract', contractDataView: contract, vehicleDataView: vehicle, customerDataView: customer }
            })
          }
        })
      }

    const handleCurrentDataView = contract => {
        api.get(`/sales/${contract.uuid}`).then(response => {
            openFormContractView(response.data.data, contract.customer, contract.vehicle)
        }).catch(err => {
        })
      }

    const handleCurrentData = contractSelect => {
        dispatch(resetContractsFormEditSaved())
        api
            .get(`/sales/${contractSelect.uuid}`)
            .then(contract => {
                openFormContractEdit(contract.data.data, contractSelect.customer, contractSelect.vehicle, contractSelect.type)
            })
            .catch(err => {
            })
    }

    const handleSearch = search => {
        dispatch(changeFilter(search))
        setSearchValue(search)
        dispatch(getContractsRequest())
    }

    const openFormContract = (type) => {
        tabs.map(tab => {
            tab.active = false

            if (!exist('register-contract')) {
                dispatch(addTab(
                    [
                        ...tabs,
                        {
                            id: 'register-contract',
                            name: 'Cadastro de contrato',
                            active: true,
                            navLink: '/cadastro-contrato',
                            state: { type, id: 'register-contract' }
                        }
                    ]
                ))
                history.push(
                    {
                        pathname: '/cadastro-contrato',
                        state: { type, id: 'register-contract' }
                    }
                )
                return
            }

            if (tab.id === 'register-contract') {
                tab.active = true
                history.push({
                    pathname: '/cadastro-contrato',
                    state: { type, id: 'register-contract' }
                })
            }

        })
    }

    const ExpandableTable = ({ data }) => {
        return (
            <div className='expandable-content p-2'>
                <p>
                    <span className='font-weight-bold'>Veículo:</span> {data.vehicle.manufacturer} {data.vehicle.model}
                </p>
                <p>
                    <span className='font-weight-bold'>Tipo:</span> {data.vehicle.type}
                </p>
                <p>
                    <span className='font-weight-bold'>Cor:</span> {data.vehicle.color}
                </p>
                <p>
                    <span className='font-weight-bold'>Combustivel:</span> {data.vehicle.fuel}
                </p>
                <p>
                    <span className='font-weight-bold'>KM:</span> {data.vehicle.km}
                </p>
                <p>
                    <span className='font-weight-bold'>Motor:</span> {data.vehicle.engine}
                </p>
                <p>
                    <span className='font-weight-bold'>Chassi:</span> {data.vehicle.chassi}
                </p>
                <p>
                    <span className='font-weight-bold'>Licenciamento:</span> {data.vehicle.crlv}
                </p>
                <p>
                    <span className='font-weight-bold'>Renavam:</span> {data.vehicle.renavam}
                </p>
                <p>
                    <span className='font-weight-bold'>crv:</span> {data.vehicle.crv}
                </p>
            </div>
        )
    }

    const handlePagination = page => {
        dispatch(changeCurrentPage(page.selected + 1))
        dispatch(getContractsRequest())
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
            selector: row => row.customer_name
        },
        {
            name: 'CPF/CNPJ',
            sortable: true,
            selector: row => row.cpf_cnpj
        },
        {
            name: 'Placa',
            sortable: true,
            selector: row => row.board
        },
        {
            name: 'Entregue',
            sortable: true,
            selector: row => row.delivered_at
        },
        {
            name: 'Contrato',
            sortable: true,
            selector: row => row.type
        },
        {
            name: 'Ações',
            selector: row => <ActionsComponent
                row={row}
                pdf={true}
                currentData={handleCurrentData}
                generateRowPDF={generatePdf}
                deleteRow={() => {
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
                    <div className="actions-right d-flex flex-wrap mt-sm-0 mt-2">
                        <FormGroup>
                            <UncontrolledDropdown className="data-list-dropdown mr-1">
                                <DropdownToggle className="p-1" color="primary" outline>
                                    <Plus size={15} />
                                    <span className="align-middle mr-1">Cadastrar contrato</span>
                                </DropdownToggle>
                                <DropdownMenu tag="div" right>
                                    <DropdownItem tag="a" onClick={() => openFormContract("compra")}>Compra</DropdownItem>
                                    <DropdownItem tag="b" onClick={() => openFormContract("venda")}>Venda</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </FormGroup>
                    </div>
                </CardHeader>
                <div className='react-dataTable'>
                    <DataTable
                        noDataComponent={
                            <NoDataContract/>
                        }
                        pagination
                        paginationServer
                        expandableRows
                        expandOnRowClicked
                        onRowClicked={row => handleCurrentDataView(row)}
                        expandableRowsComponent={<ExpandableTable />}
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
                        data={contracts}
                        selectableRowsComponent={BootstrapCheckbox}
                    />
                </div>
            </Card>
        </Fragment>
    )
}

export default ContractList
