import { X } from "react-feather"
import Col from "reactstrap/es/Col"
import { Button, FormGroup } from "reactstrap"
import { FaCheck } from "react-icons/fa"
import Row from "reactstrap/es/Row"

import React from "react"

export const GroupButtons = props => {
    return (
        <Row>
            <Col className='d-flex justify-content-end'>
                <FormGroup>
                    <Button.Ripple outline color="danger" onClick={props.functionCancel}>
                        <X size={14} /> Cancelar
                    </Button.Ripple>
                    <Button.Ripple type="button" outline className="ml-1" color="success" onClick={props.functionSave}>
                        <FaCheck size={14} /> {props.uuid ? " Salvar Alterações" : props.titulo}
                    </Button.Ripple>
                </FormGroup>
            </Col>
        </Row>
    )
}