import { Button } from "reactstrap"
import React from "react"
import Row from "reactstrap/es/Row"
import Col from "reactstrap/es/Col"
import { Plus, X } from "react-feather"
import { applyMaskToPhone, maskBirthday } from "../../../support/masks"
import { v4 as uuidv4 } from 'uuid'
import Spinner from "reactstrap/lib/Spinner"
import { ufList, listOccupation } from "../../../support/constants"
import { InputForm, SelectForm } from "./componentsForm"

export const IncomeForm = props => {
    const inputIncomes = props.inputIncomes
    const errors = props.errors
    const loading = props.loading

    return (
        <div>
            {
                inputIncomes.map((inputIncome, index) => {
                    return <>
                        <Row>
                            <Col lg="10">
                                <Row>
                                    <Col md="auto">
                                        <SelectForm
                                            ch=""
                                            errors={errors}
                                            ch="26ch"
                                            id="incomes-occupation"
                                            classNameFormGroup="ml-2"
                                            listFilter={listOccupation.filter(occupation => occupation.value === inputIncome.occupation) ?? ''}
                                            field={`incomes.${index}.occupation`}
                                            title="Ocupação"
                                            name="occupation"
                                            options={listOccupation}
                                            functionChange={occupation => {
                                                const newInputOccupation = inputIncomes.map(input => {
                                                    if (inputIncome.id === input.id) {
                                                        input["occupation"] = occupation.value
                                                    }
                                                    return input
                                                })
                                                props.setInputIncomes(newInputOccupation)
                                            }}
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            field={`incomes.${index}.company`}
                                            id="income-company"
                                            placeholder="Empresa"
                                            value={inputIncome.company ?? ''}
                                            className="form-control"
                                            classNameFormGroup="ml-1"
                                            type="text"
                                            title="Empresa"
                                            name="company"
                                            functionChange={company => {
                                                const newInputCompany = inputIncomes.map(input => {
                                                    if (inputIncome.id === input.id) {
                                                        input["company"] = company.target.value
                                                    }
                                                    return input
                                                })
                                                props.setInputIncomes(newInputCompany)
                                            }} />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            field={`incomes.${index}.cnpj`}
                                            ch='17ch'
                                            id="income-cnpj"
                                            placeholder="CNPJ"
                                            value={inputIncome.cnpj ?? ''}
                                            className="form-control"
                                            classNameFormGroup="ml-1"
                                            type="text"
                                            classNameFormGroup="ml-1"
                                            title="CNPJ"
                                            name="CNPJ"
                                            functionChange={cnpj => {
                                                const newInputCnpj = inputIncomes.map(input => {
                                                    if (inputIncome.id === input.id) {
                                                        input["cnpj"] = cnpj.target.value
                                                    }
                                                    return input
                                                })
                                                props.setInputIncomes(newInputCnpj)
                                            }} />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            field={`incomes.${index}.role`}
                                            ch='10ch'
                                            id="incomes-role"
                                            placeholder="Cargo"
                                            value={inputIncome.role ?? ''}
                                            className="form-control"
                                            classNameFormGroup="ml-1"
                                            type="text"
                                            title="Cargo"
                                            name="role"
                                            functionChange={role => {
                                                const newInputRole = inputIncomes.map(input => {
                                                    if (inputIncome.id === input.id) {
                                                        input["role"] = role.target.value
                                                    }
                                                    return input
                                                })
                                                props.setInputIncomes(newInputRole)
                                            }} />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            field={`incomes.${index}.value`}
                                            id="income-value"
                                            ch='10ch'
                                            placeholder="Renda"
                                            value={inputIncome.value ?? ''}
                                            className="form-control"
                                            classNameFormGroup="ml-1"
                                            type="text"
                                            title="Renda"
                                            name="value"
                                            functionChange={value => {
                                                const newInputValue = inputIncomes.map(input => {
                                                    if (inputIncome.id === input.id) {
                                                        input["value"] = value.target.value
                                                    }
                                                    return input
                                                })
                                                props.setInputIncomes(newInputValue)
                                            }} />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            ch="10ch"
                                            field={`incomes.${index}.start_date`}
                                            id="income-startDate"
                                            length={10}
                                            placeholder="Inicio"
                                            value={inputIncome.start_date ?? ''}
                                            className="form-control"
                                            classNameFormGroup="ml-1"
                                            type="text"
                                            title="Inicio"
                                            name="start_date"
                                            functionChange={startDate => {
                                                const newInputStartDate = inputIncomes.map(input => {
                                                    if (inputIncome.id === input.id) {
                                                        input["start_date"] = maskBirthday(startDate.target.value)
                                                    }
                                                    return input
                                                })
                                                props.setInputIncomes(newInputStartDate)
                                            }} />
                                    </Col>
                                </Row>
                                <Row style={{ marginLeft: "7px" }}>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            ch='11ch'
                                            field={`incomes.${index}.zipcode`}
                                            id="data-zipcode"
                                            placeholder="CEP"
                                            value={inputIncome.zipcode ?? ''}
                                            className="form-control"
                                            type="text"
                                            title="CEP"
                                            name="cep"
                                            functionChange={
                                                zipcode => {
                                                    const newInputStartDate = inputIncomes.map(input => {
                                                        if (inputIncome.id === input.id) {
                                                            input["zipcode"] = zipcode.target.value
                                                        }
                                                        return input
                                                    })
                                                    props.setInputIncomes(newInputStartDate)
                                                }
                                            }
                                        />
                                    </Col>
                                    {loading ? <Col><Spinner className='d-block mt-2' color="primary" /> </Col> : <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            ch='25ch'
                                            field={`incomes.${index}.address`}
                                            id="data-address"
                                            placeholder="Logradouro"
                                            className="form-control"
                                            value={inputIncome.address ?? ''}
                                            type="text"
                                            title="Logradouro"
                                            functionChange={
                                                address => {
                                                    const newInputStartDate = inputIncomes.map(input => {
                                                        if (inputIncome.id === input.id) {
                                                            input["address"] = address.target.value
                                                        }
                                                        return input
                                                    })
                                                    props.setInputIncomes(newInputStartDate)
                                                }
                                            }
                                        />
                                    </Col>}
                                    {loading ? <Col><Spinner className='d-block mt-2' color="primary" /> </Col> : <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            ch='6ch'
                                            field={`incomes.${index}.number`}
                                            id="data-number"
                                            placeholder="Nº"
                                            value={inputIncome.number ?? ''}
                                            className="form-control"
                                            type="text"
                                            title="Nº"
                                            functionChange={number => {
                                                const newInputStartDate = inputIncomes.map(input => {
                                                    if (inputIncome.id === input.id) {
                                                        input["number"] = number.target.value
                                                    }
                                                    return input
                                                })
                                                props.setInputIncomes(newInputStartDate)
                                            }}
                                        />
                                    </Col>
                                    }
                                    {loading ? <Col><Spinner className='d-block mt-2' color="primary" /> </Col> : <Col md="auto">
                                        <InputForm
                                            ch='16ch'
                                            errors={errors}
                                            field={`incomes.${index}.neighborhood`}
                                            id="data-neighborhood"
                                            placeholder="Bairro"
                                            value={inputIncome.neighborhood ?? ''}
                                            className="form-control"
                                            type="text"
                                            title="Bairro"
                                            functionChange={
                                                neighborhood => {
                                                    const newInputStartDate = inputIncomes.map(input => {
                                                        if (inputIncome.id === input.id) {
                                                            input["neighborhood"] = neighborhood.target.value
                                                        }
                                                        return input
                                                    })
                                                    props.setInputIncomes(newInputStartDate)
                                                }
                                            }
                                        />
                                    </Col>
                                    }
                                    {loading ? <Col><Spinner className='d-block mt-2' color="primary" /> </Col> : <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            ch='21ch'
                                            lg="5"
                                            md="5"
                                            sm="12"
                                            field={`incomes.${index}.neighborhood`}
                                            id="data-city"
                                            placeholder="Cidade"
                                            value={inputIncome.city ?? ''}
                                            className="form-control"
                                            type="text"
                                            title="Cidade"
                                            functionChange={
                                                city => {
                                                    const newInputStartDate = inputIncomes.map(input => {
                                                        if (inputIncome.id === input.id) {
                                                            input["city"] = city.target.value
                                                        }
                                                        return input
                                                    })
                                                    props.setInputIncomes(newInputStartDate)
                                                }
                                            }
                                        />
                                    </Col>
                                    }
                                    <Col md="auto">
                                        <SelectForm
                                            errors={errors}
                                            ch='9ch'
                                            id="data-state"
                                            field={`incomes.${index}.uf`}
                                            listFilter={ufList.filter(e => e.value === inputIncome.uf) ?? ''}
                                            title="UF"
                                            name="uf"
                                            placeholder="UF"
                                            options={ufList}
                                            functionChange={
                                                uf => {
                                                    const newInputStartDate = inputIncomes.map(input => {
                                                        if (inputIncome.id === input.id) {
                                                            input["uf"] = uf.value
                                                        }
                                                        return input
                                                    })
                                                    props.setInputIncomes(newInputStartDate)
                                                }
                                            }
                                        />
                                    </Col>
                                    <Col md="auto">
                                        <InputForm
                                            errors={errors}
                                            field={`incomes.${index}.telephone`}
                                            id="income-telephone"
                                            ch="15ch"
                                            placeholder="Telefone"
                                            value={inputIncome.telephone ?? ''}
                                            className="form-control"
                                            type="text"
                                            title="Telefone"
                                            name="telephone"
                                            functionChange={telephone => {
                                                const newInputCompany = inputIncomes.map(input => {
                                                    if (inputIncome.id === input.id) {
                                                        input["telephone"] = applyMaskToPhone(telephone.target.value)
                                                    }
                                                    return input
                                                })
                                                props.setInputIncomes(newInputCompany)
                                            }} />
                                    </Col>
                                </Row>
                            </Col>

                            <Col lg="1" className="mt-4">
                                <Button.Ripple
                                    className="text-nowrap px-1"
                                    color="danger"
                                    outline
                                    onClick={
                                        () => {
                                            const values = [...inputIncomes]

                                            values.splice(values.findIndex(value => value.id === inputIncome.id), 1)
                                            props.setInputIncomes(values)
                                        }
                                    }
                                >
                                    <X size={14} className='mr-50' />
                                    <span>Excluir</span>
                                </Button.Ripple>
                            </Col>
                        </Row>
                        <div className="divider divider-dotted">
                            <div className="divider-text"></div>
                        </div>
                    </>
                })
            }
            <Button.Ripple
                className="btn-icon"
                color="primary"
                onClick={() => props.setInputIncomes(
                    [
                        ...inputIncomes, {
                            id: uuidv4(),
                            occupation: '',
                            company: '',
                            cnpj: '',
                            role: '',
                            value: '',
                            start_date: '',
                            spouse: false
                        }
                    ])}
            >
                <Plus size={14} />
                <span className='align-middle ml-25'>Adicionar novo</span>
            </Button.Ripple>
        </div>
    )
}
