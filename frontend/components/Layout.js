import React from 'react'
import { Container } from 'react-bootstrap'
import Navigation from './Navigation'
import Chat from './Chat'
import { useUser } from '../contexts/UserContext'
import { useMessage } from '../contexts/MessageContext'
import ErrorMessage from './ErrorMessage'

const Layout = ({ children, container = true }) => {
  const { loggedIn } = useUser()
  const { message } = useMessage()
  return (
    <>
      <Navigation />
      {container ? (
        <Container>
          {message !== '' ? <ErrorMessage /> : ''}
          {children}
        </Container>
      ) : (
        <>{children}</>
      )}
      {loggedIn ? <Chat /> : ''}
    </>
  )
}

export default Layout
