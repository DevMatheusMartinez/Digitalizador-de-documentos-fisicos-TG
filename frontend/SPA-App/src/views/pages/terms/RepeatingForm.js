// ** React Imports
import { useState } from 'react'

// ** Icons Imports
import { X, Plus } from 'react-feather'

// ** Custom Components
import Repeater from '@components/repeater'

// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardBody, Form, Label, Input, Button } from 'reactstrap'

const RepeatingForm = () => {
  // ** State
  const [count, setCount] = useState(1)

  const increaseCount = () => {
    setCount(count + 1)
  }

  const deleteForm = e => {
    e.preventDefault()
    e.target.closest('form').remove()
  }

  return (
    <Card>
      <CardHeader>
        <h4 className='card-title'>Campos</h4>
      </CardHeader>

      <CardBody>
        <Repeater count={count}>
          {i => (
            <Form key={i}>
              <Row className='justify-content-between align-items-center'>
                <Col className='mb-md-0 mb-1'>
                  <Label className='form-label' for={`item-name-${i}`}>
                    Nome do campo no arquivo:
                  </Label>
                  <Input type='text' id={`item-name-${i}`} />
                </Col>
                <Col className='mb-md-0 mb-1'>
                  <Label className='form-label' for={`cost-${i}`}>
                    Nome na tabela:
                  </Label>
                  <Input type='text' id={`item-name-bank-${i}`}  />
                </Col>
                <Col md={2}>
                  <Button color='danger' className='text-nowrap px-1' onClick={deleteForm} outline>
                    <X size={14} className='me-50' />
                    <span>Delete</span>
                  </Button>
                </Col>
                <Col sm={12}>
                  <hr />
                </Col>
              </Row>
            </Form>
          )}
        </Repeater>
        <Button className='btn-icon' color='primary' onClick={increaseCount}>
          <Plus size={14} />
          <span className='align-middle ms-25'>Novo campo</span>
        </Button>
      </CardBody>
    </Card>
  )
}

export default RepeatingForm
