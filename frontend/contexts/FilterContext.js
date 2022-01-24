import axios from 'axios'
import React, { useContext, useState, useEffect } from 'react'
import {
  ENTRIES_PER_PAGE,
  FELLING_STATE,
  HIGHEST_RELEVANCE,
  LOCATION,
  PRICE_VALUE,
} from '../constants/filter_constants'

const FilterContext = React.createContext()

export function useFilter() {
  return useContext(FilterContext)
}

export const FilterProvider = ({ children }) => {
  const [filter, setFilter] = useState({
    filters: [],
    paging: {
      limit: 10,
      skip: 0,
    },
  })
  const [loading, setLoading] = useState()

  const getAllFilters = () => {
    return filter
  }

  const getFilter = (payload) => {
    const results = filter.filters.filter((filter) => {
      return filter.field === payload
    })

    return results.length > 0 ? results[0] : null
  }

  const getFilterIndex = (payload) => {
    const index = filter.filters.findIndex((filter) => {
      return filter.field === payload
    })

    return index
  }

  const addFilter = (pFilter, payload) => {
    let tmpFilter = filter
    let filterData = {}
    let index = 0

    switch (pFilter) {
      case PRICE_VALUE:
        filterData = {
          field: PRICE_VALUE,
          value: {},
        }

        if (payload.minPrice) filterData.value.$gte = payload.minPrice
        if (payload.maxPrice) filterData.value.$lte = payload.maxPrice

        index = getFilterIndex(pFilter)
        break
      case LOCATION:
        filterData = {
          field: LOCATION,
          maxDistance: payload.maxDistance,
          zip: payload.zip,
        }

        index = getFilterIndex(pFilter)
        break
      case FELLING_STATE:
        filterData = {
          field: FELLING_STATE,
          value: payload.felled,
        }

        index = getFilterIndex(pFilter)
        break
    }

    if (index >= 0) {
      tmpFilter.filters[index] = filterData
    } else {
      tmpFilter.filters.push(filterData)
    }

    setFilter(tmpFilter)
  }

  const deleteAllFilters = () => {
    let tmpFilter = filter
    filter.filters = []
    setFilter(tmpFilter)
  }

  const getSortOrder = () => {
    return filter.sorter
  }

  const setSortOrder = (type, sort_order) => {
    let tmpFilter = filter
    if (type === HIGHEST_RELEVANCE) {
      filter.sorter = {}
    } else {
      filter.sorter = {}
      filter.sorter[type] = sort_order
    }

    setFilter(tmpFilter)
  }

  const setSearch = (search) => {
    let tmpFilter = filter
    tmpFilter.search = {
      value: search,
    }

    setFilter(tmpFilter)
  }

  const getSearch = () => {
    return filter.search.value
  }

  const nextPage = () => {
    let tmpFilter = filter
    tmpFilter.paging.limit += ENTRIES_PER_PAGE
    tmpFilter.paging.skip += ENTRIES_PER_PAGE

    setFilter(tmpFilter)
  }

  const previousPage = () => {
    let tmpFilter = filter
    tmpFilter.paging.limit -= ENTRIES_PER_PAGE
    tmpFilter.paging.skip -= ENTRIES_PER_PAGE

    setFilter(tmpFilter)
  }

  const setPage = (page) => {
    let tmpFilter = filter
    tmpFilter.paging.limit += page * ENTRIES_PER_PAGE
    tmpFilter.paging.skip += (page - 1) * ENTRIES_PER_PAGE

    setFilter(tmpFilter)
  }

  const getPage = () => {
    return filter.paging.limit / ENTRIES_PER_PAGE
  }

  const value = {
    getAllFilters,
    getFilter,
    addFilter,
    deleteAllFilters,
    getSortOrder,
    setSortOrder,
    setSearch,
    getSearch,
    nextPage,
    previousPage,
    setPage,
    getPage,
  }

  return (
    <FilterContext.Provider value={value}>
      {!loading && children}
    </FilterContext.Provider>
  )
}
