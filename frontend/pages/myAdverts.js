import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import Layout from '../components/Layout'
import { useMessage } from '../contexts/MessageContext'
import { useUser } from '../contexts/UserContext'

const myAdverts = () => {
  return (
    <Layout>
      <div className='mt-3'>
        <h2>Meine Inserate</h2>
        <p>Hier kannst du deine eigenen Inserate einsehen und bearbeiten</p>
        <div className='p-4 rounded bg-light box-shadow'></div>
      </div>
    </Layout>
  )
}

export default myAdverts
