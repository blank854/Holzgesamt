import React, { useState } from 'react'
import { Navbar, Container, Nav, NavDropdown, Dropdown } from 'react-bootstrap'
import Register from './Register'
import Login from './Login'
import { useUser } from '../contexts/UserContext'
import User from './User'
import Link from 'next/link'
import CreateAdvert from './CreateAdvert'

const Navigation = () => {
  const [showModal, setShowModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const { loggedIn } = useUser()

  const handleClose = () => setShowModal(false)
  const handleOpen = () => {
    setShowModal(true)
  }

  return (
    <>
      <Navbar bg='light' variant='light' className='my-1' expand='lg'>
        <Container>
          <Navbar.Brand>
            <Link href='/'>
              <a className='font-weight-bold nav-link pointer'>Holzprojekt</a>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse
            id='basic-navbar-nav'
            className='justify-content-end'
          >
            <Nav>
              {loggedIn ? (
                <Nav.Link as='div'>
                  <User />
                </Nav.Link>
              ) : (
                <Nav.Link as='div'>
                  <Dropdown
                    show={showDropdown}
                    onToggle={() => setShowDropdown(!showDropdown)}
                    align='end'
                  >
                    <Dropdown.Toggle
                      variant='primary'
                      id='Login'
                      className='w-100'
                    >
                      Anmelden
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Login setShowDropdown={setShowDropdown} />
                      <Dropdown.Divider />
                      <Dropdown.Item>
                        <a
                          className='mx-3 nav-link pointer'
                          onClick={() => {
                            handleOpen()
                          }}
                          variant='link'
                        >
                          Noch kein Account?{' '}
                          <span className='link-primary'>
                            Jetzt registrieren.
                          </span>
                        </a>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Link>
              )}
              {loggedIn ? (
                <Nav.Link as='div'>
                  <CreateAdvert />
                </Nav.Link>
              ) : (
                ''
              )}
            </Nav>
          </Navbar.Collapse>
          {/* <Nav className='me-auto'>
            <Link href='/home'>
              <a className='nav-link'>Home</a>
            </Link>
            <Link href='/shop'>
              <a className='nav-link'>Shop</a>
            </Link>
            <Link href=''>
              <a className='nav-link'>Kontakt</a>
            </Link>
          </Nav> */}
        </Container>
      </Navbar>

      <Register showModal={showModal} handleClose={handleClose} />
    </>
  )
}

export default Navigation
