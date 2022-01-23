import React from 'react'
import { Button } from 'react-bootstrap'

const ApplyFilter = ({ filterData }) => {
  return (
    <Button variant='primary' type='submit' className='mb-3 w-100'>
      Filter anwenden
    </Button>
  )
}

export default ApplyFilter
