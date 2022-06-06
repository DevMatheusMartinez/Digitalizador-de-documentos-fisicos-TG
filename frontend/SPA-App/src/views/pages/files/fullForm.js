import { listManufacturer, listFuel, listColor, listType } from "../../../support/constants"
import Toggle from "react-toggle"
import {
    Form,
    Card,
    CardBody,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Button
} from "reactstrap"
import React, { useEffect, useState } from "react"
import Row from "reactstrap/es/Row"
import { maskYearModel, maskMileage, applyMaskToCpfCnpj } from "../../../support/masks"
import {
    FaRegAddressCard
} from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { addVehicle, addVehicleSaved, editVehicle, resetVehicleForm } from "../../../store/modules/vehicles/actions"
import "react-toggle/style.css"
import Col from "reactstrap/lib/Col"
import { AlertTriangle, Truck } from "react-feather"
import { InputForm, SelectForm } from "../components/componentsForm"
import { GroupButtons } from "../components/groupButtons"
import { SweetAlertQuestion, SweetAlertSuccess } from "../components/sweetAlertMessage"
import { addTab } from "../../../store/modules/navbar/actions"
import { useHistory } from "react-router-dom"
import { addZeroesRenavam } from "../../../support/functions"

const FullForm = props => {
    const dispatch = useDispatch()
    const vehicleSaved = useSelector(state => state.vehicles.vehicleSaved)
    const tabs = useSelector(state => state.navbar.tabs)
    const [vehicle, setVehicle] = useState(vehicleSaved ?? {})
    const [isSelected, setIsSelected] = useState({ type: false, fuel: false, manufacturer: false, color: false })
    const [active, setActive] = useState("vehicleData")
    const formSuccess = useSelector(state => state.vehicles.formSuccess)
    const errors = useSelector(state => state.vehicles.errors)
    const history = useHistory()

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
                dispatch(resetVehicleFormSaved())
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
        dispatch(resetVehicleFormSaved())
    }


    useEffect(() => {
        dispatch(addVehicleSaved(vehicle))
    })

    useEffect(() => {
        if (formSuccess) {
            SweetAlertSuccess("Finalizado", "O veículo foi cadastrado com sucesso!", 'success', function () {
                closeForm()
            })
        }
        dispatch(resetVehicleForm())
        dispatch(resetVehicleFormSaved())

    }, [formSuccess])

    const toggle = tab => {
        return active !== tab && setActive(tab)
    }

    const saveVehicle = async () => {
        const vehicleToSave = {
            ...vehicle
        }

        dispatch(addVehicle(vehicleToSave))
    }

    function currentDateFormat() {
        const data = new Date(),
            dia = data.getDate().toString(),
            diaF = (dia.length === 1) ? `0${dia}` : dia,
            mes = (data.getMonth() + 1).toString(),
            mesF = (mes.length === 1) ? `0${mes}` : mes,
            anoF = data.getFullYear()
        return `${diaF}/${mesF}/${anoF}`
    }

    const activeClass = { borderBottom: '#106aae solid 2px', borderRadius: '2px', color: '#106aae' }
    const errorClass = { borderBottom: '#ea5455 solid 2px', borderRadius: '2px', color: '#ea5455' }
    const [styleTabVehicle, setStyleTabVehicle] = useState(activeClass)
    const [styleTabOwner, setStyleTabOwner] = useState({})
    const [errorVehicle, setErrorVehicle] = useState(false)
    const [errorOwner, setErrorOwner] = useState(false)

    useEffect(() => {
        setErrorVehicle(false)
        setErrorOwner(false)

        if (errors['board'] !== undefined ||
            errors['chassi'] !== undefined ||
            errors['color'] !== undefined ||
            errors['crlv'] !== undefined ||
            errors['crv'] !== undefined ||
            errors['fuel'] !== undefined ||
            errors['km'] !== undefined ||
            errors['engine'] !== undefined ||
            errors['manufacturer'] !== undefined ||
            errors['model'] !== undefined ||
            errors['renavam'] !== undefined ||
            errors['type'] !== undefined ||
            errors['year_and_model'] !== undefined
        ) {
            setStyleTabVehicle(errorClass)
            setErrorVehicle(true)
        }

        if (errors['owner'] !== undefined || errors['owner_doc'] !== undefined
        ) {
            setStyleTabOwner(errorClass)
            setErrorOwner(true)
        }
    }, [errors])

    useEffect(() => {
        setVehicle({ ...vehicle, in_stock: false })
    }, [])

    return (
        <div>
            <Form>
                <Card>
                    <CardBody>
                        <Nav tabs>
                            <NavItem style={styleTabVehicle}>
                                <NavLink style={{ color: styleTabVehicle.color }}
                                    onClick={() => {
                                        toggle("vehicleData")
                                        setStyleTabVehicle(activeClass)
                                        setStyleTabOwner(errorOwner ? errorClass : {})
                                    }}
                                >
                                    {
                                        errorVehicle ? <AlertTriangle size='18' /> : <Truck size='18' />
                                    }
                                    {" Veículo"}
                                </NavLink>
                            </NavItem>
                            <NavItem style={styleTabOwner}>
                                <NavLink style={{ color: styleTabOwner.color }}
                                    onClick={() => {
                                        toggle("ownerData")
                                        setStyleTabOwner(activeClass)
                                        setStyleTabVehicle(errorVehicle ? errorClass : {})
                                    }}
                                >
                                    {
                                        errorOwner ? <AlertTriangle size='18' /> : <FaRegAddressCard size='18' />
                                    }
                                    {" Proprietário"}

                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={active}>
                            <TabPane tabId="vehicleData">
                                <Row className="justify-content-md-left ml-1">
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            id="data-board"
                                            field="board"
                                            placeholder="Placa"
                                            value={vehicle.board ?? ''}
                                            className="form-control"
                                            type="text"
                                            title="Placa *"
                                            name="board"
                                            length={7}
                                            ch="9ch"
                                            functionChange={e => setVehicle({ ...vehicle, board: e.target.value })}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <SelectForm
                                            errors={errors}
                                            id="data-type"
                                            field="type"
                                            listFilter={listType.filter(e => e.value === vehicle.type ?? '')}
                                            title="Tipo *"
                                            name="type"
                                            ch="15ch"
                                            options={listType}
                                            functionChange={type => { setVehicle({ ...vehicle, type: type.value }); setIsSelected({ ...isSelected, type: false }) }}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <SelectForm
                                            errors={errors}
                                            id="data-manufacturer"
                                            field="manufacturer"
                                            ch="20ch"
                                            listFilter={listManufacturer.filter(e => e.value === vehicle.manufacturer) ?? ''}
                                            title="Fabricante *"
                                            name="manufacturer"
                                            options={listManufacturer}
                                            functionChange={manufacturer => { setVehicle({ ...vehicle, manufacturer: manufacturer.value }); setIsSelected({ ...isSelected, manufacturer: false }) }}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            id="data-model"
                                            field="model"
                                            ch="17ch"
                                            placeholder="Modelo"
                                            value={vehicle.model ?? ''}
                                            className="form-control"
                                            type="text"
                                            title="Modelo *"
                                            name="model"
                                            functionChange={e => setVehicle({ ...vehicle, model: e.target.value })}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            id="data-year_and_model"
                                            field="year_and_model"
                                            ch="11ch"
                                            placeholder="ANO/MODELO"
                                            value={vehicle.year_and_model ?? ''}
                                            className="form-control"
                                            length={9}
                                            type="text"
                                            title="ANO/MODELO *"
                                            name="year_and_model"
                                            functionChange={e => setVehicle({ ...vehicle, year_and_model: maskYearModel(e.target.value) })}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <SelectForm
                                            errors={errors}
                                            id="data-color"
                                            field="color"
                                            listFilter={listColor.filter(e => e.value === vehicle.color) ?? ''}
                                            title="Cor"
                                            ch="13ch"
                                            name="color"
                                            options={listColor}
                                            functionChange={color => { setVehicle({ ...vehicle, color: color.value }); setIsSelected({ ...isSelected, color: false }) }}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            id="data-chassi"
                                            field="chassi"
                                            placeholder="Chassi"
                                            ch="18ch"
                                            value={vehicle.chassi ?? ''}
                                            className="form-control"
                                            type="text"
                                            title="Chassi *"
                                            name="chassi"
                                            functionChange={e => setVehicle({ ...vehicle, chassi: e.target.value })}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            id="data-renavam"
                                            field="renavam"
                                            ch="15ch"
                                            placeholder="Renavam"
                                            value={vehicle.renavam ?? ''}
                                            className="form-control"
                                            type="text"
                                            length={14}
                                            functionOnBlur={e => {
                                                setVehicle({ ...vehicle, renavam: addZeroesRenavam(e.target.value, 11) })
                                            }}
                                            title="Renavam *"
                                            name="renavam"
                                            functionChange={e => { setVehicle({ ...vehicle, renavam: e.target.value }) }}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            id="data-engine"
                                            ch="11ch"
                                            field="engine"
                                            placeholder="Motor"
                                            value={vehicle.engine ?? ''}
                                            className="form-control"
                                            type="text"
                                            title="Motor *"
                                            name="engine"
                                            functionChange={e => setVehicle({ ...vehicle, engine: e.target.value })}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            id="data-crv"
                                            field="crv"
                                            ch="11ch"
                                            placeholder="CRV"
                                            value={vehicle.crv ?? ''}
                                            className="form-control"
                                            type="text"
                                            title="CRV *"
                                            name="cvr"
                                            functionChange={e => setVehicle({ ...vehicle, crv: e.target.value })}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <SelectForm
                                            errors={errors}
                                            id="data-fuel"
                                            field="fuel"
                                            listFilter={listFuel.filter(e => e.value === vehicle.fuel) ?? ''}
                                            title="Combustível *"
                                            ch="19ch"
                                            name="fuel"
                                            options={listFuel}
                                            functionChange={fuel => { setVehicle({ ...vehicle, fuel: fuel.value }); setIsSelected({ ...isSelected, fuel: false }) }}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            id="data-crlv"
                                            field="crlv"
                                            placeholder="CRLV"
                                            value={vehicle.crlv ?? ''}
                                            className="form-control"
                                            type="text"
                                            lenght={4}
                                            ch="6ch"
                                            title="CRLV *"
                                            name="crlv"
                                            functionChange={e => setVehicle({ ...vehicle, crlv: e.target.value })}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            id="data-km"
                                            field="km"
                                            placeholder="Km"
                                            value={vehicle.km ?? ''}
                                            length={7}
                                            ch="8ch"
                                            className="form-control"
                                            type="text"
                                            title="KM *"
                                            name="km"
                                            functionChange={e => setVehicle({ ...vehicle, km: maskMileage(e.target.value) })}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            id="data-register_data"
                                            field="register_date"
                                            placeholder="Data de Registro"
                                            value={vehicle.created_at ?? currentDateFormat()}
                                            className="form-control"
                                            ch="10ch"
                                            type="text"
                                            title="Data de Registro *"
                                            name="register_date"
                                            disabled={'disabled'}
                                        />
                                    </Col>
                                </Row>
                                <Row className="justify-content-md-left ml-1">
                                    <label className="react-toggle-wrapper w-25 mb-1">
                                        <Toggle
                                            defaultChecked={vehicle.in_stock}
                                            className="switch-danger ml-1"
                                            onChange={e => setVehicle({ ...vehicle, in_stock: e.target.checked })}
                                        />
                                        <span className="label-text">Em estoque</span>
                                    </label>
                                </Row>
                                <Row className="justify-content-md-left ml-1">
                                    <InputForm
                                        errors={errors}
                                        id="data-notes"
                                        value={vehicle.notes ?? ''}
                                        className="form-control"
                                        ch="70ch"
                                        type="textarea"
                                        title="Notas "
                                        name="notes"
                                        functionChange={e => setVehicle({ ...vehicle, notes: e.target.value })}
                                    />
                                </Row>
                            </TabPane>
                            <TabPane tabId="ownerData">
                                <Row className="justify-content-md-left ml-1">
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            field="owner"
                                            id="data-owner"
                                            placeholder="Nome"
                                            value={vehicle.owner ?? ''}
                                            className="form-control"
                                            ch="25ch"
                                            type="text"
                                            title="Nome *"
                                            name="owner"
                                            functionChange={e => setVehicle({ ...vehicle, owner: e.target.value })}
                                        />
                                    </Col>
                                    <InputForm
                                        errors={errors}
                                        id="data-owner_doc"
                                        field="owner_doc"
                                        placeholder="Cpf"
                                        value={vehicle.owner_doc ?? ''}
                                        className="form-control"
                                        ch="15ch"
                                        type="text"
                                        title="CPF *"
                                        name="owner_doc"
                                        functionChange={e => setVehicle({ ...vehicle, owner_doc: applyMaskToCpfCnpj(e.target.value) })}
                                    />
                                </Row>
                            </TabPane>
                        </TabContent>

                        <hr />
                        <GroupButtons uuid={vehicle.uuid} functionCancel={() => SweetAlertQuestion("Deseja cancelar o cadastro?", "", "question", closeForm, function () { })} functionSave={() => saveVehicle()} />
                    </CardBody>
                </Card>
            </Form>
        </div>
    )
}
export default FullForm
