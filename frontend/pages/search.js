import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Badge, Col, Pagination, Row } from 'react-bootstrap'
import Filter from '../components/Filter'
import ItemList from '../components/ItemList'
import Layout from '../components/Layout'
import { useFilter } from '../contexts/FilterContext'
import { useMessage } from '../contexts/MessageContext'
import Head from 'next/head'
import { ENTRIES_PER_PAGE } from '../constants/filter_constants'

const SearchPage = () => {
  const [searchResult, setSearchResult] = useState([])
  const [pageCount, setPageCount] = useState([])
  const [activePage, setActivePage] = useState(1)
  const [changed, setChanged] = useState(false)
  const [resultCount, setResultCount] = useState()
  const { getAllFilters, setPage, nextPage, previousPage } = useFilter()
  const { setMessage } = useMessage()

  const handleSetPage = (page) => {
    setActivePage(page)
    setPage(page)
  }

  const handleNextPage = () => {
    if (activePage === pageCount.length) return
    setActivePage(activePage + 1)
    nextPage()
  }

  const handlePreviousPage = () => {
    if (activePage === 1) return
    setActivePage(activePage - 1)
    previousPage()
  }

  const updatePage = () => {
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
    })
  }

  useEffect(() => {
    setMessage('')
    updatePage()
  }, [])

  useEffect(() => {
    updatePage()
  }, [getAllFilters().paging.skip])

  useEffect(() => {
    if (!searchResult.count) return
    setResultCount(searchResult.count)
    const tmpPageCount = Math.ceil(searchResult.count / ENTRIES_PER_PAGE)
    let tmpPages = []
    for (let i = 0; i < tmpPageCount; i++) {
      tmpPages.push(i + 1)
    }

    setPageCount(tmpPages)
  }, [searchResult])

  return (
    <>
      <Head>
        <title>Suche | Baumazon</title>
      </Head>
      <Layout>
        <Row className='mt-5'>
          <Col md={10}>
            <h4 className='d-inline-block me-3 my-0'>Ihre Suchergebnisse</h4>
            <Badge bg='secondary' className='text-primary' pill>
              {resultCount}
            </Badge>
          </Col>
          <Col md={2}>
            <Filter
              setSearchResult={setSearchResult}
              setChanged={setChanged}
              changed={changed}
            />
          </Col>
        </Row>

        {searchResult.offers ? (
          <ItemList productList={searchResult.offers} changed={changed} />
        ) : (
          ''
        )}
        <div className='d-flex w-100 my-5 justify-content-center'>
          <Pagination>
            <Pagination.First onClick={() => handleSetPage(1)} />
            <Pagination.Prev onClick={handlePreviousPage} />
            {pageCount.map((index) => (
              <Pagination.Item
                onClick={() => handleSetPage(index)}
                active={activePage === index}
                key={index}
              >
                {index}
              </Pagination.Item>
            ))}

            <Pagination.Next onClick={handleNextPage} />
            <Pagination.Last onClick={() => handleSetPage(pageCount.length)} />
          </Pagination>
        </div>
      </Layout>
    </>
  )
}

export default SearchPage
