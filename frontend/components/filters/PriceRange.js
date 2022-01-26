import React, { useState, useEffect } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import 'rc-slider/assets/index.css'
import { useFilter } from '../../contexts/FilterContext'
import { PRICE_VALUE } from '../../constants/filter_constants'

const PriceRange = () => {
  const { getFilter } = useFilter()
  const [minPrice, setMinPrice] = useState(
    getFilter(PRICE_VALUE) && getFilter(PRICE_VALUE).value.$gte
  )
  const [maxPrice, setMaxPrice] = useState(
    getFilter(PRICE_VALUE) && getFilter(PRICE_VALUE).value.$lte
  )

  return (
    <Row>
      <Col>
        <Form.Group className='mb-3'>
          <Form.Label>Mindestpreis</Form.Label>
          <Form.Control
            type='number'
            placeholder='0,00€'
            name='minPrice'
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group className='mb-3'>
          <Form.Label>Maximalpreis</Form.Label>
          <Form.Control
            type='number'
            placeholder='500,00€'
            name='maxPrice'
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </Form.Group>
      </Col>
    </Row>
  )
}

export default PriceRange

// Necessary Filter Types: Range, Boolean
