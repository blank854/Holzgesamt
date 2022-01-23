import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import Layout from '../components/Layout'
import { useMessage } from '../contexts/MessageContext'
import { useUser } from '../contexts/UserContext'

const myFavorites = () => {
  const { favorites, getFavorites, toggleFavorite, getUser } = useUser()
  const { setMessage } = useMessage()

  useEffect(async () => {
    getFavorites()
    setMessage('')
  }, [])

  const handleRemoveFavorite = (offerId) => {
    console.log(offerId)
    toggleFavorite(offerId).then()
  }

  if (!getUser()) return <Layout></Layout>

  return (
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
                  className='w-100 rounded'
                />
              </Col>
              <Col sm={12} md={9}>
                <Row>
                  <Col sm={12} md={6}>
                    <p>
                      <b>Titel</b>
                    </p>
                    <p>
                      <p>{favorite.title}</p>
                    </p>
                  </Col>
                  <Col sm={12} md={6}>
                    <b>Preis</b>
                    <p>{`${favorite.price.priceValue}€ ${favorite.price.priceType}`}</p>
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
  )
}

export default myFavorites
