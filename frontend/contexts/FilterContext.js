import axios from 'axios'
import React, { useContext, useState, useEffect } from 'react'
import {
  ENTRIES_PER_PAGE,
  FELLING_STATE,
  HIGHEST_RELEVANCE,
  LOCATION,
  PRICE_VALUE,
  TITLE,
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
    usage: [],
  })
  const [loading, setLoading] = useState()

  const getAllFilters = () => {
    return filter
  }

  const addUsage = (usage) => {
    let tmpFilter = filter
    tmpFilter.usage[0] = usage
    setFilter(tmpFilter)
  }

  const getUsage = () => {
    let tmpFilter = filter
    return tmpFilter.usage[0]
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
    let index = getFilterIndex(pFilter)

    switch (pFilter) {
      case PRICE_VALUE:
        if (!payload.minPrice && !payload.maxPrice) {
          return index >= 0 ? tmpFilter.filters.splice(index, 1) : null
        }

        filterData = {
          field: PRICE_VALUE,
          value: {},
        }

        if (payload.minPrice) filterData.value.$gte = payload.minPrice
        if (payload.maxPrice) filterData.value.$lte = payload.maxPrice

        break
      case LOCATION:
        if (!payload.zip)
          return index >= 0 ? tmpFilter.filters.splice(index, 1) : null

        filterData = {
          field: LOCATION,
          maxDistance: payload.maxDistance,
          zip: payload.zip,
        }

        break
      case FELLING_STATE:
        if (payload.felled === null)
          return index >= 0 ? tmpFilter.filters.splice(index, 1) : null

        filterData = {
          field: FELLING_STATE,
          value: payload.felled,
        }

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
    if (!filter.sorter) return 'höchste Relevanz'
    if (filter.sorter[PRICE_VALUE]) {
      return filter.sorter[PRICE_VALUE] === 1
        ? 'Preis aufsteigend'
        : 'Preis absteigend'
    }

    if (filter.sorter[TITLE]) {
      return filter.sorter[TITLE] === 1
        ? 'Alphabetisch aufsteigend'
        : 'Alphabetisch absteigend'
    }
  }

  const setSortOrder = (type, sort_order) => {
    let tmpFilter = filter
    tmpFilter.sorter = {}

    if (type === HIGHEST_RELEVANCE) return delete tmpFilter.sorter

    tmpFilter.sorter[type] = sort_order

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
    addUsage,
    getUsage,
  }

  return (
    <FilterContext.Provider value={value}>
      {!loading && children}
    </FilterContext.Provider>
  )
}
