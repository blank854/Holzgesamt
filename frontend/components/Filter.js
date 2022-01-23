import React, { useState, useEffect } from 'react'
import PriceRange from './filters/PriceRange'
import filterItemList from '../lib/filterItems'
import Felled from './filters/Felled'
import Circling from './filters/Circling'
import Search from './filters/Search'
import ApplyFilter from './filters/ApplyFilter'
import SortOrder from './SortOrder'

const Filter = () => {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [felled, setFelled] = useState([false])
  const [circling, setCircling] = useState(50)
  const [location, setLocation] = useState([])
  const [search, setSearch] = useState('')

  const [filterData, setFilterData] = useState({})
  const [order, setOrder] = useState({})

  useEffect(() => {
    setFilterData({
      filters: [
        {
          field: 'price.priceValue',
          value: {
            $gte: priceRange[0],
            $lte: priceRange[1],
          },
        },
        {
          field: 'treeDetail.fellingState.felled',
          value: felled,
        },
        {
          field: 'location',
          maxDistance: circling * 1000,
          coordinates: location,
        },
        {
          field: 'title',
          value: search,
        },
      ],
      sorter: {
        'price.priceValue': order,
      },
    })
  }, [priceRange, felled, circling, search, location, order])
  return (
    <div
      className='Filter mt-3 d-flex w-100 justifiy-content-end'
      style={{ gap: '1rem' }}
    >
      <SortOrder order={order} />
      {/* <PriceRange priceRange={priceRange} setPriceRange={setPriceRange} />
      <Felled felled={felled} setFelled={setFelled} />
      <Circling
        circling={circling}
        setCircling={setCircling}
        setLocation={setLocation}
      />
      <Search search={search} setSearch={setSearch} />
      <ApplyFilter filterData={filterData} /> */}
    </div>
  )
}

export default Filter
