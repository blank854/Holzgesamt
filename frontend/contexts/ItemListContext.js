import axios from 'axios'
import React, { useContext, useState, useEffect } from 'react'

const ItemListContext = React.createContext()

export function useItemList() {
  return useContext(ItemListContext)
}

export const ItemListProvider = ({ children }) => {
  const [itemList, setItemList] = useState([])
  const [loading, setLoading] = useState()

  const getAllItems = () => {}
  const value = {
    itemList,
    setItemList,
  }

  return (
    <ItemListContext.Provider value={value}>
      {!loading && children}
    </ItemListContext.Provider>
  )
}
