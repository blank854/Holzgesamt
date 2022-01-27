import React from 'react'
import Item from './Item'
import ItemList from './ItemList'

const Recommendations = ({ recommendations }) => {
  return (
    <div className='Recommendations my-5'>
      <h4 className='text-primary mb-5'>
        <b>Diese Produkte könnten Ihnen auch gefallen</b>
      </h4>
      <ItemList productList={recommendations} />
    </div>
  )
}

export default Recommendations
