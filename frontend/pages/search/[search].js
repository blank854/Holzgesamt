import axios from 'axios'
import React, { useEffect } from 'react'
import Filter from '../../components/Filter'
import ItemList from '../../components/ItemList'
import Layout from '../../components/Layout'

const searchPage = ({ searchResult }) => {
  searchResult = JSON.parse(searchResult)

  return (
    <Layout>
      <h2 className='my-5'>{searchResult.length} passende Treffer gefunden</h2>
      <Filter />
      <ItemList productList={searchResult} />
    </Layout>
  )
}

export default searchPage

export async function getServerSideProps(context) {
  let filter = JSON.parse(context.params.search)
  console.log(filter)
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
    },
  }
}
