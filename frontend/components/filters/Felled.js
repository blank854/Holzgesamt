import React, { useState, useEffect } from 'react'
import { Dropdown, Form } from 'react-bootstrap'
import { FELLING_STATE } from '../../constants/filter_constants'
import { useFilter } from '../../contexts/FilterContext'

const Felled = () => {
  const { getFilter } = useFilter()
  const [felled, setFelled] = useState(
    getFilter(FELLING_STATE) && getFilter(FELLING_STATE).value
  )

  const handleSwitchChange = (e) => {
    setFelled(e.target.checked)
  }
  return (
    <div className='p-3 text-center'>
      <Form.Check
        type='switch'
        id='felledSwitch'
        label={felled ? 'Baum bereits gefällt' : 'Baum nicht gefällt'}
        onChange={handleSwitchChange}
        name='felled'
        checked={felled}
      />
    </div>
  )
}

export default Felled
