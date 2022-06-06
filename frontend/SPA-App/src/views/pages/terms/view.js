import React, {useState} from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Media,
  Row,
  Col,
  Button,
} from "reactstrap"
import { Edit, Trash, CornerUpLeft } from "react-feather"
import SweetAlert from 'react-bootstrap-sweetalert';
import api from "services/api";
const CustomerView = props =>  {
    const {closeFullForm, term} = props;
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [defaultAlert, setDefaultAlert] = useState(false);
    const [cancelAlert, setCancelAlert] = useState(false);

    const handleDelete = () => {
        setConfirmAlert(true)
        api.delete(`/terms/${term.uuid}`).then(() => {
        })
          .catch(err => {
          });
      }

    const handleCurrentData = term => {
        api.get(`/terms/${term.uuid}`).then(response => {
          props.openFullForm(response.data.data)
        }).catch(err => {
        });
      }

    return (
      <React.Fragment>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <CardTitle>Termo</CardTitle>
              </CardHeader>
              <CardBody>
                <Row className="mx-0" col="12">
                  <Col className="pl-0" sm="12">
                    <Media className="d-sm-flex d-block">
                      <Media body>
                        <Row>
                          <Col sm="9" md="6" lg="5">
                            <div className="users-page-view-table">
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Titulo: 
                                </div>
                                     <div>{term.title ?? "Não Inserido"}</div>
                              </div>
                            </div>
                          </Col>
                          <Col sm="9" md="6" lg="5">
                            <div className="users-page-view-table">
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Tipo: 
                                </div>
                                     <div>{term.type ?? "Não Inserido"}</div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Media>
                    </Media>
                  </Col>
                  <Col className="mt-1 pl-0" sm="12">
                    <Button.Ripple className="mr-1" color="primary" outline onClick={() => handleCurrentData(term)}>
                        <Edit size={15} />
                        <span className="align-middle ml-50">Alterar</span>
                    </Button.Ripple>
                    <Button.Ripple color="danger" className="mr-1" outline onClick={() => {
                        setDefaultAlert(true)
                    }}>
                      <Trash size={15} />
                      <span className="align-middle ml-50">Deletar</span>
                    </Button.Ripple>
                    <Button.Ripple color="dark" outline onClick={() => {
                        closeFullForm();
                    }}>
                      <CornerUpLeft size={15} />
                      <span className="align-middle ml-50">Sair</span>
                    </Button.Ripple>
                  </Col>
                  </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
        <Col sm="12">
            <Card>
              <CardHeader>
                <CardTitle>Texto do Termo</CardTitle>
              </CardHeader>
              <CardBody>
                <Row className="mx-0" col="12">
                  <Col className="pl-0" sm="12">
                    <Media className="d-sm-flex d-block">
                      <Media body>
                        <Row>
                          <Col>
                            <div className="users-page-view-table">
                              <div className="d-flex user-info">
                                     <div>{term.term ?? "Não Inserido"}</div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Media>
                    </Media>
                  </Col>
                  </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        

        <SweetAlert title="Você tem certeza?"
        warning
        show={defaultAlert}
        showCancel
        reverseButtons
        cancelBtnBsStyle="danger"
        confirmBtnText="Sim, excluir!"
        cancelBtnText="Cancelar"
        onConfirm={() => handleDelete()}
        onCancel={() => {
          setCancelAlert(true)
        }}
      >
        Você não poderá reverter isso!
        </SweetAlert>
    
        <SweetAlert success title="Excluído!"
        confirmBtnBsStyle="success"
        show={confirmAlert}
        onConfirm={() => {
          setDefaultAlert(false)
          setConfirmAlert(false)
          closeFullForm()
        }}
      >
        <p className="sweet-alert-text">O Termo foi excluído com sucesso!.</p>
      </SweetAlert>

      <SweetAlert error title="Cancelado"
        confirmBtnBsStyle="success"
        show={cancelAlert}
        onConfirm={() => {
          setDefaultAlert(false)
          setCancelAlert(false)
        }}
      >
        <p className="sweet-alert-text">
          Seu Termo está seguro :)
          </p>
      </SweetAlert>

      </React.Fragment>
    )
  }

export default CustomerView;