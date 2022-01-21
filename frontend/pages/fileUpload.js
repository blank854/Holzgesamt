import React, { useState, useEffect } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Layout from '../components/Layout'
import axios from 'axios'
import { useUser } from '../contexts/UserContext'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
// import DatePicker from 'react-multi-date-picker'

// export default function Example() {
//   const [value, setValue] = useState(new Date());

//   return <DatePicker value={value} onChange={setValue} />;
// }

const fileUpload = () => {
  const [file, setFile] = useState('')

  const handleFileUpload = (e) => {
    setFile(e.target.files[0])
  }

  useEffect(() => {
    if (file === '') return
    let formData = new FormData()
    formData.append('Image', file)

    const config = {
      method: 'POST',
      url: 'http://localhost:4000/upload',
      data: formData,
    }

    console.log(config)

    axios(config)
      .then((result) => {
        console.log(result)
      })
      .catch((e) => {
        console.error(e)
      })
  }, [file])

  return (
    <Layout>
      <div className='CreateAdvert'>
        <Form>
          <Form.Group controlId='formFile' className='mb-3'>
            <Form.Label>Default file input example</Form.Label>
            <Form.Control type='file' onChange={handleFileUpload} />
          </Form.Group>
        </Form>
      </div>
    </Layout>
  )
}

export default fileUpload
