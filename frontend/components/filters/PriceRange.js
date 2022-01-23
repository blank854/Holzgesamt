import React, { useState } from 'react'
import { Col, Dropdown, Form, Row } from 'react-bootstrap'
import { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'

const PriceRange = ({ priceRange, setPriceRange }) => {
  const handlePriceRange = (e) => {
    setPriceRange(e)
  }
  return (
    <Row>
      <Col>
        <Form.Group className='mb-3'>
          <Form.Label>Mindestpreis</Form.Label>
          <Form.Control type='number' placeholder='0,00€' name='minPrice' />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group className='mb-3'>
          <Form.Label>Maximalpreis</Form.Label>
          <Form.Control type='number' placeholder='500,00€' name='maxPrice' />
        </Form.Group>
      </Col>
    </Row>
  )
}

export default PriceRange

// Necessary Filter Types: Range, Boolean
