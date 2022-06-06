// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Icons Imports
import { ArrowLeft, ArrowRight } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button } from 'reactstrap'
import Alert from 'reactstrap/lib/Alert'
import { addUserValidateStep, resetUserForm } from '../../../../store/modules/users/actions'

const UserData = ({ stepper, setData, data }) => {

  const dispatch = useDispatch()

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  })

  const errors = useSelector(state => state.users.errors)
  const formSuccess = useSelector(state => state.users.formSuccess)

  useEffect(() => {
    if (formSuccess) {
      setData({
        ...data, nameUser: user.name, email: user.email, password: user.password, password_confirmation: user.password_confirmation 
      })
      stepper.next()
      dispatch(resetUserForm())
    }
  }, [formSuccess])

  const nextStep = () => {
    dispatch(addUserValidateStep(user))
  }

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Dados do Usuário</h5>
        <small className='text-muted'>Digite os dados do Usuário.</small>
      </div>
      <Form>
        <Row>
          <Col md="6" className='mb-1'>
            <Label className='form-label' for="name">
              Nome
            </Label>
            <Input
              value={user.name}
              type='text'
              name="name"
              id="name"
              placeholder='Nome'
              onChange={e => setUser({
                ...user,
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
          <Col md="6" className='mb-1'>
            <Label className='form-label' for="company_name">
              Email
            </Label>
            <Input
              value={user.email}
              type='text'
              name="email"
              id="email"
              placeholder='Email'
              onChange={e => setUser({
                ...user,
                email: e.target.value
              })} />
            {
              errors.email && <Alert color='danger'>
                <div className='alert-body'>
                  <span>{errors.email[0]}</span>
                </div>
              </Alert>
            }
          </Col>
          <Col md="6" className='mb-1'>
            <Label className='form-label' for="cnpj">
              Senha
            </Label>
            <Input
              value={user.password}
              type='password'
              name="password"
              id="password"
              placeholder='password'
              onChange={e => setUser({
                ...user,
                password: e.target.value
              })}
            />
            {
              errors.password && <Alert color='danger'>
                <div className='alert-body'>
                  <span>{errors.password[0]}</span>
                </div>
              </Alert>
            }
          </Col>
          <Col md="6" className='mb-1'>
            <Label className='form-label' for="cnpj">
              Confirmar senha
            </Label>
            <Input
              value={user.password_confirmation}
              type='password'
              name="password_confirmation"
              id="password_confirmation"
              placeholder='Confirmar senha'
              onChange={e => setUser({
                ...user,
                password_confirmation: e.target.value
              })}
            />
            {
              errors.password_confirmation && <Alert color='danger'>
                <div className='alert-body'>
                  <span>{errors.password_confirmation[0]}</span>
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
          <Button color='primary' className='btn-next' onClick={() => nextStep()}>
            <span className='align-middle d-sm-inline-block d-none'>Proximo</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}


export default UserData
