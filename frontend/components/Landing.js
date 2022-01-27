import React, { useState, useEffect } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import Slider from 'rc-slider'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useFilter } from '../contexts/FilterContext'
import { LOCATION, PRICE_VALUE } from '../constants/filter_constants'
import AutoComplete from './AutoComplete'

const Landing = () => {
  const router = useRouter()
  const [circling, setCircling] = useState(150)
  const [usages, setUsages] = useState([])
  const { addFilter, setSearch, addUsage } = useFilter()

  const handleCircling = (e) => {
    setCircling(e)
  }

  useEffect(() => {
    const config = {
      method: 'get',
      url: 'http://localhost:4000/statistics/usages',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    axios(config).then((response) => {
      setUsages(response.data.SendUsages)
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const formDataObj = Object.fromEntries(formData.entries())

    if (formDataObj.usages) {
      addUsage(formDataObj.usages)
    }

    if (formDataObj.search) {
      setSearch(formDataObj.search)
    }

    if (formDataObj.zip) {
      addFilter(LOCATION, {
        maxDistance: circling * 1000,
        zip: formDataObj.zip,
      })
    }

    if (formDataObj.price) {
      addFilter(PRICE_VALUE, { maxPrice: formDataObj.price })
    }

    if (formDataObj.usage) {
      setUsage(formDataObj.usage)
    }
    router.push(`/search`)
  }
  return (
    <div className='Landing d-flex flex-row align-items-center'>
      <Container>
        <Row className='m-1'>
          <Col lg={5} md={8} className='p-4 bg-light text-primary rounded'>
            <h2 className='mb-4'>
              <b>
                Der passende Baum.
                <br />
                Für jedes Projekt.
              </b>
            </h2>

            <Form onSubmit={handleSubmit} autoComplete='off'>
              <div className='d-flex flex-row align-items-center mb-3'>
                <i className='fas fa-search pe-3'></i>
                <Form.Control
                  type='text'
                  placeholder='z.B. nach Blaupappel suchen'
                  name='search'
                />
              </div>
              <Row>
                <Col md={6} className='d-flex flex-row align-items-center mb-3'>
                  <i className='fas fa-location-arrow  pe-3'></i>
                  <Form.Control
                    type='text'
                    placeholder='Postleitzahl'
                    name='zip'
                  />
                </Col>
                <Col md={6} className='d-flex flex-row align-items-center mb-3'>
                  <Slider
                    allowCross={false}
                    className='w-100 me-3'
                    min={0}
                    max={500}
                    step={50}
                    value={circling}
                    defaultValue={50}
                    onChange={handleCircling}
                    railStyle={{ backgroundColor: '#e2e8f0' }}
                    handleStyle={{
                      borderColor: '#334155',
                      backgroundColor: '#334155',
                    }}
                    trackStyle={{ backgroundColor: '#334155' }}
                  />
                  <Form.Control
                    type='text'
                    placeholder='max. Entfernung'
                    value={`${circling}km`}
                    disabled
                    name='circling'
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className='d-flex flex-row align-items-center mb-3'>
                    <i className='fas fa-euro-sign pe-3'></i>
                    <Form.Control
                      type='text'
                      placeholder='z.B. bis 500€'
                      name='price'
                    />
                  </div>
                </Col>

                <Col md={6}>
                  <div className='d-flex flex-row align-items-center mb-3 position-relative'>
                    <i className='fas fa-space-shuttle pe-3'></i>
                    <AutoComplete
                      list={usages}
                      name='usages'
                      placeholder='Verwendungszweck'
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <div className='d-flex justify-content-end'>
                  <Button variant='primary' className='w-50' type='submit'>
                    Suchen
                  </Button>
                </div>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Landing
