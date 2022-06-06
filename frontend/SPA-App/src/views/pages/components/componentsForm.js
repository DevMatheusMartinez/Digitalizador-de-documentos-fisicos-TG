import Col from "reactstrap/es/Col"
import Select from "react-select"
import { FormGroup, Label, Input } from "reactstrap"
import { AlertError } from "../components/alerts"
import { useDispatch } from "react-redux"
import { Check } from "react-feather"
import React from "react"
import { userCleanError } from "../../../store/modules/users/actions"
import CheckBox from "@src/"
import CheckBoxesVuexy from "./checkbox/CheckboxesVuexy"

export const InputForm = props => {
    const errors = props.errors
    const dispatch = useDispatch()
    const cleanError = field => {
        if (errors !== undefined) {
            if (errors[field] !== undefined) {
                delete errors[field]
                dispatch(userCleanError(errors))
            }
        }
    }

    return (
            <FormGroup className={props.classNameFormGroup}>
                <Label for={props.id}>{props.title}</Label>
                <Input
                    style={props.style}
                    value={props.value}
                    style={{ width: props.ch }}
                    placeholder={props.placeholder}
                    maxLength={props.length}
                    className={props.className}
                    component={props.component}
                    type={props.type}
                    name={props.name}
                    invalid={errors ? (errors[props.field] !== undefined) : false}
                    id={props.id}
                    onChange={props.functionChange}
                    onKeyDown={() => cleanError(props.field)}
                    onBlur={props.functionOnBlur}
                    disabled={props.disabled}
                />
                 <AlertError field={props.field} errors={props.errors} />
            </FormGroup>
    )
}

export const SelectForm = props => {
    const errors = props.errors
    const dispatch = useDispatch()
    const cleanError = field => {
        if (errors !== undefined) {
            if (errors[field] !== undefined) {
                delete errors[field]
                dispatch(userCleanError(errors))
            }
        }
    }
    return (
            <FormGroup className={props.classNameFormGroup} style={{ width: props.ch }}>
                <Label for={props.id}>{props.title}</Label>
                <Select
                    className="React"
                    classNamePrefix="Select"
                    value={props.listFilter}
                    name={props.name}
                    invalid={errors ? (errors[props.field] !== undefined) : false}
                    options={props.options}
                    id={props.id}
                    placeholder={props.placeholder}
                    onChange={props.functionChange}
                    onMenuOpen={() => cleanError(props.field)}
                />
                <AlertError select={true} field={props.field} errors={props.errors} />
            </FormGroup>
    )
}

export const CheckboxForm = props => {
    return (
        <Col lg={props.lg} md={props.md} sm={props.sm}>
            <FormGroup>
                <CheckBoxesVuexy
                    name={props.name}
                    className={props.className}
                    checked={props.checked}
                    id={props.id}
                    label={props.label}
                    color="primary"
                    icon={<Check className="vx-icon" size={16} />}
                    value={props.value}
                    defaultChecked={props.defaultChecked}
                    onChange={props.onChange}
                />
            </FormGroup>
        </Col>
    )
}

export const InputFormLittle = props => {
    const errors = props.errors
    const dispatch = useDispatch()
    const cleanError = field => {
        if (errors !== undefined) {
            if (errors[field] !== undefined) {
                delete errors[field]
                dispatch(userCleanError(errors))
            }
        }
    }
    return (
        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder={props.placeholder}
            invalid={errors ? (errors[props.name] !== undefined) : false}
            defaultValue='te'
            name={props.name}
            onChange={props.functionChange}
            onKeyDown={() => cleanError(props.name)}
          />
          <Label>{props.title}</Label>
          <AlertError field={props.name} errors={props.errors} />
        </FormGroup>
    )
}

