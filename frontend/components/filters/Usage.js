import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useFilter } from '../../contexts/FilterContext'
import AutoComplete from '../AutoComplete'

const Usage = () => {
  const [usages, setUsages] = useState([])
  const { getUsage } = useFilter()
  useEffect(() => {
    const config = {
      method: 'get',
      url: 'http://localhost:4000/statistics/usages',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    axios(config).then((response) => {
      setUsages(response.data.SendUsages)
    })
  }, [])
  return (
    <AutoComplete
      list={usages}
      name='usage'
      placeholder='Verwendungszweck'
      value={getUsage()}
    />
  )
}

export default Usage
