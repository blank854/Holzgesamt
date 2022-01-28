import React, { useEffect } from 'react'
import ItemList from '../components/ItemList'
import Layout from '../components/Layout'
import axios from 'axios'
import FilterLanding from '../components/FilterLanding'
import Landing from '../components/Landing'
import { Container } from 'react-bootstrap'
import Head from 'next/head'
import { useMessage } from '../contexts/MessageContext'

const Shop = ({ productList }) => {
  const { setMessage } = useMessage()
  useEffect(() => {
    setMessage('')
  }, [])
  return (
    <>
      <Head>
        <title>Holzprojekt</title>
      </Head>
      <Layout container={false}>
        <Landing />
        <Container>
          {/* <FilterLanding /> */}
          <section className='my-5 text-primary'>
            <h1>
              <b>Unsere Empfehlungen</b>
            </h1>
            <p>Hier haben wir Empfehlungen für dich zusammengestellt.</p>
          </section>
          <ItemList productList={JSON.parse(productList)} />
        </Container>
      </Layout>
    </>
  )
}

export default Shop

export async function getServerSideProps(context) {
  // const productId = context._id

  const data = {
    paging: {
      limit: 10,
      skip: 0,
      count: false,
    },
  }
  var config = {
    method: 'post',
    url: 'http://localhost:4000/offer/getAll',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  }

  let productList = await axios(config)

  productList = productList.data.offers.slice(0, 4)

  productList = JSON.stringify(productList)

  return { props: { productList } }
}
