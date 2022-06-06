import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  Input,
  Label
} from "reactstrap"
import Row from "reactstrap/es/Row"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addTerm, editTerm, resetTermsForm } from "../../../store/modules/terms/actions"
import { InputForm, SelectForm } from "../components/componentsForm"
import { GroupButtons } from "../components/groupButtons"
import { typeTerm } from "../../../support/constants"
import { addTab } from "../../../store/modules/navbar/actions"
import { SweetAlertQuestion, SweetAlertSuccess } from "../components/sweetAlertMessage"
import { useHistory } from "react-router-dom"
import img2 from './scanner.jpg'
import api from "../../../services/api"
import RepeatingForm from "./RepeatingForm"
import InvoiceList from "./InvoiceList"
import UploadPreview from "./upload"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import axios from "axios"

const FullFormUpload = props => {
  const dispatch = useDispatch()
  const { closeFullForm, termToEdit } = props
  const [active, setActive] = useState("personalData")
  const toggle = tab => {
    return active !== tab && setActive(tab)
  }
  const [term, setTerm] = useState(termToEdit ?? {})
  const errors = useSelector(state => state.terms.errors)
  const formSuccess = useSelector(state => state.terms.formSuccess)
  const tabs = useSelector(state => state.navbar.tabs)
  const [openAlertQuestion, setOpenAlertQuestion] = useState(false)
  const history = useHistory()

  const saveTerm = () => {
    const termToSave = {
      ...term
    }

    if (term.uuid) {
      dispatch(editTerm(termToSave))
      return
    }

    dispatch(addTerm(termToSave))
  }

  const [userLogged, setUserLogged] = useState([])

  const handleCurrentUserLogged = () => {
    api.get(`/users/userLogged`).then(response => {
      setUserLogged(response.data.data)
    }).catch(err => {
    }
    )
  }

  useEffect(() => {
    handleCurrentUserLogged()
  }, [])

  const [image, setImage] = useState(null);
  const [table, setTable] = useState(null);

  const MySwal = withReactContent(Swal)

  const handleSuccess = () => {
    return MySwal.fire({
      title: 'Registrado com sucesso',
      text: 'os dados do seu arquivo foi salvo no banco.',
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    })
  }

  const handleFail = () => {
    return MySwal.fire({
      title: 'Houve um erro',
      text: 'ocorreu um erro',
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append("image", image)
    
    formData.append("table", table)
    try {
      axios({
        method: "post",
        url: "http://127.0.0.1:8080/api/v1/pegar-valores/",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: 'Token c5ba9abb243a2aa4ec8ea4678390692748fd9ec1',
        }
      }).then(() => {
        handleSuccess()
      }).catch(responde => {
        handleFail()
        console.log(responde)
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form>
      <Card>
        <CardBody>
          <UploadPreview image={image} setImage={obj => setImage(obj)} />
          <hr />
          <Col lg="4">
            <Label>Tabela:</Label>
            <Input value={table} onChange={e => setTable(e.target.value)}/>
          </Col>
          <InvoiceList/>
          <GroupButtons functionCancel={() => SweetAlertQuestion("Deseja cancelar o cadastro?", "", "question", closeForm, function () { })} functionSave={e => handleSubmit(e)} />
        </CardBody>
      </Card>
    </Form>
  )
}
export default FullFormUpload

