import React, { useState, useEffect } from 'react'
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
  ListGroup,
} from 'react-bootstrap'
import Slider from 'rc-slider'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useFilter } from '../contexts/FilterContext'
import {
  FELLING_STATE,
  LOCATION,
  PRICE_VALUE,
} from '../constants/filter_constants'

const FELLED_VALUES = ['Fällstatus', 'Bereits gefällt', 'Nicht gefällt', 'Egal']

const Landing = () => {
  const router = useRouter()
  const [circling, setCircling] = useState(150)
  const [felled, setFelled] = useState(0)

  const { addFilter, setSearch } = useFilter()

  const handleCircling = (e) => {
    setCircling(e)
  }

  const handleSetFelled = (e) => {
    setFelled(e)
  }

  const handleSearchUsage = (e) => {
    setSelectedUsage(e.target.value)
    console.log(usages)
    let tmpSearchUsage = usages.filter((item) => item.includes(e.target.value))
    setSearchUsage(tmpSearchUsage)
  }

  const handleClickUsage = (e) => {
    setSelectedUsage(e)
    setShowAutocomplete(false)
  }
  const handleOnBlur = (e) => {
    if (e.relatedTarget) {
      if (e.relatedTarget.parentElement.id !== 'ListGroupUsages') {
        setShowAutocomplete(false)
      }
    } else {
      setShowAutocomplete(false)
    }
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

    const filter = {
      filters: [],
      sorter: {
        'price.priceValue': '-1',
      },
      paging: {
        limit: 25,
        skip: 0,
      },
      usage: [],
    }

    if (formDataObj.usage) {
      filter.usage.push(formDataObj.usage)
    }
    console.log(filter)

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

    if (felled == 1 || felled == 2) {
      addFilter(FELLING_STATE, { felled: felled == 1 ? true : false })
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
                Der Passende Baum.
                <br />
                Für jedes Projekt.
              </b>
            </h2>

            <Form onSubmit={handleSubmit} autocomplete='off'>
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
                    <div>
                      <Form.Control
                        className=' w-100'
                        type='usage'
                        placeholder='Verwendungszweck'
                        name='usage'
                        onFocus={() => setShowAutocomplete(true)}
                        onBlur={handleOnBlur}
                        onChange={handleSearchUsage}
                        value={selectedUsage}
                      />
                      <ListGroup
                        className={`position-absolute w-100 ${
                          !showAutocomplete ? 'd-none' : ''
                        }`}
                        id='ListGroupUsages'
                        style={{ zIndex: '9999' }}
                      >
                        {searchUsage.map((item, index) => (
                          <ListGroup.Item
                            key={index}
                            onClick={() => handleClickUsage(item)}
                            tabIndex='-1'
                            className='pointer'
                          >
                            {item}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className='d-flex flex-row align-items-center mb-3'>
                    <i className='fas fa-tree pe-3'></i>
                    <Dropdown
                      onSelect={handleSetFelled}
                      className='w-100'
                      align='end'
                    >
                      <Dropdown.Toggle
                        variant='dark'
                        id='dropdown-felled'
                        className='w-100'
                      >
                        {FELLED_VALUES[felled]}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item eventKey={1}>
                          {FELLED_VALUES[1]}
                        </Dropdown.Item>
                        <Dropdown.Item eventKey={2}>
                          {FELLED_VALUES[2]}
                        </Dropdown.Item>
                        <Dropdown.Item eventKey={3}>
                          {FELLED_VALUES[3]}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
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
