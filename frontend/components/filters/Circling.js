import React, { useState } from 'react'
import Slider from 'rc-slider'
import { Button, Col, Dropdown, Form, Row } from 'react-bootstrap'

const Circling = ({ circling, setCircling, setLocation }) => {
  const handleCircling = (e) => {
    setCircling(e)
  }

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let tmpLocation = []
        tmpLocation.push(position.coords.latitude)
        tmpLocation.push(position.coords.longitude)
        setLocation(tmpLocation)
      })
    }
  }
  return (
    <>
      <Form.Group className='mb-3' controlId='zip'>
        <Form.Label>Postleitzahl</Form.Label>
        <Form.Control type='text' placeholder='12345' />
      </Form.Group>
      <Form.Group>
        <Form.Label>maximale Entfernung</Form.Label>
        <Row className='d-flex align-items-center'>
          <Col xs={8}>
            <Slider
              allowCross={false}
              className='me-3'
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
          </Col>
          <Col xs={4}>
            <Form.Control
              type='text'
              placeholder='max. Entfernung'
              value={`${circling}km`}
              disabled
              name='circling'
            />
          </Col>
        </Row>
      </Form.Group>
      {/* <Col>
          <Form.Group className='mb-3' controlId='locate'>
            <Button
              variant='secondary'
              className='w-100'
              onClick={handleLocate}
            >
              Orte mich
            </Button>
          </Form.Group>
        </Col> */}
    </>
  )
}

export default Circling
