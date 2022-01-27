import React from 'react'
import { Alert } from 'react-bootstrap'
import { useMessage } from '../contexts/MessageContext'

const ErrorMessage = () => {
  const { message, variant } = useMessage()
  return (
    <Alert variant={variant} className='mt-3'>
      {message}
    </Alert>
  )
}

export default ErrorMessage
