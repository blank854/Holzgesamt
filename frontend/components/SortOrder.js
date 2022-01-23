import React from 'react'
import { Dropdown } from 'react-bootstrap'

const SortOrder = ({ order, setOrder }) => {
  const handleSetOrder = (field, order, description) => {
    setOrder({
      field: field,
      order: order,
      description: description,
    })
  }
  return (
    <Dropdown align='end'>
      <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
        {order.description ? order.description : 'Sortieren'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() =>
            handleSetOrder('price.priceValue', '1', 'Preis aufsteigend')
          }
        >
          Preis aufsteigend
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() =>
            handleSetOrder('price.priceValue', '-1', 'Preis absteigend')
          }
        >
          Preis absteigend
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() =>
            handleSetOrder('search', '1', 'Alphabetisch aufsteigend')
          }
        >
          Alphabetisch aufsteigend
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() =>
            handleSetOrder('search', '-1', 'Alphabetisch absteigend')
          }
        >
          Alphabetisch absteigend
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default SortOrder
