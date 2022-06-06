// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import DataTable from 'react-data-table-component'
import { ChevronDown, ExternalLink, Printer, FileText, File, Clipboard, Copy, MoreVertical, Trash2 } from 'react-feather'

// ** Reactstrap Imports
import {
  Card,
  CardTitle,
  CardHeader,
  UncontrolledButtonDropdown,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  ModalFooter
} from 'reactstrap'

// ** Styles
import '@styles/react/apps/app-invoice.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import axios from 'axios'

const InvoiceList = () => {
  // ** Store Vars
  const [fields, setFields] = useState([])
  const [modal2, setModal2] = useState(false)
  const [data2, setData2] = useState([])

  const getFields = () => {
    axios.get('http://127.0.0.1:8080/api/v1/campos/', {
      headers: {
        Authorization: 'Token c5ba9abb243a2aa4ec8ea4678390692748fd9ec1',
      }
    }).then(response => {
      setFields(response.data)
    }).catch(response => console.log(response))
  }

  const columns = [
    {
      name: 'Codigo',
      sortable: true,
      minWidth: '172px',
      selector: row => row.id
    },
    {
      name: 'Nome',
      sortable: true,
      minWidth: '172px',
      selector: row => row.name
    },
    {
      name: 'nome no Banco',
      sortable: true,
      minWidth: '220px',
      selector: row => row.nameBank
    },
    {
      name: 'Ações',
      minWidth: '100px',
      cell: row => {
        const [modal, setModal] = useState(false)
        const [data, setData] = useState([])

        console.log("aoba", modal)
        return (
          <div className='column-action'>
            <UncontrolledDropdown>
              <DropdownToggle tag='div' className='btn btn-sm'>
                <MoreVertical size={14} className='cursor-pointer' />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  className='w-100'
                  onClick={() => {
                    setModal(true)
                    setData(row)
                  }
                  }
                >
                  <FileText size={14} className='me-50' />
                  <span className='align-middle'>Editar</span>
                </DropdownItem>
                <DropdownItem
                  className='w-100'
                  onClick={() => {
                    axios.delete('http://127.0.0.1:8080/api/v1/campos/', {
                      headers: {
                        Authorization: 'Token c5ba9abb243a2aa4ec8ea4678390692748fd9ec1',
                      },
                      data: row
                    }).then(() => {
                      getFields()
                    }).catch(response => console.log(response))
                  }}
                >
                  <Trash2 size={14} className='me-50' />
                  <span className='align-middle'>Remover</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <Modal isOpen={modal} className='modal-dialog-centered'>
              <ModalHeader toggle={() => setModal(false)} >Editar campo</ModalHeader>
              <ModalBody>
                <div className='mb-2'>
                  <Label className='form-label' for='email'>
                    Nome:
                  </Label>
                  <Input id='bank' value={data.name} placeholder='' onChange={e => setData({ ...data, name: e.target.value })} />
                </div>
                <div className='mb-2'>
                  <Label className='form-label' for='email'>
                    nameBank:
                  </Label>
                  <Input id='bank' value={data.nameBank} placeholder='' onChange={e => setData({ ...data, nameBank: e.target.value })} />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='primary' onClick={() => {
                  axios.put('http://127.0.0.1:8080/api/v1/campos/', data, {
                    Authorization: 'Token c5ba9abb243a2aa4ec8ea4678390692748fd9ec1'
                  }).then(() => {
                    getFields()
                    setModal(false)
                  }).catch(response => console.log(response))

                }

                } >
                  Editar
                </Button>
              </ModalFooter>
            </Modal>
            <Modal isOpen={modal2} className='modal-dialog-centered'>
              <ModalHeader toggle={() => setModal2(false)} >Adicionar campo</ModalHeader>
              <ModalBody>
                <div className='mb-2'>
                  <Label className='form-label'>
                    Nome:
                  </Label>
                  <Input id='bank-1' value={data2.name} onChange={e => setData2({ ...data2, name: e.target.value })} />
                </div>
                <div className='mb-2'>
                  <Label className='form-label' for='email'>
                    nameBank:
                  </Label>
                  <Input id='bank-2' value={data2.nameBank} onChange={e => setData2({ ...data2, nameBank: e.target.value })} />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='primary' onClick={() => {
                  axios.post('http://127.0.0.1:8080/api/v1/campos/', data2, {
                    Authorization: 'Token c5ba9abb243a2aa4ec8ea4678390692748fd9ec1',
                  }).then(() => {
                    getFields()
                    setModal2(false)
                  }).catch(response => console.log(response))

                }

                } >
                  Adicionar
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    getFields()
  }, [])

  return (
    <div className='invoice-list-wrapper'>
      <Card>
        <CardHeader className='py-1'>
          <CardTitle tag='h4'>Campos</CardTitle>
          <UncontrolledButtonDropdown>
            <Button color='primary' outline caret onClick={() => setModal2(true)}>
              <span>Adicionar campo</span>
            </Button>
          </UncontrolledButtonDropdown>
        </CardHeader>
        <div className='invoice-list-dataTable react-dataTable'>
          <DataTable
            noHeader
            sortServer
            responsive={true}
            columns={columns}
            data={fields}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            defaultSortField='invoiceId'
          />
        </div>
      </Card>
    </div>
  )
}

export default InvoiceList
