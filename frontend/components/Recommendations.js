import React from 'react'
import Item from './Item'
import ItemList from './ItemList'

const Recommendations = ({ recommendations }) => {
  return (
    <div className='Recommendations my-5'>
      <h4>Diese Produkte könnten Ihnen auch gefallen</h4>
      <ItemList productList={recommendations} />
    </div>
  )
}

export default Recommendations
