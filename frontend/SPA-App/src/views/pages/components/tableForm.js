import { Table, FormGroup } from "reactstrap"
import React from "react"
import { CheckboxForm } from "../components/componentsForm"
import { AlertErrorRedFull } from "../components/alerts"

export const TableForm = props => {
    return (
        <div>
        <Table borderless responsive>
            <thead>
                <tr>
                    <th>Permissões de Usuário</th>
                    <th className={"text-center"}>Leitura</th>
                    <th className={"text-center"}>Cadastro</th>
                    <th className={"text-center"}>Edição</th>
                    <th className={"text-center"}>Exclusão</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Permitir</td>
                    <td>
                        <CheckboxForm name="permissions" className="justify-content-center"
                        checked={props.checkedUserIndex} value={props.valueUserIndex} onChange={props.onChange}/>
                    </td>
                    <td>
                        <CheckboxForm name="permissions" className="justify-content-center" id="id-user-store"
                        checked={props.checkedUserStore} value={props.valueUserStore} onChange={props.onChange}/>
                    </td>
                    <td>
                        <CheckboxForm name="permissions" className="justify-content-center"
                        checked={props.checkedUserUpdate} value={props.valueUserUpdate} onChange={props.onChange}/>
                    </td>
                    <td>
                        <CheckboxForm name="permissions" className="justify-content-center"
                        checked={props.checkedUserDestroy} value={props.valueUserDestroy} onChange={props.onChange}/>
                    </td>
                </tr>
            </tbody>
            <FormGroup>
            <AlertErrorRedFull field={props.field} errors={props.errors} />
            </FormGroup>
        </Table>
        <Table borderless responsive>
            <thead>
                <tr>
                    <th>Permissões de arquivo</th>
                    <th className={"text-center"}>Scanner</th>
                    <th className={"text-center"}>Upload</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Permitir</td>
                    <td>
                        <CheckboxForm name="permissions" className="justify-content-center"
                        checked={props.checkedFileIndex} value={props.valueFileIndex} onChange={props.onChange}/>
                    </td>
                    <td>
                        <CheckboxForm name="permissions" className="justify-content-center" id="id-user-store"
                        checked={props.checkedFileStore} value={props.valueFileStore} onChange={props.onChange}/>
                    </td>
                </tr>
            </tbody>
            <FormGroup>
            <AlertErrorRedFull field={props.field} errors={props.errors} />
            </FormGroup>
        </Table>

        </div>
    )
}
