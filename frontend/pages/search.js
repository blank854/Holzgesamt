import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Badge, Col, Row } from 'react-bootstrap'
import Filter from '../components/Filter'
import ItemList from '../components/ItemList'
import Layout from '../components/Layout'
import { useFilter } from '../contexts/FilterContext'
import { useMessage } from '../contexts/MessageContext'

const searchPage = () => {
  const [searchResult, setSearchResult] = useState([])
  const [changed, setChanged] = useState(false)
  const { getAllFilters } = useFilter()
  const { setMessage } = useMessage()

  useEffect(() => {
    setMessage('')

    const config = {
      method: 'post',
      url: 'http://localhost:4000/offer/getAll',
      headers: {
        'Content-Type': 'application/json',
      },
      data: getAllFilters(),
    }

    console.log(config)

    axios(config).then((response) => {
      setSearchResult(response.data)
    })
  }, [])

  return (
    <Layout>
      <Row className='mt-5'>
        <Col md={10}>
          <h4 className='d-inline-block me-3 my-0'>Ihre Suchergebnisse</h4>
          <Badge bg='secondary' className='text-primary' pill>
            {searchResult.length}
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

      <ItemList productList={searchResult} changed={changed} />
    </Layout>
  )
}

export default searchPage
