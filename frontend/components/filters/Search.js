import React from 'react'
import { Button, FormControl, InputGroup } from 'react-bootstrap'

const Search = ({ search, setSearch }) => {
  const handleChange = (e) => {
    setSearch(e.target.value)
  }
  return (
    <InputGroup className='mb-3' style={{ maxWidth: '20rem' }}>
      <FormControl
        placeholder='z.B. Blaupappel'
        aria-label='z.B. Blaupappel'
        aria-describedby='search'
        value={search}
        onChange={handleChange}
      />
      <Button variant='secondary' id='search'>
        Suchen
      </Button>
    </InputGroup>
  )
}

export default Search
