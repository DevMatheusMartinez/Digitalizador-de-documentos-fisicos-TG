import { InputForm, SelectForm } from "./componentsForm"
import Row from "reactstrap/es/Row"
import { AlertError } from "../components/alerts"
import { Spinner } from "reactstrap"
import Col from "reactstrap/es/Col"
import React from "react"
import { ufList } from "../../../support/constants"

export const AddressForm = props => {
    const address = props.address ?? []
    const errors = props.errors
    const loading = props.loading
    return (
        <div>
            <Row>
                <Col md="auto">
                    <InputForm
                        errors={errors}
                        ch='11ch'
                        field="cep"
                        id="data-zipcode"
                        placeholder="CEP"
                        value={address.zipcode ?? ''}
                        className="form-control"
                        type="text"
                        title="CEP"
                        name="cep"
                        functionChange={props.functionChangeZipcode}
                        functionOnBlur={props.onBlurZipcode}
                    />
                </Col>
                {loading ? <Col><Spinner className='d-block mt-2' color="primary" /> </Col> : <Col md="auto">
                    <InputForm
                        errors={errors}
                        ch='25ch'
                        field="address.address"
                        id="data-address"
                        placeholder="Logradouro"
                        className="form-control"
                        value={address.address ?? ''}
                        type="text"
                        title="Logradouro"
                        functionChange={props.functionChangeAddress}
                    />
                </Col>}
                <AlertError field={props.field} errors={props.errors} />
                {loading ? <Col><Spinner className='d-block mt-2' color="primary" /> </Col> : <Col md="auto">
                    <InputForm
                        errors={errors}
                        ch='6ch'
                        field="address.number"
                        id="data-number"
                        placeholder="Nº"
                        value={address.number ?? ''}
                        className="form-control"
                        type="text"
                        title="Nº"
                        functionChange={props.functionChangeNumber}
                    />
                </Col>
                }
                <Col md="auto">
                    <InputForm
                        ch='15ch'
                        field="complement"
                        id="data-complement"
                        placeholder="Complemento"
                        value={address.complement ?? ''}
                        className="form-control"
                        type="text"
                        title="Complemento"
                        functionChange={props.functionChangeComplement}
                    />
                </Col>
                {loading ? <Col><Spinner className='d-block mt-2' color="primary" /> </Col> : <Col md="auto">
                        <InputForm
                            ch='16ch'
                            errors={errors}
                            field="address.neighborhood"
                            id="data-neighborhood"
                            placeholder="Bairro"
                            value={address.neighborhood ?? ''}
                            className="form-control"
                            classNameFormGroup="mr-1"
                            type="text"
                            title="Bairro"
                            functionChange={props.functionChangeNeighborhood}
                        />
                    </Col>
                }
                {loading ? <Col><Spinner className='d-block mt-2' color="primary" /> </Col> : <Col md="auto">
                        <InputForm
                            errors={errors}
                            ch='21ch'
                            field="address.city"
                            id="data-city"
                            placeholder="Cidade"
                            value={address.city ?? ''}
                            className="form-control"
                            classNameFormGroup="mr-1"
                            type="text"
                            title="Cidade"
                            functionChange={props.functionChangeCity}
                        />
                    </Col>
                }
                <Col md="auto">
                    <SelectForm
                        errors={errors}
                        ch='9ch'
                        id="data-state"
                        field="address.uf"
                        listFilter={ufList.filter(e => e.value === address.uf) ?? ''}
                        title="UF"
                        name="uf"
                        placeholder="UF"
                        options={ufList}
                        functionChange={props.functionChangeUF}
                    />
                </Col>
            </Row>
            {
                props.activeExtraFields ? <Row>
                        <Col md="auto">
                            <InputForm
                                errors={errors}
                                field="address.type_residence"
                                id="data-type_residence"
                                placeholder="Tipo de Residência"
                                value={address.type_residence ?? ''}
                                type="text"
                                title="Tipo de Residência"
                                functionChange={props.functionChangeTypeResidence}
                            />
                        </Col>
                        <Col md="auto">
                            <InputForm
                                errors={errors}
                                length={10}
                                field="address.time_residence"
                                id="data-time_residence"
                                placeholder="Tempo de Residência"
                                value={address.time_residence ?? ''}
                                type="text"
                                title="Tempo de Residência"
                                functionChange={props.functionChangeTimeResidence}
                            />
                        </Col>
                    </Row> : <div></div>
            }
        </div>
    )
}