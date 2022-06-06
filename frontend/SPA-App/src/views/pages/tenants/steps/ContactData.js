// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Icons Imports
import { ArrowLeft, ArrowRight } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button } from 'reactstrap'
import Alert from 'reactstrap/lib/Alert'
import Select from 'react-select'
import { contactTypes } from '../../../../support/constants'
import { addTenant, resetTenantForm } from '../../../../store/modules/tenants/actions'
import { SweetAlertSuccess } from '../../components/sweetAlertMessage'
import api from "@src/services/api"
import { useHistory } from 'react-router-dom'
import { applyMaskToPhone } from '../../../../support/masks'

const ContactData = ({ stepper, type, data }) => {

  const dispatch = useDispatch()

  const [contact, setContact] = useState({
    type: "",
    contact: ""
  })

  const errors = useSelector(state => state.tenants.errors)
  const formSuccess = useSelector(state => state.tenants.formSuccessStep)
  const tenant_uuid = useSelector(state => state.tenants.tenant_uuid)
  const history = useHistory()

  const submitLogin = () => {
    api
      .post(`/login`, {
        email: data.email,
        password: data.password,
        tenant_uuid
      })
      .then(response => {
        localStorage.setItem("@masterrevenda-app:token", `${response.data.access_token}`)
        history.push({
          pathname: `/home`
        })
      }
      )
  }

  useEffect(() => {
    if (formSuccess) {
      dispatch(resetTenantForm())
      SweetAlertSuccess("Sucesso", "Sua conta foi criada com sucesso", "success", submitLogin)
    }
  }, [formSuccess])

  const saveData = () => {
    const tenantToSave = {
      name: data.name,
      company_name: data.company_name,
      cnpj: data.cnpj,
      user: {
        name: data.nameUser,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        contact: {
          type: contact.type,
          contact: contact.contact
        }
      }
    }

    dispatch(addTenant(tenantToSave))
  }

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Dados do contato</h5>
        <small className='text-muted'>Digite os dados do contado.</small>
      </div>
      <Form>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for='country'>
              Tipo
            </Label>
            <Select
              theme={selectThemeColors}
              isClearable={false}
              id={`country`}
              className='react-select'
              classNamePrefix='select'
              options={contactTypes}
              onChange={e => setContact({
                ...contact,
                type: e.value
              })}
            />
            {
              errors['user.contact.type'] && <Alert color='danger'>
                <div className='alert-body'>
                  <span>{errors['user.contact.type'][0]}</span>
                </div>
              </Alert>
            }
          </Col>
          <Col md="6" className='mb-1'>
            <Label className='form-label' for="company_name">
              Contato
            </Label>
            <Input
              value={contact.contact}
              type='text'
              name="contact"
              id="contact"
              placeholder='Contato'
              onChange={e => setContact({
                ...contact,
                contact: applyMaskToPhone(e.target.value)
              })} />
            {
              errors['user.contact.contact'] && <Alert color='danger'>
                <div className='alert-body'>
                  <span>{errors['user.contact.contact'][0]}</span>
                </div>
              </Alert>
            }
          </Col>
        </Row>
        <div className='d-flex justify-content-between'>
          <Button color='secondary' className='btn-prev' outline onClick={() => stepper.previous()}>
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Voltar</span>
          </Button>
          <Button color='primary' className='btn-next' onClick={() => saveData()}>
            <span className='align-middle d-sm-inline-block d-none'>Cadastrar</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}


export default ContactData
