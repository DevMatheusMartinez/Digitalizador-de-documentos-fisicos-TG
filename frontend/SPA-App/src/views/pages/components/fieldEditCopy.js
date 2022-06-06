import { AlertErrorRedFull } from "./alerts"
import { Input, UncontrolledTooltip } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import React, { useState } from "react"
import { Copy, Edit } from "react-feather"
import CopyToClipboard from "react-copy-to-clipboard"

export const FieldEditCopy = props => {
    const [editInput, setEditInput] = useState(false)
    const notifyTopRight = (field) => toast.success(`${field} copiado com sucesso!`,
        {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        })

    const errors = props.errors
    const field = props.field
    return (<div className="d-flex user-info">
        <div className="font-weight-bold">
            {props.title}: 
        </div>
        <div>
            {editInput || (errors !== undefined ? errors[field] !== undefined : false) ? <>
                    <Input autoFocus
                        type="text"
                        style={{ width: props.width }}
                        value={props.value}
                        maxLength={props.length}
                        name={field}
                        onBlur={e => {
                            setEditInput(false)
                            return props.action()
                        }}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                setEditInput(false)
                                return props.action()
                            }
                        }}
                        onKeyUp={props.zipcode}
                        placeholder={props.title}
                        onChange={props.setObj}
                    />
                    <AlertErrorRedFull field={field} errors={errors} />
                </> : <>
                    <span id="fieldSpan"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setEditInput(true)}>
                        {props.value}
                    </span>
                    <UncontrolledTooltip placement='top' target='fieldSpan'>
                        Clique para editar!
                    </UncontrolledTooltip>
                    <CopyToClipboard text={props.value}
                        onCopy={() => notifyTopRight(`${props.title}: ${props.value}`)}
                    >
                        <Copy
                            className="cursor-pointer mr-1 ml-1"
                            size={15} />
                    </CopyToClipboard>
                    {props.value === "" || props.value === null ? <Edit
                        className="cursor-pointer mr-1"
                        size={15}
                        onClick={() => setEditInput(true)}
                    /> : <div></div>}
                </>
            }
        </div>
        <ToastContainer />
    </div>)
}

export const TextareaEditCopy = props => {
    const [editInput, setEditInput] = useState(false)
    const notifyTopRight = (field) => toast.success(`${field} copiado com sucesso!`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        })

    const errors = props.errors
    const field = props.field
    return (<div className="d-flex user-info">
        <div className="font-weight-bold">
            {props.title}:
        </div>
        <div>
            {editInput || (errors !== undefined ? errors[field] !== undefined : false) ? <>
                    <textarea autoFocus
                        type="text"
                        style={{ width: '750px', height: '300px' }}
                        value={props.value}
                        maxLength={props.length}
                        name={field}
                        onBlur={e => {
                            setEditInput(false)
                            return props.action()
                        }}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                setEditInput(false)
                                return props.action()
                            }
                        }}
                        onKeyUp={props.zipcode}
                        placeholder={props.title}
                        onChange={props.setObj}
                    ></textarea>
                    <AlertErrorRedFull field={field} errors={errors} />
                </> : <>
                    <span id="fieldSpan"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setEditInput(true)}>
                        {props.value}
                    </span>
                    <UncontrolledTooltip placement='top' target='fieldSpan'>
                        Clique para editar!
                    </UncontrolledTooltip>
                    <CopyToClipboard text={props.value}
                        onCopy={() => notifyTopRight(`${props.title}: ${props.value}`)}
                    >
                        <Copy
                            className="cursor-pointer mr-1 ml-1"
                            size={15} />
                    </CopyToClipboard>
                    {props.value === "" || props.value === null ? <Edit
                        className="cursor-pointer mr-1"
                        size={15}
                        onClick={() => setEditInput(true)}
                    /> : <div></div>}
                </>
            }
        </div>
        <ToastContainer />
    </div>)
}

export const SelectEditCopy = props => {
    const [editInput, setEditInput] = useState(false)
    const notifyTopRight = (field) => toast.success(`${field} copiado com sucesso!`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
        })

    const errors = props.errors
    const field = props.field
    return (<div className="d-flex user-info">
        <div className="font-weight-bold">
            {props.title}:
        </div>
        <div>
            {editInput || (errors !== undefined ? errors[field] !== undefined : false) ? <>
                    <Input autoFocus
                        type="select"
                        style={{ width: props.width }}
                        value={props.valueInput}
                        maxLength={props.length}
                        name={field}
                        onBlur={() => {
                            setEditInput(false)
                            return props.action()
                        }}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                setEditInput(false)
                                return props.action()
                            }
                        }}
                        placeholder={props.title}
                        onChange={props.setObj}
                    >
                        {props.list.map((option) => {
                            return <option value={option.value}>{option.label}</option>
                        })}
                    </Input>
                    <AlertErrorRedFull field={field} errors={errors} />
                </> : <>
                    <span id="fieldSpan"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setEditInput(true)}>
                        {props.value}
                    </span>
                    <UncontrolledTooltip placement='top' target='fieldSpan'>
                        Clique para editar!
                    </UncontrolledTooltip>
                    <CopyToClipboard text={props.value}
                        onCopy={() => notifyTopRight(`${props.title}: ${props.value} `)}
                    >
                        <Copy
                            className="cursor-pointer mr-1 ml-1"
                            size={15} />
                    </CopyToClipboard>
                    {props.value === "" ? <Edit
                        className="cursor-pointer mr-1"
                        size={15}
                        onClick={() => setEditInput(true)}
                    /> : <div></div>}
                </>
            }
        </div>
        <ToastContainer />
    </div>)
}