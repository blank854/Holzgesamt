import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import Layout from '../components/Layout'
import { useMessage } from '../contexts/MessageContext'
import { useUser } from '../contexts/UserContext'
import Head from 'next/head'

const UserSettings = () => {
  const { getAccountInformation, accountInformation, updateUser, getUser } =
    useUser()
  const { setMessage } = useMessage()
  const [prename, setPrename] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [notification, setNotification] = useState()

  useEffect(() => {
    setMessage('')
    getAccountInformation()
  }, [])

  useEffect(() => {
    setPrename(accountInformation.forename)
    setName(accountInformation.surname)
    setUsername(accountInformation.username)
  }, [accountInformation])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const userData = {
      username: username,
      forename: prename,
      surname: name,
      userPreferences: {
        emailNotification: notification,
      },
    }
    await updateUser(userData)
  }

  if (!getUser()) return <Layout></Layout>

  return (
    <>
      <Head>
        <title>Benutzereinstellungen</title>
      </Head>
      <Layout>
        <Form onSubmit={handleSubmit}>
          <div className='mt-3'>
            <h2>Profileinstellungen</h2>
            <p>Passe die wichtigsten Funktionen deines Kontos an</p>
            <div className='user p-4 rounded bg-light box-shadow'>
              <h5 className='mb-4'>Benutzereinstellungen</h5>
              <Form.Group className='text-nowrap mb-3'>
                <Row>
                  <Col sm={12} md={6}>
                    <Form.Label>
                      <b>Vorname</b>
                    </Form.Label>
                  </Col>
                  <Col sm={12} md={6}>
                    <Form.Control
                      type='text'
                      placeholder='Vornamen eingeben'
                      value={prename}
                      onChange={(e) => setPrename(e.target.value)}
                      style={{ maxWidth: '400px' }}
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className='text-nowrap mb-3'>
                <Row>
                  <Col sm={12} md={6}>
                    <Form.Label>
                      <b>Name</b>
                    </Form.Label>
                  </Col>
                  <Col sm={12} md={6}>
                    {' '}
                    <Form.Control
                      type='text'
                      placeholder='Nachnamen eingeben'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ maxWidth: '400px' }}
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className='text-nowrap mb-3'>
                <Row>
                  <Col sm={12} md={6}>
                    <Form.Label>
                      <b>Benutzername</b>
                    </Form.Label>
                  </Col>
                  <Col sm={12} md={6}>
                    <Form.Control
                      type='text'
                      placeholder='Benutzername eingeben'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled
                      style={{ maxWidth: '400px' }}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </div>

            <div className='preferences p-4 rounded mt-4 bg-light box-shadow'>
              <h5 className='mb-4'>Präferenzen</h5>

              <Form.Check
                type='checkbox'
                id='chatNotifications'
                label='Chat-Benachrichtiungen per Mail erhalten'
                className='mb-3'
                value={notification}
                onChange={(e) => setNotification(e.target.checked)}
              />
            </div>
          </div>

          <div className='submit d-flex justify-content-end mt-4'>
            <Button variant='primary' type='submit'>
              Änderungen speichern
            </Button>
          </div>
        </Form>
      </Layout>
    </>
  )
}

export default UserSettings
