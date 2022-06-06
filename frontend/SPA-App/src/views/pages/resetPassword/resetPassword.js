import React, { useEffect, useState } from "react"
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
  Label
} from "reactstrap"
import resetImg from "@src/assets/images/pages/forgot-password.png"
import { useDispatch, useSelector } from "react-redux"
import {
  editPasswordInitial
} from "@src/store/modules/users/actions"
import { AlertErrorBreakLine } from "../components/alerts"
import api from "@src/services/api"

const ResetPassword = () => {
  const dispatch = useDispatch()
  const errors = useSelector(state => state.users.errors)

  const [user, setUser] = useState({})
  useEffect(() => {
    api.get('/users/userLogged').then(
      response => {
        setUser(response.data.data)
      })
  }, [])

  const saveUser = () => {
    const userToSave = {
      ...user
    }

    dispatch(editPasswordInitial(userToSave))
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
                    <h4 className="mb-0">Trocar senha de usuário</h4>
                  </CardTitle>
                </CardHeader>
                <p className="px-2 auth-title">
                  Por favor digite sua nova senha.
                </p>
                <CardBody className="pt-1">
                  <Form>
                    <FormGroup className="form-label-group">
                      <Input
                        type="password"
                        placeholder="Nova senha"
                        required
                        onChange={e => setUser({ ...user, password: e.target.value })}
                      />
                      <Label>Password</Label>
                    </FormGroup>
                    <FormGroup className="form-label-group">
                      <Input
                        type="password"
                        placeholder="Confirmar senha"
                        required
                        onChange={e => setUser({ ...user, password_confirmation: e.target.value })}
                      />
                      <Label>Confirmar senha</Label>
                    </FormGroup>
                    <AlertErrorBreakLine field={'password'} errors={errors} />
                    <div className="d-flex justify-content-between flex-wrap flex-sm-row flex-column">
                      <Button.Ripple
                        block
                        type="button"
                        color="primary"
                        className="btn-block mt-1 mt-sm-0"
                        onClick={e => saveUser()}
                      >
                        OK
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

export default ResetPassword