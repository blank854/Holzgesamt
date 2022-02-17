import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import Layout from '../components/Layout'
import { useMessage } from '../contexts/MessageContext'
import { useUser } from '../contexts/UserContext'
import Head from 'next/head'
import axios from 'axios'
import Link from 'next/link'

const MyAdverts = () => {
  const { getAccountInformation, accountInformation, getUser } = useUser()
  const { setMessage, setVariant } = useMessage()

  useEffect(() => {
    getAccountInformation()
    setMessage('')
  }, [])

  useEffect(() => {
    console.log(accountInformation)
  }, [accountInformation])

  const handleDeleteAdvert = (id) => {
    const config = {
      method: 'delete',
      url: `http://localhost:4000/offer/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUser().token}`,
      },
    }

    axios(config)
      .then((e) => {
        getAccountInformation()
        setMessage('Inserat erfolgreich gelöscht.')
        setVariant('success')
        window.scrollTo(0, 0)
      })
      .catch((e) => {
        setMessage(e.response.data.message)
        setVariant('warning')
        window.scrollTo(0, 0)
      })
  }

  if (!getUser()) return <Layout></Layout>
  return (
    <>
      <Head>
        <title>Meine Inserate</title>
      </Head>
      <Layout>
        <div className='mt-3'>
          <h2>Meine Inserate</h2>
          <p>Hier kannst du deine eigenen Inserate einsehen und bearbeiten</p>
          {accountInformation.offers &&
            accountInformation.offers.map((offer) => (
              <div
                className='p-4 rounded bg-light box-shadow mb-3'
                key={offer._id}
              >
                <Row>
                  <Col sm={12} md={3}>
                    <img
                      src={offer.pictures[0].access}
                      className='w-100 rounded'
                      style={{ objectFit: 'scale-down', height: '15rem' }}
                    />
                  </Col>
                  <Col sm={12} md={9}>
                    <Row>
                      <Col sm={12} md={6}>
                        <p>
                          <b>Titel</b>
                          <br />
                          {offer.title}
                        </p>
                      </Col>
                      <Col sm={12} md={6}>
                        <p>
                          <b>Preis</b>
                          <br />
                          {`${offer.price.priceValue}€ ${offer.price.priceType}`}
                        </p>
                      </Col>
                    </Row>
                    <Row className='mt-5'>
                      <Col sm={12} md={6}>
                        <Link href={`/${offer._id}`}>
                          <Button variant='primary' className='w-100 mb-3'>
                            Inserat anzeigen
                          </Button>
                        </Link>
                      </Col>
                      <Col sm={12} md={6}>
                        <Button
                          variant='danger'
                          className='w-100'
                          onClick={() => handleDeleteAdvert(offer._id)}
                        >
                          Inserat löschen
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

export default MyAdverts
