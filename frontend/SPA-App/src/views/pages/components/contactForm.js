import Row from "reactstrap/es/Row"
import React from "react"
import { contactTypes } from "../../../support/constants"
import Col from "reactstrap/es/Col"
import { Button } from "reactstrap"
import { applyMaskToPhone } from "../../../support/masks"
import { Plus, X } from "react-feather"
import { v4 as uuidv4 } from 'uuid'
import { InputForm, SelectForm } from "./componentsForm"

export const ContactForm = props => {
  const errors = props.errors
  const inputContacts = props.inputContacts
  return (
    <div>
      {inputContacts.map((inputContact, index) => {
        return <Row key={index}>
          <SelectForm errors={errors} id={`id-type-${index}`} classNameFormGroup="ml-1"
            listFilter={contactTypes.filter(type => type.value === inputContact.type) ?? ''}
            field={`contacts.${index}.type`} title="Tipo de Telefone" name="contactType" options={contactTypes}
            placeholder="Tipo"
            functionChange={type => {
              const newImputType = inputContacts.map(input => {
                if (inputContact.id === input.id) {
                  input["type"] = type.value
                }
                return input
              })
              props.setInputContacts(newImputType)
            }}
          />
          <InputForm errors={errors} ch="16ch" field={`contacts.${index}.contact`}
            id={`id-number-${index}`} placeholder="Número"
            classNameFormGroup="ml-1"
            value={inputContact.contact ?? ''} className="form-control" type="text" title="Número" name="contactNumber"
            functionChange={contact => {
              const newInputContact = inputContacts.map(input => {
                if (inputContact.id === input.id) {
                  input["contact"] = applyMaskToPhone(contact.target.value)
                }
                return input
              })
              props.setInputContacts(newInputContact)
            }} />
          <Col lg="3" className="mt-2">
            <Button.Ripple color='danger' className='text-nowrap px-1' outline size='sm'
              onClick={() => {
                const values = [...inputContacts]

                values.splice(values.findIndex(value => value.id === inputContact.id), 1)
                props.setInputContacts(values)
              }
              }>
              <X size={14} className='mr-50' />
              <span>Excluir</span>
            </Button.Ripple>
          </Col>
          <Col sm={12}>
            <hr />
          </Col>
        </Row>
      })
      }
      <Button.Ripple className='btn-icon' color='primary'
        onClick={() => props.setInputContacts([...inputContacts, { id: uuidv4(), type: '', contact: '' }])}>
        <Plus size={14} />
        <span className='align-middle ml-25'>Adicionar novo</span>
      </Button.Ripple>
    </div>
  )
}