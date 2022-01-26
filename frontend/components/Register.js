import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap'

const Register = ({ showModal, handleClose }) => {
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')

  const handleRegister = (e) => {
    setMessage('')
    e.preventDefault()
    const formData = new FormData(e.target)
    const formDataObj = Object.fromEntries(formData.entries())

    if (!checkPassword(formDataObj.password, formDataObj.passwordRepeat)) {
      return (
        setMessage('Ihre Passwörter stimmen leider nicht überein.'),
        setMessageType('danger')
      )
    }

    let user = {
      email: formDataObj.email,
      username: formDataObj.username,
      forename: formDataObj.prename,
      surname: formDataObj.name,
      password: formDataObj.password,
    }

    var config = {
      method: 'post',
      url: 'http://localhost:4000/user/signup',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(user),
    }

    axios(config)
      .then(function (response) {
        setMessageType('success')
        setMessage('Benutzer erfolgreich erstellt')
      })
      .catch(function (error) {
        setMessageType('warning')
        setMessage(
          'Das tut uns leid, da ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
        )
        console.error(error)
      })
      .finally(() => {
        e.target.reset()
      })
  }

  const checkPassword = (password, passwordRepeat) => {
    return password === passwordRepeat
  }

  useEffect(() => {
    setMessage('')
  }, [showModal])

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      size='lg'
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrieren</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message !== '' ? <Alert variant={messageType}>{message}</Alert> : ''}

        <Form onSubmit={handleRegister}>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label>Benutzername</Form.Label>
            <Form.Control
              type='text'
              placeholder='Max'
              name='username'
              required
            />
            <Form.Text className='text-muted'>
              Dein Benutzername wird öffentlich angezeigt.
            </Form.Text>
          </Form.Group>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label>E-Mail-Adresse</Form.Label>
            <Form.Control
              type='email'
              placeholder='max@mustermail.com'
              name='email'
              required
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className='' controlId='formBasicEmail'>
                <Form.Label>Vorname</Form.Label>
                <Form.Control type='text' placeholder='Max' name='prename' required/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='' controlId='formBasicEmail'>
                <Form.Label>Nachname</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Mustermann'
                  name='name'
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <div className='mb-3'>
            <Form.Text className='text-muted'>
              Wir werden deinen Namen niemals gegenüber Dritten kommunizieren.
            </Form.Text>
          </div>

          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Label>Passwort</Form.Label>
            <Form.Control
              type='password'
              placeholder='Passwort eingeben'
              name='password'
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Label>Passwort wiederholen</Form.Label>
            <Form.Control
              type='password'
              placeholder='Passwort wiederholen'
              name='passwordRepeat'
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formBasicCheckbox'>
            <Form.Check
              type='checkbox'
              label='Ich habe die Datenschutzbestimmungen gelesen und bin damit einverstanden.'
              required
            />
          </Form.Group>
          <div className='text-end'>
            <Button variant='success' type='submit'>
              Registrieren
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default Register
