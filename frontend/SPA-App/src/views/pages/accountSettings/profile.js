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
import { editLittleUser } from "../../../store/modules/users/actions"

const Profile = () => {
  const dispatch = useDispatch()
  const [avatar, setAvatar] = useState(null)
  const [userLogged, setUserLogged] = useState([])
  const [initialsName, setInitialsName] = useState("")
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false)
  const [shouldUpdateAvatar, setShouldUpdateAvatar] = useState(false)
  const [imageData, setImageData] = useState(null)
  const errors = useSelector(state => state.users.errors)
  const formSuccess = useSelector(state => state.users.formSuccess)
  const [uploadFail, setUploadFail] = useState(false)

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
    fData.append('image', imageData)
    api.post(`users/${userLogged.uuid}/upload`, fData).then((response) => {
    }).catch((e) => {
      setUploadFail(true)
    })
  }

  const submitData = event => {
    event.preventDefault()

    let userToSave = { ...userLogged }

    if (shouldRemoveAvatar) {
      userToSave = { ...userToSave, avatar: null }
    }

    dispatch(editLittleUser(userToSave))

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
    const handleCurrentUserLogged = () => {
      api.get(`/users/userLogged`).then(response => {
        const user = response.data.data
        setUserLogged(user)
        setAvatar(user.avatar ?? null)
        setInitialsName(getInitial(user.name))
      }).catch(err => {
      })
    }
    handleCurrentUserLogged()
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
              lg="8" md="8" sm="12"
              placeholder="Nome"
              value={userLogged.name ?? ''}
              errors={errors}
              functionChange={e => setUserLogged({ ...userLogged, name: e.target.value })}
            />
            <InputForm
              id="data-email"
              name="email"
              type="email"
              field="email"
              title="Email"
              className="form-control"
              lg="8" md="8" sm="12"
              placeholder="Email"
              value={userLogged.email ?? ''}
              errors={errors}
              functionChange={e => setUserLogged({ ...userLogged, email: e.target.value })}
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

export default Profile
