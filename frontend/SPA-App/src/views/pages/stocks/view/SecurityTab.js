// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Table,
  Input,
  Button,
  CardBody,
  CardTitle,
  CardHeader
} from 'reactstrap'

// ** Third Party Components
import { FieldEditCopy, SelectEditCopy } from '../../components/fieldEditCopy'
import { useDispatch, useSelector } from 'react-redux'
import { addStockValidate, editStock, resetStockForm } from '../../../../store/modules/stocks/actions'
import { statusList } from '../../../../support/constants'
import { SweetAlertSuccess } from '../../components/sweetAlertMessage'

const SecurityTab = (props) => {

  const [stock, setStock] = useState(props.stock)

  const [adicionalStock, setAdicionalStock] = useState(stock.additional ?? [])

  const dispatch = useDispatch()

  const errorsStocks = useSelector(state => state.stocks.errors)
  const formSuccess = useSelector(state => state.stocks.formSuccess)

  useEffect(() => {
    if (formSuccess) {
      SweetAlertSuccess("Finalizado", "", "success", function () { })
      dispatch(resetStockForm())
    }
  }, [formSuccess])

  const activeValidateStock = () => {
    dispatch(addStockValidate(stock))
  }

  const typesArr = [
    {
      title: 'Airbag',
      checked: false
    },
    {
      title: 'Alarme',
      checked: false
    },
    {
      title: 'Ar condicionado',
      checked: false
    },
    {
      title: 'Ar quente',
      checked: false
    },
    {
      title: 'Banco com regulagem de altura',
      checked: false
    },
    {
      title: 'Bancos dianteiros com aquecimento',
      checked: false
    },
    {
      title: 'Bancos em couro',
      checked: false
    },
    {
      title: 'Capota marítima',
      checked: false
    },
    {
      title: 'CD e mp3 player',
      checked: false
    },
    {
      title: 'CD player',
      checked: false
    },
    {
      title: 'Computador de bordo',
      checked: false
    },
    {
      title: 'Controle automático de velocidade',
      checked: false
    },
    {
      title: 'Controle de tração',
      checked: false
    },
    {
      title: 'Desembaçador traseiro',
      checked: false
    },
    {
      title: 'Direção hidráulica',
      checked: false
    },
    {
      title: 'Disqueteira',
      checked: false
    },
    {
      title: 'DVD player',
      checked: false
    },
    {
      title: 'Encosto de cabeça traseiro',
      checked: false
    },
    {
      title: 'Farol de xenônio',
      checked: false
    },
    {
      title: 'Freio abs',
      checked: false
    },
    {
      title: 'GPS',
      checked: false
    },
    {
      title: 'Limpador traseiro',
      checked: false
    },
    {
      title: 'Protetor de caçamba',
      checked: false
    },
    {
      title: 'Rádio',
      checked: false
    },
    {
      title: 'Rádio e toca fitas',
      checked: false
    },
    {
      title: 'Retrovisor fotocrômico',
      checked: false
    },
    {
      title: 'Retrovisores elétricos',
      checked: false
    },
    {
      title: 'Rodas de liga leve',
      checked: false
    },
    {
      title: 'Sensor de chuva',
      checked: false
    },
    {
      title: 'Sensor de estacionamento',
      checked: false
    },
    {
      title: 'Teto solar',
      checked: false
    },
    {
      title: 'Tração 4x4',
      checked: false
    },
    {
      title: 'Travas elétricas',
      checked: false
    },
    {
      title: 'Vidros elétricos',
      checked: false
    },
    {
      title: 'Volante com regulagem de altura',
      checked: false
    }
  ]


  const saveStock = () => {
    const stockToSave = {
      ...stock,
      additional: adicionalStock
    }

    dispatch(editStock(stockToSave))
  }

  const publishSite = () => {
    const stockToSave = {
      ...stock,
      additional: adicionalStock,
      site: true
    }

    dispatch(editStock(stockToSave))
  }

  const removeSite = () => {
    const stockToSave = {
      ...stock,
      additional: adicionalStock,
      site: false
    }

    dispatch(editStock(stockToSave))
  }

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Informações do site</CardTitle>
        </CardHeader>
        <CardBody>
          <Form>
            <Row>
              <Col className='mb-2' md={6}>
                <FieldEditCopy
                  title="Responsavel"
                  field="responsible"
                  action={activeValidateStock}
                  errors={errorsStocks}
                  value={stock.responsible}
                  valueInput={stock.responsible}
                  setObj={e => {
                    setStock({
                      ...stock, responsible: e.target.value
                    })
                  }}
                  width="25ch"
                />

              </Col>
              <Col className='mb-2' md={6}>
                <FieldEditCopy
                  title="Valor de divulgação"
                  field="disclosure_value"
                  length={10}
                  action={activeValidateStock}
                  errors={errorsStocks}
                  value={stock.disclosure_value}
                  valueInput={stock.disclosure_value}
                  setObj={e => {
                    setStock({
                      ...stock, disclosure_value: e.target.value
                    })
                  }}
                  width="9ch"
                />
              </Col>
              <Col className='mb-2' md={6}>
                <SelectEditCopy
                  title="Status"
                  field="status"
                  list={statusList}
                  obj={stock}
                  action={activeValidateStock}
                  errors={errorsStocks}
                  value={stock.status}
                  valueInput={stock.status}
                  setObj={e => { setStock({ ...stock, status: e.target.value }) }}
                  width="15ch"
                /></Col>
            </Row>

            <CardTitle tag='h4'>Adicionais do veículo</CardTitle>
            <Row>
              <Table className='text-nowrap text-center border-bottom' responsive>
                <thead>
                  <tr>
                    <th className='text-start'>Nome</th>
                    <th>Adicionar</th>
                  </tr>
                </thead>
                <tbody>
                  {typesArr.map((type, index) => {
                    return (
                      <tr key={index}>
                        <td className='text-start'>{type.title}</td>
                        <td>
                          <div className='d-flex form-check justify-content-center'>
                            <Input type='checkbox' defaultChecked={stock.additional !== null ? stock.additional.indexOf(type.title) > -1 : false} onChange={e => {
                              if (e.target.checked) {
                                setAdicionalStock({ ...adicionalStock, [index]: type.title })
                                return
                              }
                              setAdicionalStock({ ...adicionalStock, [index]: undefined })
                            }
                            }
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Row>
            <CardBody>
              <Button className='me-1 ml-1' color='primary' onClick={(e) => { e.preventDefault(); saveStock() }}>
                Salvar
              </Button>
              <Button className='me-1 ml-1' color='primary' onClick={(e) => { e.preventDefault(); publishSite() }}>
                Publicar no site
              </Button>
              <Button className='me-1 ml-1' color='danger' onClick={(e) => { e.preventDefault(); removeSite() }}>
                Remover do site
              </Button>
            </CardBody>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default SecurityTab
