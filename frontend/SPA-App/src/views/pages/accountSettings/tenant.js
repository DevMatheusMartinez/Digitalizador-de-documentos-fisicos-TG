import React, { useState, useEffect } from "react"
import {
  Button,
  Media,
  Form,
  Row,
  Col
} from "reactstrap"
import { useDispatch, useSelector } from "react-redux"
import { InputForm } from "../components/componentsForm"
import api from '@src/services/api' 
import { editTenant, resetTenantsForm } from "../../../store/modules/tenants/actions"
import { SweetAlertSuccess } from "../components/sweetAlertMessage"

const Tenant = () => {
  const dispatch = useDispatch()
  const [avatar, setAvatar] = useState(null)
  const [userLogged, setUserLogged] = useState([])
  const [tenantLogged, setTenantLogged] = useState([])
  const [initialsName, setInitialsName] = useState("")
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false)
  const [shouldUpdateAvatar, setShouldUpdateAvatar] = useState(false)
  const [imageData, setImageData] = useState(null)
  const errors = useSelector(state => state.users.errors)
  const formSuccess = useSelector(state => state.tenants.formSuccess)
  const [uploadFail, setUploadFail] = useState(false)

  useEffect(() => {
    if (formSuccess) {
      SweetAlertSuccess("Finalizado", "A loja foi alterado com sucesso!", "success", function () {})
      dispatch(resetTenantsForm())
    }
  }, [formSuccess])

  const getInitial = name => {
    const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')

    const initials = [...name.matchAll(rgx)] || []

    initials = (
      (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
    ).toUpperCase()

    return initials
  }

  const changeAvatar = file => {
    setImageData(file)
    setShouldUpdateAvatar(true)
    setShouldRemoveAvatar(false)

    const fileReader = new FileReader()
    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        setAvatar(fileReader.result)
      }
    }

    fileReader.readAsDataURL(file)
  }

  const updateAvatar = () => {
    const fData = new FormData()
    fData.append('logo', imageData)
    api.post(`tenants/${tenantLogged.uuid}/upload-logo`, fData).then((response) => {
    }).catch((e) => {
      setUploadFail(true)
    })
  }

  const submitData = event => {
    event.preventDefault()

    let tenantToSave = { ...tenantLogged }

    if (shouldRemoveAvatar) {
      tenantToSave = { ...tenantToSave, logo: null }
    }

    dispatch(editTenant(tenantToSave, null))

    if (shouldUpdateAvatar) {
      updateAvatar()
    }
  }

  const removeAvatar = () => {
    setShouldRemoveAvatar(true)
    setShouldUpdateAvatar(false)
    setAvatar(null)
  }

  useEffect(() => {
    const handleCurrentTenantLogged = () => {
      api.get(`/users/userLogged`).then(response => {
        setTenantLogged(response.data.data.tenants[0])
        setAvatar(response.data.data.tenants[0].logo ?? null)
        setInitialsName(getInitial(response.data.data.tenants[0].name))
      }).catch(err => {
      })
    }
    handleCurrentTenantLogged()
  }, [])

  return (
    <Row>
      <Form onSubmit={submitData}>
        <Col sm="12">
          <Media className="mr-2">
            <Media className="mr-2 my-25" left>
              <Media className="font-medium-1 text-bold-600" tag="p" heading>
                Foto de Perfil
              </Media>
              {avatar ? (
                <Media
                  className="users-avatar-shadow rounded"
                  object
                  src={avatar}
                  height="84"
                  width="84"
                />
              ) : (
                  <div className="avatar avatar-xl mr-1 bg-default">
                    <span className="avatar-content">{initialsName}</span>
                  </div>
                )}
            </Media>
          </Media>
          <Media className="mr-2">
            <Media className="" body>
              <Button.Ripple
                tag="label"
                color="primary"
                className="mr-50"
                outline
                size="small"
              >
                Selecionar
                <input
                  id="uploadImg"
                  name="file"
                  type="file"
                  hidden
                  onChange={e => changeAvatar(e.target.files[0])}
                />
              </Button.Ripple>
              <Button.Ripple
                color="danger"
                outline
                size="small"
                onClick={() => removeAvatar()}
              >
                Remover
              </Button.Ripple>
            </Media>
          </Media>
        </Col>
        <Row>
          <Col className="mt-2">
            <InputForm
              id="data-name"
              name="name"
              field="name"
              type="text"
              title="Nome"
              className="form-control"
              placeholder="Nome"
              value={tenantLogged.name ?? ''}
              errors={errors}
              functionChange={e => setTenantLogged({ ...tenantLogged, name: e.target.value })}
            />
            <InputForm
              id="data-company_name"
              name="company_name"
              type="text"
              field="company_name"
              title="Razão Social"
              className="form-control"
              placeholder="Razão Social"
              value={tenantLogged.company_name ?? ''}
              errors={errors}
              functionChange={e => setTenantLogged({ ...tenantLogged, company_name: e.target.value })}
            />
             <InputForm
              id="data-cnpj"
              name="cnpj"
              type="text"
              field="cnpj"
              title="CNPJ"
              className="form-control"
              placeholder="CNPJ"
              value={tenantLogged.cnpj ?? ''}
              errors={errors}
              functionChange={e => setTenantLogged({ ...tenantLogged, cnpj: e.target.value })}
            />
          </Col>
          <Col sm="12" className="ml-1">
            <Button.Ripple type="button" color="primary" onClick={submitData}>
              Salvar Alterações
            </Button.Ripple>
          </Col>
        </Row>
      </Form>
    </Row>
  )
}

export default Tenant
