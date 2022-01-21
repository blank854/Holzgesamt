import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import { Button, Col, Row } from 'react-bootstrap'
import { Loader } from '@googlemaps/js-api-loader'
import Recommendations from '../components/Recommendations'
import { useUser } from '../contexts/UserContext'
import { useChat } from '../contexts/ChatContext'
import ImageGallery from '../components/ImageGallery'
import { useRouter } from 'next/router'
import { useMessage } from '../contexts/MessageContext'

const productDetail = ({ productDetail, API_KEY }) => {
  const { getUser, toggleFavorite, favorites, loggedIn } = useUser()
  const { setMessage, setVariant } = useMessage()
  const {
    checkForExistingChat,
    setShowChat,
    setProductDetail,
    chatList,
    setConversation,
  } = useChat()

  const router = useRouter()
  const { requester } = router.query

  productDetail = JSON.parse(productDetail)
  let map

  useEffect(() => {
    console.log(productDetail)
    const loader = new Loader({
      apiKey: API_KEY,
      version: 'weekly',
    })
    loader.load().then(() => {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: productDetail.treeDetail.location.coordinates[0],
          lng: productDetail.treeDetail.location.coordinates[1],
        },
        zoom: 8,
      })
    })
  }, [])

  useEffect(() => {
    if (requester) {
      if (loggedIn === false) {
        console.log('test')
        setMessage(
          'Du musst angemeldet sein, um deine Nachrichten anzuschauen.'
        )
        setVariant('info')
        return
      }
      setShowChat(true)
      if (chatList.length === 0) return
      let index = chatList.findIndex((elem) => elem.reciever._id === requester)

      if (index < 0) {
        index = chatList.findIndex((elem) => elem.sender._id === requester)
      }
      setConversation(chatList[index]._id)
    }
  }, [chatList])

  const handleStartChat = () => {
    checkForExistingChat(productDetail)
      .then(() => {
        setProductDetail(productDetail)
        setShowChat(true)
      })
      .catch((e) => {
        console.error(e)
      })
  }
  return (
    <>
      <Layout>
        <Row className='mt-3'>
          <Col md={12} lg={6} className='mb-3'>
            <div className='bg-light box-shadow p-3 rounded'>
              <ImageGallery images={productDetail.pictures} />
            </div>
          </Col>
          <Col md={12} lg={6} className='bg-light'>
            <div className='bg-light  p-3 rounded box-shadow text-primary'>
              <h2>
                <b>{productDetail.title}</b>
              </h2>
              <div className='interactions my-5'>
                <Row>
                  <Col sm={12} md={4} className='mb-3'>
                    <Button
                      variant='primary'
                      className='me-3 flex-grow-1 w-100 h-100'
                      onClick={() => handleStartChat()}
                    >
                      Jetzt kontaktieren
                    </Button>
                  </Col>
                  <Col sm={12} md={4} className='mb-3'>
                    <Button
                      variant='secondary'
                      className='me-3 flex-grow-1 w-100 h-100'
                      onClick={() => toggleFavorite(productDetail._id)}
                    >
                      {favorites &&
                      favorites.some((e) => e._id === productDetail._id)
                        ? 'Von Favoriten entfernen'
                        : 'Zu Favoriten hinzufügen'}
                    </Button>
                  </Col>
                  <Col sm={12} md={4}>
                    <div className='interactions-price text-center text-md-end flex-grow-1'>
                      <h3 className='mb-0'>
                        {productDetail.price.priceValue}€
                      </h3>
                      <span>{productDetail.price.priceType}</span>
                    </div>
                  </Col>
                </Row>
              </div>
              <p className='mb-1'>
                <b>Beschreibung</b>
              </p>
              <p>{productDetail.description}</p>
              <p className='mb-1'>
                <b>Gattung</b>
              </p>
              <ul>
                <li>
                  Lateinischer Name: {productDetail.treeDetail.species.latin}
                </li>
                <li>
                  Deutscher Name: {productDetail.treeDetail.species.german}
                </li>
              </ul>
              <p className='mb-1'>
                <b>Allgemeine Informationen</b>
              </p>
              <ul>
                <li>
                  Bereits gefällt:{' '}
                  {productDetail.treeDetail.fellingState.felled ? 'Ja' : 'Nein'}
                </li>

                {productDetail.treeDetail.fellingState.felled ? (
                  <li>
                    Fälldatum:{' '}
                    {productDetail.treeDetail.fellingState.fellingDate}
                  </li>
                ) : (
                  ''
                )}
                <li>
                  Höhe: {productDetail.treeDetail.dimensions.height} Meter
                </li>
                <li>
                  Umfang: {productDetail.treeDetail.dimensions.circumference}{' '}
                  Meter
                </li>
                <li>
                  Fällzeitraum vorhanden:{' '}
                  {productDetail.treeDetail.timeWindow.restricted
                    ? 'Ja'
                    : 'Nein'}
                </li>
                {productDetail.treeDetail.timeWindow.restricted ? (
                  <li>{`${productDetail.treeDetail.timeWindow.from} - ${productDetail.treeDetail.timeWindow.till}`}</li>
                ) : (
                  ''
                )}
              </ul>
              <p className='mb-0 r'>
                <b>Standort</b>
              </p>
              <small className=''>
                Bitte beachte, dass aus Datenschutzgründen lediglich ein
                ungefährer Standort angegeben wird.
              </small>
              <div
                id='map'
                className='w-100 mt-3'
                style={{ height: '300px' }}
              ></div>
            </div>
          </Col>
        </Row>
        <Recommendations recommendations={productDetail.recommendations} />
      </Layout>
    </>
  )
}

export default productDetail

export async function getServerSideProps(context) {
  const productId = context.params._id

  let productDetail = await axios.get(
    `http://localhost:4000/offer/${productId}`
  )

  const recommendationData = {
    paging: {
      limit: 10000,
      skip: 0,
    },
  }
  var config = {
    method: 'get',
    url: 'http://localhost:4000/offer',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(recommendationData),
  }

  productDetail = JSON.stringify(productDetail.data)

  // const timeWindowFrom = new Date(productDetail.treeDetail.timeWindow.from)
  // const timeWindowTill = new Date(productDetail.treeDetail.timeWindow.till)

  // const convertDate = (date) => {
  //   const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  //   const month =
  //     date.getMonth() + 1 < 10
  //       ? '0' + (date.getMonth() + 1)
  //       : date.getMonth() + 1
  //   const year = date.getFullYear()
  //   const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  //   const minutes =
  //     date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

  //   return `${day}.${month}.${year} um ${hours}:${minutes}`
  // }

  // productDetail.treeDetail.timeWindow.from = convertDate(timeWindowFrom)
  // productDetail.treeDetail.timeWindow.till = convertDate(timeWindowTill)

  return {
    props: {
      productDetail,
      API_KEY: process.env.GOOGLE_API_KEY,
    },
  }
}
