import React, { useState } from 'react'
import Slider from 'rc-slider'
import { Button, Dropdown, Form } from 'react-bootstrap'

const Circling = ({ circling, setCircling, setLocation }) => {
  const handleCircling = (e) => {
    setCircling(e)
  }

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let tmpLocation = []
        tmpLocation.push(position.coords.latitude)
        tmpLocation.push(position.coords.longitude)
        setLocation(tmpLocation)
      })
    }
  }
  return (
    <Dropdown autoClose='outside'>
      <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
        Umkreis
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <div className='p-3 text-center'>
          <Form>
            <Form.Group className='mb-3' controlId='zip'>
              <Form.Label>Postleitzahl</Form.Label>
              <Form.Control type='text' placeholder='12345' />
            </Form.Group>
            <Form.Group className='mb-3' controlId='locate'>
              <Button
                variant='secondary'
                className='w-100'
                onClick={handleLocate}
              >
                Orte mich
              </Button>
            </Form.Group>
          </Form>
          <Slider
            allowCross={false}
            style={{ minWidth: '15rem' }}
            min={0}
            max={500}
            step={50}
            defaultValue={circling}
            onChange={handleCircling}
          />
          <div className='mt-2'>
            <b>{`bis zu ${circling}km`}</b>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default Circling
