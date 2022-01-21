import React, { useState } from 'react'
import { Dropdown, Form } from 'react-bootstrap'
import { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'

const PriceRange = ({ priceRange, setPriceRange }) => {
  const handlePriceRange = (e) => {
    setPriceRange(e)
  }
  return (
    <Dropdown autoClose='outside'>
      <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
        Preis
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <div className='p-3 text-center'>
          <Range
            allowCross={false}
            style={{ minWidth: '15rem' }}
            min={0}
            max={500}
            defaultValue={priceRange}
            onChange={handlePriceRange}
          />
          <div className='mt-2'>
            <b>{`${priceRange[0]}€ - ${priceRange[1]}€`}</b>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default PriceRange

// Necessary Filter Types: Range, Boolean
