import React, { useState } from 'react'
import Images from './images'
import api from '../../../services/api'
import { addTab } from '../../../store/modules/navbar/actions'
import { useDispatch, useSelector } from 'react-redux'
import { SweetAlertQuestion } from '../components/sweetAlertMessage'
import { useHistory } from 'react-router-dom'

const PhotosPage = props => {
    const [images, setImages] = useState("")
    const [listImages, setListImages] = useState([])
    const tabs = useSelector(state => state.navbar.tabs)
    const vehicle = props.location.state.vehicleDataView
    const [responseMsg, setResponseMsg] = useState({
        status: "",
        message: "",
        error: ""
    })
    const history = useHistory()
    const dispatch = useDispatch()

    function removeById(array, id) {
        return array.filter(function (el) {
            return el.id !== id
        })
    }

    const closeForm = () => {
        if (tabs.length > 1) {
            const objTabs = removeById(tabs, props.location.state.id)

            if (objTabs.length - 1 >= 0) {
                const itemCurrent = objTabs[objTabs.length - 1]
                itemCurrent.active = true
                history.push({
                    pathname: itemCurrent.navLink,
                    state: itemCurrent.state
                })
                dispatch(addTab([...objTabs]))
                return
            }
        }
        history.push({
            pathname: '/veiculos',
            state: []
        })
        dispatch(addTab(
            [
                {
                    id: 'vehicles',
                    name: 'Veículos',
                    active: true,
                    navLink: '/veiculos'
                }
            ]
        ))
    }

    const getImages = () => {
        api.get(`vehicles/photos/${vehicle.uuid}`)
            .then((response) => {
                if (response.status === 200) {
                    setListImages(response.data.data)
                }
            })
            .catch((error) => {
            })
    }

    const handleChange = (e) => {
        const imagesArray = []
        for (let i = 0; i < e.target.files.length; i++) {
            imagesArray.push(e.target.files[i])
        }
        setImages(imagesArray)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        const data = new FormData()
        for (let i = 0; i < images.length; i++) {
            data.append("images[]", images[i])
        }

        api.post(`vehicles/${vehicle.uuid}/upload`, data)
            .then((response) => {
                if (response.status === 200) {
                    setResponseMsg({
                        status: response.data.status,
                        message: response.data.message
                    })
                    setTimeout(() => {
                        setResponseMsg("")
                        setImages([])
                    }, 2000)

                    document.querySelector("#imageForm").reset()

                    getImages()
                }
            })
            .catch((error) => {
                console.error(error)
            })


    }

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-xl-6 col-lg-8 col-md-8 col-sm-12 m-auto">
                    <form onSubmit={submitHandler} encType="multipart/form-data" id="imageForm">
                        <div className="card shadow">
                            {responseMsg.status === "successs" ? (
                                <div className="alert alert-success">
                                    {responseMsg.message}
                                </div>
                            ) : responseMsg.status === "failed" ? (
                                <div className="alert alert-danger">
                                    {responseMsg.message}
                                </div>
                            ) : (
                                ""
                            )}
                            <div className="card-header">
                                <h4 className="card-title fw-bold">
                                    Selecione as fotos do {vehicle.vehicle}.
                                </h4>
                            </div>

                            <div className="card-body">
                                <div className="form-group py-2">
                                    <label htmlFor="images">Imagens</label>
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleChange}
                                        className="form-control"
                                        multiple
                                    />
                                    <span className="text-danger">
                                        {responseMsg.error}
                                    </span>
                                </div>
                            </div>

                            <div className="card-footer">
                                <button type="submit" className="btn btn-success">
                                    Upload
                                </button>

                                <button onClick={e => {
                                    e.preventDefault()
                                    if (images.length > 0) {
                                        SweetAlertQuestion(
                                            'Deseja fechar sem salvar',
                                            'algumas imagens foram selecionadas, mas não upadas',
                                            'question',
                                            closeForm, function () { }
                                        )
                                        return
                                    }
                                    closeForm()
                                }} className="btn btn-danger ml-1">
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <Images listImages={listImages} vehicle={vehicle} getImages={() => getImages()} />
        </div>
    )
}

export default PhotosPage
