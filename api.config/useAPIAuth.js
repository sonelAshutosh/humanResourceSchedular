import { useEffect, useRef, useState } from 'react'
import { getAuthURL } from './api.config'
import Cookies from 'js-cookie'

//Refresh access token every 5 minutes
const REFRESH_DELAY = 30000

//Manage token with cookies.
const getLoginToken = () => {
  const token = {
    accessToken: Cookies.get('accessToken'),
    refreshToken: Cookies.get('refreshToken'),
  }
  return token
}
const setLoginToken = (token) => {
  if (!!token) {
    token.expires = new Date(new Date().getTime() + token.expires)
    Cookies.set('accessToken', token.access_token, { expires: token.expires })
    Cookies.set('refreshToken', token.refresh_token)
  }
}
const clearLoginToken = () => {
  Cookies.remove('accessToken')
  Cookies.remove('refreshToken')
}

//If invalidate = true, this function will logout from server and clear tokens
const fetchLoginToken = (url, options, invalidate = false) => {
  return fetch(url, options)
    .then((response) => {
      if (!response.ok)
        throw new Error('Error reaching server. Request failed!')
      if (response.status !== 204) return response.json()
      else return null
    })
    .then((data) => {
      if (!invalidate) {
        const token = data.data
        if (!!token.access_token) setLoginToken(token)
        else return false
      } else clearLoginToken()
      return true
    })
    .catch((e) => {
      clearLoginToken()
      console.error(e)
      return false
    })
}

export default function useAPIAuth() {
  const [loginStatus, setLoginStatus] = useState(
    () => !!getLoginToken().accessToken
  )
  //const [userEmail, setUserEmail] = useState('');
  const [enableTimer, setEnableTimer] = useState()
  const interval = useRef(null)

  useEffect(() => {
    // Perform localStorage action
    setEnableTimer(localStorage.getItem('refreshTimer'))
  }, [])

  const setUser = async (user) => {
    if (!!user) {
      let result = await login(user).then((success) => {
        setLoginStatus(success)
        setEnableTimer(success)
        localStorage.setItem('refreshTimer', success)
        return success
      })
      if (!!result) sessionStorage.setItem('userEmail', user.email)
      return Promise.resolve(result)
    }
    return false
  }

  useEffect(() => {
    if (enableTimer) {
      interval.current = setInterval(() => {
        //console.log('checking for login..');
        checkAndUpdateLogin().then((status) => {
          setLoginStatus(status)
          if (!status) {
            setEnableTimer(status)
            localStorage.setItem('refreshTimer', status)
          }
        })
      }, REFRESH_DELAY)
    } else clearInterval(interval.current)
    return () => clearInterval(interval.current)
  }, [enableTimer])

  const checkAndUpdateLogin = async () => {
    let { accessToken, refreshToken } = getLoginToken()
    if (!!accessToken) return true
    else {
      if (!!refreshToken) {
        let result = await fetchLoginToken(getAuthURL() + 'refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken, mode: 'json' }),
        })
        if (result) return result
        else {
          logout()
          return false
        }
      } else logout()
      return false
    }
  }

  const login = async (user) => {
    //login and update the access token.
    if (!!user.email && !!user.password) {
      return await fetchLoginToken(getAuthURL() + 'login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...user, mode: 'json' }),
      })
    } else {
      console.error('User details were not set before trying to log in. ', user)
      return false
    }
  }

  const logout = async () => {
    let { accessToken, refreshToken } = getLoginToken()
    if (!!refreshToken) {
      return await fetchLoginToken(
        getAuthURL() + 'logout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        },
        true
      ).then((res) => {
        setLoginStatus(false)
        setEnableTimer(false)
        localStorage.setItem('refreshTimer', false)
        return res
      })
    } else {
      clearLoginToken()
      setLoginStatus(false)
      setEnableTimer(false)
      localStorage.setItem('refreshTimer', false)
      return true
    }
  }

  const getAccessToken = () => {
    let { accessToken, refreshToken } = getLoginToken()
    if (!!accessToken) {
      return accessToken
    } else {
      return null
    }
  }

  function getAuthHeader(customToken = null) {
    if (customToken) return { access_token: customToken }
    else if (loginStatus) return { access_token: getAccessToken() } //'Bearer '+
    else return undefined
  }

  function getAuthURLParam(customToken = null) {
    if (customToken) return 'access_token=' + customToken
    else if (loginStatus) return 'access_token=' + getAccessToken()
    else return ''
  }

  function getUserEmail() {
    if (loginStatus) {
      let userEmail = sessionStorage.getItem('userEmail')
      return { email: userEmail }
    } else return undefined
  }

  return {
    loginStatus: loginStatus,
    setUser: setUser,
    logoutUser: logout,
    getAuthHeader: getAuthHeader,
    getAuthURLParam: getAuthURLParam,
    getUserEmail: getUserEmail,
  }
}
