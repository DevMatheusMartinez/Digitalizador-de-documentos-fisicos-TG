import React, { useEffect, useState } from "react"
import { Link, useHistory } from 'react-router-dom'
import InputPasswordToggle from '@components/input-password-toggle'
import { Row, Col, CardTitle, CardText, Form, FormGroup, Label, Input, CustomInput, Button } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import { isAuthenticated } from "@src/services/auth"
import { useDispatch, useSelector } from "react-redux"
import { addLoginSuccess, loginCleanError, submitLogin } from "../../../store/modules/auth/actions"
import Alert from "reactstrap/lib/Alert"

const LoginV2 = () => {
  const dispatch = useDispatch()

  const history = useHistory()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedTenant, setSelectedTenant] = useState('')

  const errors = useSelector(state => state.auth.errors)
  const tenants = useSelector(state => state.auth.tenants)
  const loginSuccess = useSelector(state => state.auth.loginSuccess)

  useEffect(() => {
    if (loginSuccess) {
      history.push('/')
      dispatch(addLoginSuccess(false))
    }

  }, [loginSuccess])

  const cleanErrors = () => {
    if (errors) {
      dispatch(loginCleanError(errors))
    }
  }

  const source = require(`@src/assets/images/pages/login-v2.svg`).default

  useEffect(() => {
    cleanErrors()
    if (isAuthenticated()) {
      history.push("/")
    }
  }, [])

  return (
    tenants.length <= 1 ? (
      <div className='auth-wrapper auth-v2'>
        <Row className='auth-inner m-0'>
          <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
            <svg viewBox='0 0 139 95' version='1.1' height='28'>
              <defs>
                <linearGradient x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%' id='linearGradient-1'>
                  <stop stopColor='#000000' offset='0%'></stop>
                  <stop stopColor='#FFFFFF' offset='100%'></stop>
                </linearGradient>
                <linearGradient x1='64.0437835%' y1='46.3276743%' x2='37.373316%' y2='100%' id='linearGradient-2'>
                  <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
                  <stop stopColor='#FFFFFF' offset='100%'></stop>
                </linearGradient>
              </defs>
              <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g id='Artboard' transform='translate(-400.000000, -178.000000)'>
                  <g id='Group' transform='translate(400.000000, 178.000000)'>
                    <path
                      d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'
                      id='Path'
                      className='text-primary'
                      style={{ fill: 'currentColor' }}
                    ></path>
                    <path
                      d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'
                      id='Path'
                      fill='url(#linearGradient-1)'
                      opacity='0.2'
                    ></path>
                    <polygon
                      id='Path-2'
                      fill='#000000'
                      opacity='0.049999997'
                      points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'
                    ></polygon>
                    <polygon
                      id='Path-2'
                      fill='#000000'
                      opacity='0.099999994'
                      points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'
                    ></polygon>
                    <polygon
                      id='Path-3'
                      fill='url(#linearGradient-2)'
                      opacity='0.099999994'
                      points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'
                    ></polygon>
                  </g>
                </g>
              </g>
            </svg>
            <h2 className='brand-text text-primary ml-1'>Digitalize Agora</h2>
          </Link>
          <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
            <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
              <img className='img-fluid' src={source} alt='Login V2' />
            </div>
          </Col>
          <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
            <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
              <CardTitle tag='h2' className='font-weight-bold mb-1'>
                Seja Bem-Vindo! 👋
              </CardTitle>
              <CardText className='mb-2'>Preencha os dados para acesso</CardText>
              <Form className='auth-login-form mt-2' onSubmit={e => e.preventDefault()}>
                <FormGroup>
                  <Label className='form-label' for='login-email'>
                    Email
                  </Label>
                  <Input
                    type='email'
                    id='login-email'
                    placeholder='Email'
                    autoFocus
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={() => cleanErrors()}
                  />
                </FormGroup>
                <FormGroup>
                  <div className='d-flex justify-content-between'>
                    <Label className='form-label' for='login-password'>
                      Senha
                    </Label>
                    <Link onClick={() => {
                      history.push('/esqueci-minha-senha')
                    }}>
                      <small> Esqueceu a senha? </small>
                    </Link>
                  </div>
                  <InputPasswordToggle
                    className='input-group-merge'
                    id='login-password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={() => cleanErrors()}
                  />
                </FormGroup>
                <Alert isOpen={(errors)} color="danger"
                  id="alertError">
                  Email ou senha invalidos!
                </Alert>
                <Button.Ripple color='primary' block onClick={() => {
                  dispatch(submitLogin(email, password, selectedTenant))
                }}>
                  Acessar
                </Button.Ripple>
              </Form>
            </Col>
          </Col>
        </Row>
      </div>) : (
      <Row className="m-0 justify-content-center">
        <Col
          sm="8"
          xl="7"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col className="p-0">
                <Card className="rounded-0 mb-0 px-2">
                  <CardBody>
                    <h4>Selecione uma Empresa</h4>
                    <Form onSubmit={e => e.preventDefault()}>
                      {tenants.map(tenant => (
                        <Radio
                          key={tenant.uuid}
                          label={tenant.name}
                          color="primary"
                          defaultChecked={false}
                          name="tenant"
                          className="py-50"
                          value={tenant.uuid}
                          onChange={e => setSelectedTenant(e.target.value)}
                        />))}
                      <div className="d-flex justify-content-end">
                        <Button.Ripple color="primary" type="submit" onClick={() => dispatch(submitLogin(email, password, selectedTenant))}>
                          Acessar
                        </Button.Ripple>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    )
  )
}

export default LoginV2
