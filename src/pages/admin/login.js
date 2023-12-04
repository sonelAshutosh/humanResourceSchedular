import React, { useState } from 'react'
import { useRouter } from 'next/router'
import useAPIAuth from '../../../api.config/useAPIAuth'
import useAPIData from '../../../api.config/useAPIData'

const Login = () => {
  const { getItems } = useAPIData()
  const { setUser } = useAPIAuth()
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()

    const data = new FormData(e.target)

    const userId = data.get('userId')
    const password = data.get('password')

    const user = { email: userId, password }
    const success = await setUser(user)

    // console.log(user)

    if (success) {
      const email = sessionStorage.getItem('userEmail')
      const userFetch = await getItems(
        'HRS_user',
        ['team'],
        undefined,
        undefined,
        { username: { _eq: email } },
        undefined,
        undefined,
        true
      )
      const team = userFetch.data[0].team

      localStorage.setItem('team', team)

      router.push('/admin')
    } else {
      alert('Incorrect Email / Password')
    }
  }

  return (
    <div className="h-[100vh] w-full p-4 flex text-center bg-[url(../../public/loginBackground.jpg)] bg-cover">
      <div className="h-full w-full flex items-center bg-opacity-40 rounded-3xl	bg-dark text-light">
        <div className="h-full w-[30%] p-4 flex items-center justify-center bg-dark rounded-3xl shadow-2xl">
          <div className="flex flex-col justify-center items-centers">
            <h1 className="text-2xl font-bold text-primary m-8">Log In</h1>
            <form
              onSubmit={handleLogin}
              method="post"
              className=" flex flex-col"
            >
              <input
                type="text"
                id="userId"
                name="userId"
                placeholder="User Id"
                className="m-2 p-2 px-4 rounded-full text-dark bg-gray-200 focus:ring-gray-200 focus:border-gray-200"
              />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="m-2 p-2 px-4 rounded-full text-dark bg-gray-200 focus:ring-gray-200 focus:border-gray-200"
              />
              <button
                className="m-2 my-8 py-2 px-4 rounded-full text-secondaryDark bg-primary hover:bg-primaryDark"
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
        </div>
        <div className="m-auto font-extrabold text-4xl ">HRS Admin</div>
      </div>
    </div>
  )
}

export default Login

Login.getLayout = function PageLayout(page) {
  return <>{page} </>
}
