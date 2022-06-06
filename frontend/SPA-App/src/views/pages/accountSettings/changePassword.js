import axios from "axios"
import React, { useState, useEffect } from "react"
import {
  Button,
  Form,
  Row,
  Col,
  Input,
  Label
} from "reactstrap"

const ChangePassword = () => {
  useEffect(() => {
    try {
      axios.get('http://127.0.0.1:8080/api/v1/connections-mysql', {
        headers: {
          Authorization: 'Token c5ba9abb243a2aa4ec8ea4678390692748fd9ec1'
        }
      }).then(response => {
        console.log('opa')
        setDatabase(response.data[0])
      })
    } catch(err){
      console.log(err)
    }
  })

  const [database, setDatabase] = useState([]);

  const updateDatabase = (data) => {
    axios.put('http://127.0.0.1:8080/api/v1/connections-mysql', data, {
      Authorization: 'Token c5ba9abb243a2aa4ec8ea4678390692748fd9ec1'
    }).catch(response=>console.log(response))
  }
  
  return (
    <React.Fragment>
      <Form className="mt-2" onSubmit={e => e.preventDefault()}>
        <Row>
          <Col>
            <Label>Host</Label>
            <Input value={database.host} onChange={e => setDatabase({...database, host: e.target.value})}/>

            <Label>User</Label>
            <Input value={database.user} onChange={e => setDatabase({...database, user: e.target.value})} />

            <Label>Password</Label>
            <Input value={database.password} onChange={e => setDatabase({...database, password: e.target.value})} />

            <Label>Database</Label>
            <Input value={database.database} onChange={e => setDatabase({...database, database: e.target.value})}/>
          </Col>
          <Col sm="12" className="ml-1">
            <Button.Ripple onClick={() => {updateDatabase(database)}} type="button" color="primary">
              Alterar configuração
            </Button.Ripple>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  )
}
export default ChangePassword
