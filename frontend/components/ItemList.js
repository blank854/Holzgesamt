import React from 'react'
import { Card } from 'react-bootstrap'
import items from '../lib/items'
import Link from 'next/link'
import Item from './Item'

const ItemList = ({ productList }) => {
  return (
    <div className='ItemList my-3 gap-3'>
      {productList.map((item) => (
        <Item
          item={item.offer ? item.offer : item}
          key={item.offer ? item.offer._id : item._id}
        />
      ))}
    </div>
  )
}

export default ItemList
