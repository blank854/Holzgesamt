import React, { useState, useEffect } from 'react'
import PriceRange from './filters/PriceRange'
import filterItemList from '../lib/filterItems'
import Felled from './filters/Felled'
import Circling from './filters/Circling'
import Search from './filters/Search'
import ApplyFilter from './filters/ApplyFilter'
import Usage from './filters/Usage'
import SortOrder from './SortOrder'
import { Button, Form, Offcanvas } from 'react-bootstrap'
import axios from 'axios'
import { useFilter } from '../contexts/FilterContext'
import {
  FELLING_STATE,
  LOCATION,
  PRICE_VALUE,
} from '../constants/filter_constants'

const Filter = ({ setSearchResult, changed, setChanged }) => {
  const [order, setOrder] = useState({})
  const [showFilter, setShowFilter] = useState(false)

  const { addFilter, getAllFilters, addUsage } = useFilter()

  const handleFilterSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const formDataObj = Object.fromEntries(formData.entries())

    if (formDataObj.zip) {
      addFilter(LOCATION, {
        maxDistance: parseInt(formDataObj.circling) * 1000,
        zip: formDataObj.zip,
      })
    }

    let price = {}

    if (formDataObj.minPrice) {
      price.minPrice = formDataObj.minPrice
    }

    if (formDataObj.maxPrice) {
      price.maxPrice = formDataObj.maxPrice
    }

    if (formDataObj.maxPrice || formDataObj.minPrice) {
      addFilter(PRICE_VALUE, price)
    }
    if (formDataObj.felled) {
      addFilter(FELLING_STATE, {
        felled: formDataObj.felled === 'on' ? true : false,
      })
    }

    if (formDataObj.usage) {
      addUsage(formDataObj.usage)
    }

    const config = {
      method: 'post',
      url: 'http://localhost:4000/offer/getAll',
      headers: {
        'Content-Type': 'application/json',
      },
      data: getAllFilters(),
    }

    axios(config).then((response) => {
      setSearchResult(response.data)
      setChanged(!changed)
      setShowFilter(false)
    })
  }

  return (
    <>
      <div
        className='Filter mb-5 d-flex w-100 justify-content-end'
        style={{ gap: '1rem' }}
      >
        {/* <SortOrder order={order} setOrder={setOrder} /> */}
        <Button variant='primary' onClick={() => setShowFilter(true)}>
          <i className='fas fa-filter'></i>
        </Button>

        <Offcanvas
          show={showFilter}
          onHide={() => setShowFilter(false)}
          placement='end'
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Suchergebnisse filtern</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form onSubmit={handleFilterSubmit}>
              <h6>
                <b>Preis</b>
              </h6>
              <PriceRange />
              <hr />
              <h6>
                <b>Fällstatus</b>
              </h6>
              <Felled />
              <hr />
              <h6>
                <b>Umkreis</b>
              </h6>
              <Circling />
              <hr />
              <h6>
                <b>Verwendungszweck</b>
              </h6>
              <Usage />
              <hr />
              <ApplyFilter />
            </Form>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  )
}

export default Filter
