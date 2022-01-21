import React from 'react'
import ItemList from '../components/ItemList'
import Layout from '../components/Layout'
import axios from 'axios'
import FilterLanding from '../components/FilterLanding'
import Landing from '../components/Landing'
import { Container } from 'react-bootstrap'

const Shop = ({ productList }) => {
  return (
    <>
      <Layout container={false}>
        <Landing />
        <Container>
          {/* <FilterLanding /> */}
          <section className='my-5 text-primary'>
            <h1>
              <b>Deine Empfehlungen</b>
            </h1>
            <p>
              Basierend auf deinen vorherigen Suchen haben wir Empfehlungen für
              dich zusammengestellt.
            </p>
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
    },
  }
  var config = {
    method: 'get',
    url: 'http://localhost:4000/offer',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  }

  let productList = await axios(config)

  productList = JSON.stringify(productList.data)

  return { props: { productList } }
}
