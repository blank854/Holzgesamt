import React, { useState } from 'react'
import { Dropdown, Form } from 'react-bootstrap'

const Felled = ({ felled, setFelled }) => {
  const handleSwitchChange = (e) => {
    if (e.target.checked) {
      setFelled(true)
    } else {
      setFelled(false)
    }
  }
  return (
    <Dropdown autoClose='outside'>
      <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
        Fällstatus
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <div className='p-3 text-center'>
          <Form>
            <Form.Check
              style={{ minWidth: '15rem' }}
              type='switch'
              id='felledSwitch'
              label={felled ? 'Baum bereits gefällt' : 'Baum nicht gefällt'}
              onChange={handleSwitchChange}
            />
          </Form>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default Felled
