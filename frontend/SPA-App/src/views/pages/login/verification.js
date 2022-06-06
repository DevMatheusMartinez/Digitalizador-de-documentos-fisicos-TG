import React, { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  Button,
  Label,
  Alert
} from "reactstrap"
import api from "@src/services/api"
import resetImg from "@src/assets/images/pages/forgot-password.png"
import { useHistory } from 'react-router-dom'
import { SweetAlertSuccess } from "../components/sweetAlertMessage"

const Verification = (props) => {

  const email = props.location.state.email
  const [code, setCode] = useState("")
  const [errors, setErrors] = useState(undefined)
  const history = useHistory()

  const verificationTrue = (user) => {
    history.push({
      pathname: "/nova-senha",
      state: { user }
    })
  }

  const submitVerification = () => {
    setErrors(undefined)
    api.post('/verification',
      { email, code })
      .then(response => {
        if (response.data.errors) {
          setErrors(response.data.errors)
          return
        }
        SweetAlertSuccess("Sucesso", "Código verificado com sucesso", "success", function () { verificationTrue(response.data.data) })
      })
  }

  return (
    <Row className="m-0 justify-content-center">
      <Col
        sm="8"
        xl="7"
        lg="10"
        md="8"
        className="d-flex justify-content-center"
      >
        <Card className="bg-authentication rounded-0 mb-0 w-100">
          <Row className="m-0">
            <Col
              lg="6"
              className="d-lg-block d-none text-center align-self-center px-5"
            >
              <img className="px-5 mx-2" src={resetImg} alt="resetImg" />
            </Col>
            <Col lg="6" md="12" className="p-0">
              <Card className="rounded-0 mb-0 px-2 py-50">
                <CardHeader className="pb-1 pt-1">
                  <CardTitle>
                    <h4 className="mb-0">Verificar Código</h4>
                  </CardTitle>
                </CardHeader>
                <p className="px-2 auth-title">
                  Por favor verifique seu email, você recebeu um código para poder trocar sua senha de acesso.
                </p>
                <CardBody className="pt-1">
                  <Form>
                    <FormGroup className="form-label-group">
                      <Input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        disabled
                      />

                      <Label>Email</Label>

                    </FormGroup>
                    <FormGroup className="form-label-group">
                      <Input
                        type="text"
                        placeholder="código"
                        required
                        onChange={e => setCode(e.target.value)}
                      />
                      <Label>Código</Label>
                    </FormGroup>
                    <Alert isOpen={((errors !== undefined) || errors === "Unauthorized")} color="danger" id="alertError">
                      Código invalido!
                    </Alert>
                    <div className="d-flex justify-content-between flex-wrap flex-sm-row flex-column">
                      <Button.Ripple
                        block
                        className="btn-block"
                        color="primary"
                        outline
                        onClick={e => {
                          e.preventDefault()
                          history.push("/login")
                        }}
                      >
                        Cancelar
                      </Button.Ripple>
                      <Button.Ripple
                        block
                        color="primary"
                        type="submit"
                        className="btn-block mt-1 mt-sm-0"
                        onClick={e => { e.preventDefault(); submitVerification() }}
                      >
                        Enviar
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
}

export default Verification
