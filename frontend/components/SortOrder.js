import React from 'react'
import { Dropdown } from 'react-bootstrap'
import {
  HIGHEST_RELEVANCE,
  PRICE_VALUE,
  TITLE,
} from '../constants/filter_constants'
import { useFilter } from '../contexts/FilterContext'

const SortOrder = ({ order, setOrder }) => {
  const { setSortOrder, getSortOrder } = useFilter()
  const handleSetOrder = (field, order, description) => {
    setOrder({
      field: field,
      order: order,
      description: description,
    })

    setSortOrder(field, order)
    console.log(getSortOrder)
  }
  return (
    <Dropdown align='end'>
      <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
        {order.description ? order.description : 'Sortieren'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() =>
            handleSetOrder(HIGHEST_RELEVANCE, '1', 'Preis aufsteigend')
          }
        >
          höchste Relevanz
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => handleSetOrder(PRICE_VALUE, '1', 'Preis aufsteigend')}
        >
          Preis aufsteigend
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => handleSetOrder(PRICE_VALUE, '-1', 'Preis absteigend')}
        >
          Preis absteigend
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => handleSetOrder(TITLE, '1', 'Alphabetisch aufsteigend')}
        >
          Alphabetisch aufsteigend
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => handleSetOrder(TITLE, '-1', 'Alphabetisch absteigend')}
        >
          Alphabetisch absteigend
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default SortOrder
