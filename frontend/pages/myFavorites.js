import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import Layout from '../components/Layout'
import { useMessage } from '../contexts/MessageContext'
import { useUser } from '../contexts/UserContext'
import Head from 'next/head'

const myFavorites = () => {
  const { favorites, getFavorites, toggleFavorite, getUser } = useUser()
  const { setMessage } = useMessage()

  useEffect(async () => {
    getFavorites()
    setMessage('')
  }, [])

  const handleRemoveFavorite = (offerId) => {
    toggleFavorite(offerId).then()
  }

  if (!getUser()) return <Layout></Layout>

  return (
    <>
      <Head>
        <title>Meine Favoriten</title>
      </Head>
      <Layout>
        <div className='mt-3'>
          <h2>Meine Favoriten</h2>
          <p>Hier kannst du deine Favoriten einsehen und löschen.</p>
          {favorites.map((favorite, index) => (
            <div className='p-4 rounded bg-light box-shadow mb-3' key={index}>
              <Row>
                <Col sm={12} md={3}>
                  <img
                    src={favorite.pictures[0].access}
                    className='w-100 rounded mb-3'
                    style={{ objectFit: 'scale-down', height: '15rem' }}
                  />
                </Col>
                <Col sm={12} md={9}>
                  <Row>
                    <Col sm={12} md={6}>
                      <p>
                        <b>Titel</b>
                        <br />
                        {favorite.title}
                      </p>
                    </Col>
                    <Col sm={12} md={6}>
                      <p>
                        <b>Preis</b>
                        <br />
                        {`${favorite.price.priceValue}€ ${favorite.price.priceType}`}
                      </p>
                    </Col>
                  </Row>
                  <Row className='mt-5'>
                    <Col sm={12} md={6}>
                      <Link href={`/${favorite._id}`}>
                        <Button variant='primary' className='w-100 mb-3'>
                          Inserat anzeigen
                        </Button>
                      </Link>
                    </Col>
                    <Col sm={12} md={6}>
                      <Button
                        variant='danger'
                        className='w-100'
                        onClick={() => handleRemoveFavorite(favorite._id)}
                      >
                        Von Favoriten entfernen
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </Layout>
    </>
  )
}

export default myFavorites
