import React, { useState } from 'react'
import PriceRange from './filters/PriceRange'
import Felled from './filters/Felled'
import Circling from './filters/Circling'
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
  const [showFilter, setShowFilter] = useState(false)
  const { getFilter } = useFilter()
  const [felled, setFelled] = useState(
    getFilter(FELLING_STATE) && getFilter(FELLING_STATE).value
  )

  const { addFilter, getAllFilters, addUsage } = useFilter()

  const handleFilterSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const formDataObj = Object.fromEntries(formData.entries())

    addFilter(LOCATION, {
      maxDistance: parseInt(formDataObj.circling) * 1000,
      zip: formDataObj.zip,
    })
    addFilter(PRICE_VALUE, {
      minPrice: formDataObj.minPrice,
      maxPrice: formDataObj.maxPrice,
    })
    addFilter(FELLING_STATE, {
      felled: felled,
    })

    if (formDataObj.usage) {
      addUsage(formDataObj.usage)
    }

    updateList()
    setShowFilter(false)
  }

  const updateList = () => {
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
    })
  }

  return (
    <>
      <div
        className='Filter mb-5 d-flex w-100 justify-content-end'
        style={{ gap: '1rem' }}
      >
        <SortOrder updateList={updateList} />
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
              <Felled felled={felled} setFelled={setFelled} />
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
