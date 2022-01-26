import React, { useState } from 'react'
import { Form, ListGroup } from 'react-bootstrap'

const AutoComplete = ({ list, name, placeholder, value = '' }) => {
  const [searchList, setSearchList] = useState([])
  const [selectedItem, setSelectedItem] = useState(value)
  const [showAutocomplete, setShowAutocomplete] = useState(false)

  const handleClickItem = (e) => {
    setSelectedItem(e)
    setShowAutocomplete(false)
  }
  const handleOnBlur = (e) => {
    if (e.relatedTarget) {
      if (e.relatedTarget.parentElement.id !== 'listGroup') {
        setShowAutocomplete(false)
      }
    } else {
      setShowAutocomplete(false)
    }
  }

  const handleSearchList = (e) => {
    setShowAutocomplete(true)
    setSelectedItem(e.target.value)
    const tmpSearchList = list.filter((item) =>
      item.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setSearchList(tmpSearchList)
  }
  return (
    <div>
      <Form.Control
        className=' w-100'
        type='text'
        placeholder={placeholder}
        name={name}
        onFocus={() => setShowAutocomplete(true)}
        onBlur={handleOnBlur}
        onChange={handleSearchList}
        value={selectedItem}
      />
      <ListGroup
        className={`position-absolute w-100 ${
          !showAutocomplete ? 'd-none' : ''
        }`}
        style={{ zIndex: '9999', maxHeight: '15rem', overflowY: 'scroll' }}
        id='listGroup'
      >
        {searchList.map((item, index) => (
          <ListGroup.Item
            key={index}
            onClick={() => handleClickItem(item)}
            tabIndex='-1'
            className='pointer'
          >
            {item}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default AutoComplete
