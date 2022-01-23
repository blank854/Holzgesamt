import React, { useState, useEffect } from 'react'
import PriceRange from './filters/PriceRange'
import filterItemList from '../lib/filterItems'
import Felled from './filters/Felled'
import Circling from './filters/Circling'
import Search from './filters/Search'
import ApplyFilter from './filters/ApplyFilter'
import SortOrder from './SortOrder'
import { Button, Form, Offcanvas } from 'react-bootstrap'

const Filter = ({ filter }) => {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [felled, setFelled] = useState([false])
  const [circling, setCircling] = useState(50)
  const [location, setLocation] = useState([])
  const [search, setSearch] = useState('')

  const [filterData, setFilterData] = useState({})
  const [order, setOrder] = useState({})
  const [showFilter, setShowFilter] = useState(false)

  const handleFilterSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const formDataObj = Object.fromEntries(formData.entries())

    if (formDataObj.zip) {
      filter.filters.push({
        field: 'treeDetail.location',
        maxDistance: circling * 1000,
        zip: formDataObj.zip,
      })
    }

    if (formDataObj.price) {
      filter.filters.push({
        field: 'price.priceValue',
        value: {
          $lte: formDataObj.price,
        },
      })
    }

    if (felled == 1 || felled == 2) {
      filter.filters.push({
        field: 'treeDetail.fellingState.felled',
        value: felled === 1 ? true : false,
      })
    }

    const config = {
      method: 'get',
      url: 'http://localhost:4000/offer',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { ...filter },
    }

    axios(config).then((response) => {
      setCurrentSearchResult(response.data)
    })
  }

  return (
    <>
      <div
        className='Filter mb-5 d-flex w-100 justify-content-end'
        style={{ gap: '1rem' }}
      >
        <SortOrder order={order} setOrder={setOrder} />
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
              <PriceRange
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
              <hr />
              <h6>
                <b>Fällstatus</b>
              </h6>
              <Felled felled={felled} setFelled={setFelled} />
              <hr />
              <h6>
                <b>Umkreis</b>
              </h6>
              <Circling
                circling={circling}
                setCircling={setCircling}
                setLocation={setLocation}
              />
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
