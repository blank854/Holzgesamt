import Link from 'next/link'
import React from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import { useUser } from '../contexts/UserContext'

const User = () => {
  const { getUser, logout } = useUser()
  return (
    <Dropdown>
      <Dropdown.Toggle variant='dark' id='dropdown-basic' className='w-100'>
        Mein Account
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>Hallo {getUser().username}</Dropdown.Header>
        <Dropdown.Item>
          <Link href='/userSettings'>
            <div className='nav-item'>Profil verwalten</div>
          </Link>
        </Dropdown.Item>
        <Dropdown.Item>
          <Link href='/myAdverts'>
            <div className='nav-item'>Meine Inserate</div>
          </Link>
        </Dropdown.Item>
        <Dropdown.Item>
          <Link href='/myFavorites'>
            <div className='nav-item'>Meine Favoriten</div>
          </Link>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={logout}>Abmelden</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default User
