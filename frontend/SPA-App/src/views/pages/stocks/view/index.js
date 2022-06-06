// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap Imports
import { Row, Col, Alert } from 'reactstrap'

// ** User View Components
import UserTabs from './Tabs'
import UserInfoCard from './UserInfoCard'

// ** Styles
import '@styles/react/apps/app-users.scss'
import Card from 'reactstrap/lib/Card'
import CardHeader from 'reactstrap/lib/CardHeader'
import CardTitle from 'reactstrap/lib/CardTitle'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import api from '../../../../services/api'

import ReactPaginate from 'react-paginate'


const UserView = (props) => {
  // ** Store Vars

  const [stock, setStock] = useState(props.location.state.stockDataView)

  const [messages, setMessages] = useState()
  const [currentPage, setCurrentPage] = useState(0)

  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  const dispatch = useDispatch()

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
      name: 'Telefone',
      sortable: true,
      selector: row => row.phone
    }
  ]

  const ExpandableTable = ({data}) => {
    return (
      <div className='expandable-content p-2'>
        <p>
          <span className='fw-bold'>Mensagem:</span> 
        </p>
        <p>
          {data.message}
        </p>
      </div>
    )
  }

  // ** Get suer on mount
  useEffect(() => {
    api.get(`/stocks/messages/${stock.uuid}`).then(response => {
      setMessages(response.data.data)
    })
  }, [])

  const [active, setActive] = useState('1')

  const toggleTab = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={10}
      breakLabel={'...'}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1'}
    />
  )

  return stock !== null && stock !== undefined ? (
    <div className='app-user-view'>
      <Row>
        <Col xl='4' lg='5' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <UserInfoCard selectedUser={stock} />
      <Card>
        <CardHeader className='py-1'>
          <CardTitle tag='h4'>Mensagens</CardTitle>
        </CardHeader>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            data={messages}
            expandableRows
            columns={columns}
            onPageChange={page => handlePagination(page)}
            expandOnRowClicked
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            expandableRowsComponent={<ExpandableTable />}
          />
        </div>
      </Card>
        </Col>
        <Col xl='8' lg='7' xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
          <UserTabs active={active} stock={stock} setStock={obj => setStock(obj)} toggleTab={toggleTab} />
      
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color='danger'>
    </Alert>
  )
}
export default UserView
