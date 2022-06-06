import { Alert, FormFeedback } from "reactstrap"
import React from "react"

export const AlertError = props => {
    const errors = props.errors
    const field = props.field
    const select = props.select
    if (errors !== undefined) {
        if (select) {
            return <span
                style={{ fontSize: 'smaller', color: '#ea5455' }}>
                {errors[field] && errors[field].map((error, index) => {
                    return <p>Obrigátorio</p>
                })}</span>
        }
        return (
            <FormFeedback id="alertError">
                {errors[field] && errors[field].map((error, index) => { return <p>{error}</p> })}
            </FormFeedback>
        )
    }
    return (
        <div></div>
    )
}

export const AlertErrorRedFull = props => {
    const errors = props.errors
    const field = props.field
    if (errors !== undefined) {
        return (
            <Alert isOpen={errors[field] !== undefined} color="danger" id="alertError">
                {errors[field] && errors[field].map((error, index) => <p key={`name-error-${index}`}>- {error}</p>)}
            </Alert>
        )
    }
    return (
        <div></div>
    )
}

export const AlertErrorBreakLine = props => {
    const errors = props.errors
    const field = props.field
    if (errors !== undefined) {
        return (
            <Alert isOpen={errors[field] !== undefined} color="danger" id="alertError">
                {errors[field] && errors[field].map((error, index) => {
                    if (error.length > 200) {
                        const part = error.split('/')
                        return <p key={`name-error-${index}`}>- {part[0]}: <br /> {part[1]} <br /> {part[2]} <br /> {part[3]} <br /> {part[4]} <br /> {part[5]}</p>
                    }
                    return <p key={`name-error-${index}`}>- {error}</p>
                })}
            </Alert>
        )
    }
    return (
        <div></div>
    )
}