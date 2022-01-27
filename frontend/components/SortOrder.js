import React, { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import {
  HIGHEST_RELEVANCE,
  PRICE_VALUE,
  TITLE,
} from '../constants/filter_constants'
import { useFilter } from '../contexts/FilterContext'

const SortOrder = ({ updateList }) => {
  const [order, setOrder] = useState('höchste Relevanz')
  const { setSortOrder, getSortOrder } = useFilter()
  const handleSetOrder = (type, payload) => {
    setSortOrder(type, payload)
    setOrder(getSortOrder())
    updateList()
  }
  return (
    <Dropdown align='end'>
      <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
        {order}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleSetOrder(HIGHEST_RELEVANCE, 1)}>
          höchste Relevanz
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleSetOrder(PRICE_VALUE, 1)}>
          Preis aufsteigend
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleSetOrder(PRICE_VALUE, -1)}>
          Preis absteigend
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleSetOrder(TITLE, 1)}>
          Alphabetisch aufsteigend
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleSetOrder(TITLE, -1)}>
          Alphabetisch absteigend
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default SortOrder
