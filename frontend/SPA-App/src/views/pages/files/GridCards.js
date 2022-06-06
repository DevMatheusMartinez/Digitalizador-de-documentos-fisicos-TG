// ** React Imports
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText, CardFooter } from 'reactstrap'
import React, { useEffect, useState } from 'react'
// ** Images
import img1 from './scanner.jpg'
import img2 from './file.jpeg'
import axios from 'axios'
import api from '../../../services/api'
import { addTab } from '../../../store/modules/navbar/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom"

const GridCardsComponent = () => {
  const tabs = useSelector(state => state.navbar.tabs)
  const history = useHistory();
  const dispatch = useDispatch()
  const exist = (id) => {
    return tabs.some(function (el) {
      return el.id === id
    })
  }

  const openFormScannerView = () => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('digitalize-scanner')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'digitalize-scanner',
              name: 'Digitalizar via Scanner',
              active: true,
              navLink: '/digitalizar-arquivo-scanner',
              state: { id: 'digitalize-scanner' }
            }
          ]
        ))
        history.push(
          {
            pathname: '/digitalizar-arquivo-scanner',
            state: { id: 'digitalize-scanner' }
          }
        )
        return
      }

      if (tab.id === 'digitalize-scanner') {
        tab.active = true
        history.push({
          pathname: '/digitalizar-arquivo-scanner',
          state: { id: 'digitalize-scanner' }
        })
      }

    })
  }

  
  const openFormUploadView = () => {
    tabs.map(tab => {
      tab.active = false

      if (!exist('digitalize-upload')) {
        dispatch(addTab(
          [
            ...tabs,
            {
              id: 'digitalize-upload',
              name: 'Digitalizar via Upload',
              active: true,
              navLink: '/digitalizar-arquivo-upload',
              state: { id: 'digitalize-upload' }
            }
          ]
        ))
        history.push(
          {
            pathname: '/digitalizar-arquivo-upload',
            state: { id: 'digitalize-upload' }
          }
        )
        return
      }

      if (tab.id === 'digitalize-upload') {
        tab.active = true
        history.push({
          pathname: '/digitalizar-arquivo-upload',
          state: { id: 'digitalize-upload' }
        })
      }

    })
  }

  return (
    <Row className='match-height mb-2'>
      <Col>
        <Card>
          <CardImg top src={img1} alt='card1' onClick={() => {
           openFormScannerView()
          }}/>
          <CardBody>
            <CardTitle tag='h4'>Scanner</CardTitle>
            <CardText>
              Digitalize seus arquivos físicos diretamente pelo scanner.
            </CardText>
          </CardBody>
          <CardFooter>
            <small className='text-muted'>Rápido e fácil</small>
          </CardFooter>
        </Card>
      </Col>
      <Col>
        <Card>
          <CardImg top src={img2} alt='card2' onClick={() => {
            openFormUploadView()
          }} />
          <CardBody>
            <CardTitle tag='h4'>Upload</CardTitle>
            <CardText>Digitalize suas imagens salvas no seu computador</CardText>
          </CardBody>
          <CardFooter>
            <small className='text-muted'>Rápido e fácil</small>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  )
}

export default GridCardsComponent
