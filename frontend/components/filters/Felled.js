import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'

const Felled = ({ felled, setFelled }) => {
  const handleClick = (value) => {
    setFelled(value)
  }
  return (
    <div className='p-3 text-center'>
      <Row>
        <Col>
          <Button
            variant={felled ? 'primary' : 'secondary'}
            className='text-nowrap w-100'
            onClick={() => handleClick(true)}
          >
            Gefällt
          </Button>
        </Col>
        <Col>
          <Button
            variant={felled === false ? 'primary' : 'secondary'}
            className='text-nowrap w-100'
            onClick={() => handleClick(false)}
          >
            Nicht gefällt
          </Button>
        </Col>
        <Col>
          <Button
            variant={felled === null ? 'primary' : 'secondary'}
            className='text-nowrap w-100'
            onClick={() => handleClick(null)}
          >
            Egal
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default Felled
