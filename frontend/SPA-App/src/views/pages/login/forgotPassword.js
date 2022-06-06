import React, { useState } from "react"
import { Link, useHistory } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import { Card, CardBody, CardTitle, CardText, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import Alert from "reactstrap/lib/Alert"
import api from "@src/services/api"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const ForgotPasswordV1 = () => {

  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState(undefined)
  const [sendingFailed, setSendingFailed] = useState(false)
  const history = useHistory()

  const MySwal = withReactContent(Swal)

  const AnimatedSweetAlert = () => {
    return MySwal.fire({
      icon: 'success',
      title: 'Confirmado',
      text: 'Um código de acesso foi enviado ao seu email!',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      showClass: {
        popup: 'animate__animated animate__bounceIn'
      },
      buttonsStyling: false,
      confirmButtonText: 'ok'
    }).then((result) => {
      if (result.isConfirmed) {
        history.push({
          pathname: "/verificação",
          state: { email }
        })
      }
    })
  }

  const submitForgotPassword = () => {
    setErrors(undefined)
    api.post(`/forgot-password`, { email })
      .then(response => {
        if (response.data !== "Email enviado com sucesso!") {
          if (response.status === 500) {
            setSendingFailed(true)
          }
          setErrors(response.data.errors)
          return
        }

        AnimatedSweetAlert()
      })
  }

  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div className='auth-inner py-2'>
        <Card className='mb-0'>
          <CardBody>
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
            <CardTitle tag='h4' className='mb-1'>
              Esqueceu sua senha? 🔒
            </CardTitle>
            <CardText className='mb-2'>
              Digite seu e-mail e enviaremos instruções para redefinir sua senha
            </CardText>
            <Form className='auth-forgot-password-form mt-2' onSubmit={e => e.preventDefault()}>
              <FormGroup>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Input type='email' id='login-email' placeholder='email' autoFocus onChange={e => {
                  setEmail(e.target.value)
                }} />
              </FormGroup>
              <Alert isOpen={((errors !== undefined) || errors === "Unauthorized")} color="danger" id="alertError">
                Email invalido!
              </Alert>
              <Alert isOpen={sendingFailed} color="danger" id="alertError">
                O email é válido porem ocorreu um problema no envio do seu email, por favor tenta novamente mais tarde!
              </Alert>
              <Button.Ripple color='primary' block onClick={e => {
                e.preventDefault()
                submitForgotPassword()
              }}>
                Enviar
              </Button.Ripple>
            </Form>
            <p className='text-center mt-2'>
              <Link onClick={() => history.push("/login")}>
                <ChevronLeft className='mr-25' size={14} />
                <span className='align-middle'>Voltar para login</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPasswordV1
