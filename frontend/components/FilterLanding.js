import React, { useState, useEffect } from 'react'
import PriceRange from './filters/PriceRange'
import Felled from './filters/Felled'
import Circling from './filters/Circling'
import Search from './filters/Search'
import ApplyFilter from './filters/ApplyFilter'

const FilterLanding = () => {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [felled, setFelled] = useState([false])
  const [usage, setUsage] = useState("")
  const [circling, setCircling] = useState(50)
  const [location, setLocation] = useState([])
  const [search, setSearch] = useState('')

  const [filterData, setFilterData] = useState({})

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
    })

    console.log(filterData)
  }, [priceRange, felled, circling, search, location])
  return (
    <div className='Filter mt-3 d-flex' style={{ gap: '1rem' }}>
      <PriceRange priceRange={priceRange} setPriceRange={setPriceRange} />
      <Felled felled={felled} setFelled={setFelled} />
      <Circling
        circling={circling}
        setCircling={setCircling}
        setLocation={setLocation}
      />
      <Search search={search} setSearch={setSearch} />
      <ApplyFilter filterData={filterData} />
    </div>
  )
}

export default FilterLanding
