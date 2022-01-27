import React from 'react'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useUser } from '../contexts/UserContext'

const Login = ({ setShowDropdown }) => {
  const { login } = useUser()
  const [message, setMessage] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const formDataObj = Object.fromEntries(formData.entries())

    const user = { email: formDataObj.email, password: formDataObj.password }

    const result = login(user)

    if (result) {
      e.target.reset()
      setShowDropdown(false)
    } else {
      setMessage(result.message)
    }
  }

  return (
    <div className='p-3' style={{ minWidth: '20rem' }}>
      <Form onSubmit={handleLogin}>
        {message !== '' ? <Alert variant='warning'>{message}</Alert> : ''}
        <Form.Group className='mb-2' controlId='emailLogin'>
          <Form.Label>E-Mail-Adresse</Form.Label>
          <Form.Control
            type='email'
            placeholder='max@muster.com'
            name='email'
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='passwordLogin'>
          <Form.Label>Passwort</Form.Label>
          <Form.Control
            type='password'
            placeholder='Passwort'
            name='password'
          />
        </Form.Group>
        <div className='d-flex'>
          <Button variant='primary' type='submit' className='w-100'>
            Anmelden
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Login
