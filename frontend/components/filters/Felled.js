import React, { useState } from 'react'
import { Dropdown, Form } from 'react-bootstrap'

const Felled = ({ felled, setFelled }) => {
  const handleSwitchChange = (e) => {
    if (e.target.checked) {
      setFelled(true)
      console.log(felled)
    } else {
      setFelled(false)
      console.log(felled)
    }
  }
  return (
    <div className='p-3 text-center'>
      <Form.Check
        type='switch'
        id='felledSwitch'
        label={felled ? 'Baum bereits gefällt' : 'Baum nicht gefällt'}
        onChange={handleSwitchChange}
        name='felled'
      />
    </div>
  )
}

export default Felled
