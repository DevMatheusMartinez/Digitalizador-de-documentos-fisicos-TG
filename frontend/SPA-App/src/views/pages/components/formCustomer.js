import React from "react"
import Row from "reactstrap/es/Row"
import { maritalStatusList, ufList } from "../../../support/constants"
import Col from "reactstrap/lib/Col"
import { InputForm, SelectForm } from "./componentsForm"

export const FormCustomer = props => {
  const errors = props.errors
  return (
    <>
      <Row className="justify-content-md-left">
        <Col md="auto">
          <InputForm
            errors={errors}
            ch="25ch"
            field={props.fieldName}
            id={props.idName}
            placeholder="Nome"
            value={props.valueName}
            className="form-control"
            classNameFormGroup="ml-1"
            type="text"
            title="Nome *"
            name={props.nameName}
            functionChange={props.functionName}
          />
        </Col>
        <Col md="auto">
          <InputForm
            errors={errors}
            ch="10ch"
            length={10}
            field={props.fieldBirthday}
            id={props.idBirthday}
            placeholder="31/12/2002"
            value={props.valueBirthday}
            classNameFormGroup="ml-1"
            className="form-control"
            type="text"
            title="Nascimento *"
            name="birthday"
            functionChange={props.functionBirthday}
          />
        </Col>
        <Col md="auto">
          <InputForm
            errors={errors}
            ch='17ch'
            length={18}
            field={props.fieldCpfCnpj}
            id={props.idCpfCnpj}
            placeholder="CPF/CNPJ"
            value={props.valueCpfCnpj}
            className="form-control"
            classNameFormGroup="ml-1"
            type="text"
            title="CPF/CNPJ *"
            name={props.nameCpfCnpj}
            functionChange={props.functionCpfCnpj}
          />
        </Col>
      </Row>
      <Row className="justify-content-md-left">
        <Col md="auto">
          <InputForm
            errors={errors}
            field={props.fieldRg}
            id={props.idRG}
            placeholder="RG"
            value={props.valueRg}
            className="form-control"
            classNameFormGroup="ml-1"
            type="text"
            title="RG *"
            functionChange={props.functionRG}
          />
        </Col>
        <Col md="auto">
          <InputForm
            errors={errors}
            ch="10ch"
            length={10}
            field={props.fieldRgDate}
            id={props.idRgDate}
            placeholder="31/12/2002"
            value={props.valueRgDate}
            className="form-control"
            classNameFormGroup="ml-1"
            type="text"
            title="Emissão"
            name={props.nameRgDate}
            functionChange={props.functionRgDate}
          />
        </Col>
        <Col md="auto">
          <InputForm
            errors={errors}
            ch="6ch"
            field={props.fieldOrg}
            id={props.idOrg}
            placeholder="SPP"
            value={props.valueOrg}
            className="form-control"
            classNameFormGroup="ml-1"
            type="text"
            title="Orgão"
            functionChange={props.functionOrg}
          />
        </Col>
        <Col md="auto">
          <SelectForm
            errors={errors}
            ch='9ch'
            id={props.idRgUf}
            field={props.fildeRgUf}
            listFilter={props.filterUfRg}
            title="UF"
            classNameFormGroup="ml-1"
            name={props.nameUfRg}
            options={ufList}
            functionChange={props.functionUfRg}
          />
        </Col>
      </Row>
      <Row className="justify-content-md-left">
        <Col md="auto">
          <InputForm
            errors={errors}
            field={props.fieldEmail}
            id={props.idEmail}
            placeholder="Email"
            value={props.valueEmail}
            className="form-control"
            classNameFormGroup="ml-1"
            type="text"
            title="Email"
            name={props.nameEmail}
            functionChange={props.functionEmail}
          />
        </Col>
        <Col md="auto">
          <InputForm
            errors={errors}
            ch="15ch"
            field={props.fieldContact}
            id={props.idContact}
            placeholder="Contato"
            value={props.valueContact}
            className="form-control"
            classNameFormGroup="ml-1"
            type="text"
            title="Contato *"
            name={props.nameContact}
            functionChange={props.functionContact}
          />
        </Col>
        <Col md="auto">
          <InputForm
            errors={errors}
            ch="15ch"
            field={props.fieldCommercialPhone}
            id={props.idCommercialPhone}
            placeholder="Comercial"
            value={props.valueCommercialPhone}
            className="form-control"
            classNameFormGroup="ml-1"
            type="text"
            title="Telefone Comercial *"
            name={props.nameCommercialPhone}
            functionChange={props.functionCommercialPhone}
          />
        </Col>
        <Col md="auto">
          <InputForm
            errors={errors}
            ch="15ch"
            field={props.fieldHomePhone}
            id={props.idHomePhone}
            placeholder="Contato"
            value={props.valueHomePhone}
            className="form-control"
            classNameFormGroup="ml-1"
            type="text"
            title="Telefone Residencial *"
            name={props.nameHomePhone}
            functionChange={props.functionHomePhone}
          />
        </Col>
      </Row>
      <Row className="justify-content-md-left">
        <Col md="auto">
          <InputForm
            errors={errors}
            field={props.fieldNationality}
            id={props.idNationality}
            placeholder="Nacionalidade"
            value={props.valueNationality}
            className="form-control"
            type="text"
            title="Nacionalidade"
            classNameFormGroup="ml-1"
            name={props.nameNationality}
            functionChange={props.functionNationality}
          />
        </Col>
        <Col md="auto">
          <InputForm
            errors={errors}
            field={props.fieldNaturalness}
            id={props.idNaturalness}
            placeholder="Naturalidade"
            value={props.valueNaturalness}
            className="form-control"
            type="text"
            title="Naturalidade"
            classNameFormGroup="ml-1"
            name={props.nameNaturalness}
            functionChange={props.functionNaturalness}
          />
        </Col>
        <Col md="auto">
          <SelectForm
            errors={errors}
            ch='9ch'
            id={props.idNaturalnessUf}
            field={props.fieldNaturalnessUf}
            listFilter={props.filterNaturalnessUf}
            title="UF"
            classNameFormGroup="ml-1"
            name={props.nameNaturalnessUf}
            options={ufList}
            functionChange={props.functionNaturalnessUf}
          />
        </Col>
      </Row>
      <Row>
        <Col md="auto">
          <InputForm
            errors={errors}
            field={props.fieldMother}
            id={props.idMother}
            placeholder="Nome da Mãe"
            value={props.valueMother}
            classNameFormGroup="ml-1"
            className="form-control"
            type="text"
            title="Nome da Mãe"
            name={props.nameMother}
            functionChange={props.functionMother}
          />
        </Col>
        <Col md="auto">
          <InputForm
            errors={errors}
            field={props.fieldFather}
            id={props.idFather}
            placeholder="Nome da Pai"
            value={props.valueFather}
            classNameFormGroup="ml-1"
            className="form-control"
            type="text"
            title="Nome da Pai"
            name={props.nameFather}
            functionChange={props.functionFather}
          />
        </Col>
        <Col md="auto">
          {
            props.idMaritalStatus ? <SelectForm
              errors={errors}
              ch='16ch'
              id={props.idMaritalStatus}
              field={props.fieldMaritalStatus}
              listFilter={props.filterMaritalStatus}
              title="Estado Cívil"
              classNameFormGroup="ml-1"
              name={props.nameMaritalStatus}
              options={maritalStatusList}
              functionChange={props.functionMaritalStatus}
            /> : <></>
          }
        </Col>
      </Row>
    </>
  )
}
