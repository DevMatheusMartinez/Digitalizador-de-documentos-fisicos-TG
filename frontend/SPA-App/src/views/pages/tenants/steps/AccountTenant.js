// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Icons Imports
import { ArrowLeft, ArrowRight } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button } from 'reactstrap'
import Alert from 'reactstrap/lib/Alert'
import { addTenantValidate, resetTenantForm } from '../../../../store/modules/tenants/actions'
import { applyMaskToCnpj } from '../../../../support/masks'

const AccountTenant = ({ stepper, type, setData, data }) => {

  const dispatch = useDispatch()

  const [tenant, setTenant] = useState({
    name: "",
    cnpj: "",
    company_name: ""
  })

  const errors = useSelector(state => state.tenants.errors)
  const formSuccess = useSelector(state => state.tenants.formSuccess)

  useEffect(() => {
    if (formSuccess) {
      stepper.next()
      setData(tenant)
      dispatch(resetTenantForm())
    }
  }, [formSuccess])

  const nextStep = () => {
    dispatch(addTenantValidate(tenant))
  }

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Dados da empresa</h5>
        <small className='text-muted'>Digite os dados da empresa.</small>
      </div>
      <Form>
        <Row>
          <Col className='mb-1'>
            <Label className='form-label' for="name">
              Nome
            </Label>
            <Input
              value={tenant.name}
              type='text'
              name="name"
              id="name"
              placeholder='Nome'
              onChange={e => setTenant({
                ...tenant,
                name: e.target.value
              })}
            />
            {
              errors.name && <Alert color='danger'>
                <div className='alert-body'>
                  <span>{errors.name[0]}</span>
                </div>
              </Alert>
            }

          </Col>
          <Col className='mb-1'>
            <Label className='form-label' for="company_name">
              Razão Social
            </Label>
            <Input
              value={tenant.company_name}
              type='text'
              name="company_name"
              id="company_name"
              placeholder='Razão Social'
              onChange={e => setTenant({
                ...tenant,
                company_name: e.target.value
              })} />
            {
              errors.company_name && <Alert color='danger'>
                <div className='alert-body'>
                  <span>{errors.company_name[0]}</span>
                </div>
              </Alert>
            }
          </Col>
          <Col className='mb-1'>
            <Label className='form-label' for="cnpj">
              CNPJ
            </Label>
            <Input
              value={tenant.cnpj}
              type='text'
              name="cnpj"
              id="cnpj"
              placeholder='CNPJ'
              onChange={e => setTenant({
                ...tenant,
                cnpj: applyMaskToCnpj(e.target.value)
              })}
            />
            {
              errors.cnpj && <Alert color='danger'>
                <div className='alert-body'>
                  <span>{errors.cnpj[0]}</span>
                </div>
              </Alert>
            }
          </Col>
        </Row>
        <div className='d-flex justify-content-between'>
          <Button color='secondary' className='btn-prev' outline disabled>
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Voltar</span>
          </Button>
          <Button color='primary' className='btn-next' onClick={() => nextStep()}>
            <span className='align-middle d-sm-inline-block d-none'>Proximo</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}


export default AccountTenant
