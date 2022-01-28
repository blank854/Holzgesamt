import axios from 'axios'
import React, { useContext, useState, useEffect } from 'react'
import { useMessage } from './MessageContext'

const UserContext = React.createContext()

export function useUser() {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState()
  const [accountInformation, setAccountInformation] = useState({})
  const [favorites, setFavorites] = useState([])

  const { setMessage, setVariant } = useMessage()

  const getUser = (createMessage = true) => {
    if (typeof window == 'undefined') return null
    if (typeof getCookie('user') == 'undefined') {
      if (createMessage) {
        setMessage('Bitte melde dich an, um fortzufahren.')
        setVariant('warning')
      }
      return null
    }

    return JSON.parse(getCookie('user'))
  }

  const getAccountInformation = async () => {
    setMessage('')

    if (!getUser()) return
    var config = {
      method: 'get',
      url: 'http://localhost:4000/user',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUser().token}`,
      },
    }

    axios(config)
      .then((response) => {
        setAccountInformation(response.data.result)
      })
      .catch((e) => {
        setMessage(e.response.data.message)
        setVariant('danger')
      })
  }

  const logout = () => {
    setMessage('')
    if (typeof window == 'undefined') return
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    setLoggedIn(false)
  }

  const login = async (user) => {
    if (typeof window == 'undefined') return
    var config = {
      method: 'post',
      url: 'http://localhost:4000/user/login',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(user),
    }

    axios(config)
      .then((response) => {
        document.cookie = `user=${JSON.stringify(
          response.data
        )}; expires=${new Date(response.data.expires)}; path=/`
        getAccountInformation().then(() => setLoggedIn(true))
        setMessage('')
      })
      .catch((e) => {
        setMessage(e.response.data.message)
        setVariant('warning')
      })
  }

  const getCookie = (cName) => {
    const name = cName + '='
    const cDecoded = decodeURIComponent(document.cookie) //to be careful
    const cArr = cDecoded.split('; ')
    let res
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length)
    })
    return res
  }

  const toggleFavorite = async (offerId) => {
    setMessage('')
    if (!loggedIn) {
      setMessage(
        'Du musst dich anmelden, um ein Inserat zu deinen Favoriten hinzufügen zu können.'
      )
      setVariant('info')
      return
    }

    getFavorites().then((tmpFavorites) => {
      const config = {
        method: 'put',
        url: 'http://localhost:4000/user/favorite',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getUser().token}`,
        },
        data: { favorite: offerId },
      }

      if (tmpFavorites && tmpFavorites.some((e) => e._id === offerId)) {
        config.method = 'delete'
      }

      axios(config)
        .then(() => {
          getFavorites()
        })
        .catch((e) => {
          // setMessage(e.response.data.message)
          // TODO Timo muss Message mitliefern
          setVariant('danger')
        })
    })
  }

  const getFavorites = async () => {
    setMessage('')
    if (!getUser()) {
      setMessage(
        'Du musst dich anmelden, um deine Favoriten einsehen zu können.'
      )
      setVariant('info')
      return
    }

    var config = {
      method: 'get',
      url: 'http://localhost:4000/user',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUser().token}`,
      },
    }

    return axios(config)
      .then((response) => {
        setFavorites(response.data.result.favorites)
        return response.data.result.favorites
      })
      .catch((e) => {
        setMessage(e.response.data.message)
        setVariant('danger')
      })
  }

  const updateUser = (userData) => {
    setMessage('')
    if (!loggedIn) {
      setMessage(
        'Du musst dich anmelden, um deine Nutzerdaten bearbeiten zu können.'
      )
      setVariant('info')
      return
    }

    const config = {
      method: 'put',
      url: 'http://localhost:4000/user',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUser().token}`,
      },
      data: { _id: getUser().userId, ...userData },
    }

    axios(config)
      .then(() => {
        getAccountInformation()
        setMessage('Änderungen erfolgreich gespeichert.')
        setVariant('success')
      })
      .catch((e) => {
        setMessage(e.response.data.message)
        setVariant('danger')
      })
  }

  useEffect(() => {
    setLoggedIn(getUser(false) === null ? false : true)
  }, [])

  const value = {
    login,
    logout,
    getUser,
    loggedIn,
    getAccountInformation,
    accountInformation,
    toggleFavorite,
    updateUser,
    getFavorites,
    favorites,
  }

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  )
}
