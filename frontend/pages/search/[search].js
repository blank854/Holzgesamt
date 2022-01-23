import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Badge, Col, Row } from 'react-bootstrap'
import Filter from '../../components/Filter'
import ItemList from '../../components/ItemList'
import Layout from '../../components/Layout'

const searchPage = ({ searchResult, filter }) => {
  searchResult = JSON.parse(searchResult)

  const [currentFilter, setCurrentFilter] = useState(filter)
  const [currentSearchResult, setCurrentSearchResult] = useState(searchResult)

  return (
    <Layout>
      <Row className='mt-5'>
        <Col md={10} className='d-flex align-items-center'>
          <h4 className='d-inline-block me-3'>Ihre Suchergebnisse</h4>
          <Badge bg='secondary' className='text-primary' pill>
            {currentSearchResult.length}
          </Badge>
        </Col>
        <Col md={2}>
          <Filter filter={currentFilter} />
        </Col>
      </Row>

      <ItemList productList={currentSearchResult} />
    </Layout>
  )
}

export default searchPage

export async function getServerSideProps(context) {
  let filter = JSON.parse(context.params.search)
  var config = {
    method: 'get',
    url: 'http://localhost:4000/offer',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ...filter },
  }

  let searchResult = await axios(config)

  searchResult = JSON.stringify(searchResult.data)

  return {
    props: {
      searchResult,
      filter,
    },
  }
}
