import { Button } from "reactstrap"
import React from "react"
import Row from "reactstrap/es/Row"
import Col from "reactstrap/es/Col"
import { banksList, accountTypeList } from "../../../support/constants"
import { maskBirthday } from "../../../support/masks"
import { v4 as uuidv4 } from 'uuid'
import { Plus, X } from "react-feather"
import { InputForm, SelectForm } from "./componentsForm"


export const BankForm = props => {

  const errors = props.errors
  const inputBanks = props.inputBanks

  return (
    <div>
      {inputBanks.map((inputBank, index) => {
        return <>
          <Row>
            <Col md="auto">
              <SelectForm
                errors={errors}
                ch="34ch"
                listFilter={banksList.filter(bank => bank.value === inputBank.bank_code) ?? ''}
                id="setbankaccount-bank"
                field={`banking_references.${index}.bank_code`}
                title="Banco"
                name="setbankaccount-bank"
                options={banksList}
                functionChange={bank => {
                  const newInputBankAccount = inputBanks.map(input => {
                    if (inputBank.id === input.id) {
                      input["bank_code"] = bank.value
                      input['bank_name'] = bank.label
                    }
                    return input
                  })
                  props.setInputBanks(newInputBankAccount)
                }}
              />
            </Col>
            <Col md="auto">
              <InputForm
                errors={errors}
                ch="20ch"
                field={`banking_references.${index}.agency`}
                id="setbankaccount-agency"
                placeholder="Agência"
                value={inputBank.agency ?? ""}
                className="form-control"
                type="text"
                title="Agência"
                name="setbankaccount-agency"
                functionChange={bank => {
                  const newInputBankAgendcy = inputBanks.map(input => {
                    if (inputBank.id === input.id) {
                      input["agency"] = bank.target.value
                    }
                    return input
                  })
                  props.setInputBanks(newInputBankAgendcy)
                }}
              />
            </Col>
            <Col md="auto">
              <InputForm
                errors={errors}
                ch="20ch"
                field={`banking_references.${index}.account`}
                id="setbankaccount-account"
                placeholder="Conta"
                value={inputBank.account ?? ""}
                className="form-control"
                type="text"
                title="Conta"
                name="setbankaccount-account"
                functionChange={bank => {
                  const newInputBankAccount = inputBanks.map(input => {
                    if (inputBank.id === input.id) {
                      input["account"] = bank.target.value
                    }
                    return input
                  })
                  props.setInputBanks(newInputBankAccount)
                }}
              />
            </Col>
            <Col md="auto">
              <InputForm
                errors={errors}
                ch="10ch"
                field={`banking_references.${index}.opening_date`}
                length={10}
                id="setbankaccount-oppeningDate"
                placeholder="Data de Abertura"
                value={inputBank.opening_date ?? ''}
                className="form-control"
                type="text"
                title="Data de Abertura"
                name="setbankaccount-oppeningDate"
                functionChange={bank => {
                  const newInputBankOppeningDate = inputBanks.map(input => {
                    if (inputBank.id === input.id) {
                      input["opening_date"] = maskBirthday(bank.target.value)
                    }
                    return input
                  })
                  props.setInputBanks(newInputBankOppeningDate)
                }}
              />
            </Col>
            <Col md="auto">
              <SelectForm
                ch="14ch"
                errors={errors}
                listFilter={accountTypeList.filter(type => type.value === inputBank.account_type) ?? ''}
                id="setbankaccount-accountType"
                field={`banking_references.${index}.account_type`}
                title="Tipo de Conta"
                name="setbankaccount-accountType"
                options={accountTypeList}
                functionChange={bank => {
                  const newInputBankType = inputBanks.map(input => {
                    if (inputBank.id === input.id) {
                      input["account_type"] = bank.value
                    }
                    return input
                  })
                  props.setInputBanks(newInputBankType)
                }}
              />
            </Col>
            <Col md="auto" className="mt-2">
              <Button.Ripple
                className="ext-nowrap px-1"
                outline
                size='sm'
                color="danger"
                onClick={
                  () => {
                    const values = [...inputBanks]

                    values.splice(values.findIndex(value => value.id === inputBank.id), 1)
                    props.setInputBanks(values)
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
        onClick={() => props.setInputBanks(
          [
            ...inputBanks, {
              id: uuidv4(),
              bank_code: '',
              bank_name: '',
              account_type: '',
              opening_date: '',
              agency: '',
              account: ''
            }
          ])}
      >
        <Plus size={14} />
        <span className='align-middle ml-25'>Adicionar novo</span>
      </Button.Ripple>
    </div>
  )
}