// ** React Imports
import {Fragment, useState, forwardRef} from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import {
  ChevronDown,
  Plus
} from 'react-feather'
import {
  Card
} from 'reactstrap'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef(({onClick, ...rest}, ref) => (
  <div className='custom-control custom-checkbox'>
    <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
    <label className='custom-control-label' onClick={onClick}/>
  </div>
))

const TableList = props => {
  // ** Props
  const {
    columns,
    data,
    handlePagination,
    totalPages,
    currentPage,
    handleSorting,
    CardHeader,
    noDataComponent
  } = props

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage - 1}
      onPageChange={page => handlePagination(page)}
      pageCount={totalPages}
      breakLabel='...'
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      breakLinkClassName='page-link'
      nextLinkClassName='page-link'
      nextClassName='page-item next'
      previousClassName='page-item prev'
      previousLinkClassName='page-link'
      pageLinkClassName='page-link'
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
    />
  )

  return (
    <Fragment>
      <Card>
        <div>{CardHeader()}</div>

        <DataTable
          noHeader
          pagination
          paginationServer
          selectableRows
          pointerOnHover
          columns={columns}
          paginationPerPage={7}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10}/>}
          paginationComponent={CustomPagination}
          data={data}
          selectableRowsComponent={BootstrapCheckbox}
          sortServer
          onSort={handleSorting}
          noDataComponent={noDataComponent}
        />
      </Card>
    </Fragment>
  )
}

export default TableList
