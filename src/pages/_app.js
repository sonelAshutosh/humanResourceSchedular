import '@/styles/globals.css'
import { useState, useEffect } from 'react'
import useAPIAuth from '../../api.config/useAPIAuth'
import { useRouter } from 'next/router'
import LoadingBar from 'react-top-loading-bar'
import Navbar from '@/components/Navbar'

export default function App({ Component, pageProps }) {
  const [userProfile, setUserProfile] = useState(false)
  const [progress, setProgress] = useState(0)

  const { loginStatus } = useAPIAuth()
  const router = useRouter()

  const handleUserProfile = () => {
    setUserProfile(!userProfile)
  }

  // This function sometimes run some times dont run
  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setProgress(40)
    })
    router.events.on('routeChangeComplete', () => {
      setProgress(100)
    })

    setUserProfile(false)
  }, [loginStatus])

  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />)
  }

  return (
    <>
      <LoadingBar
        color="#c957bc"
        progress={progress}
        height={5}
        waitingTime={400}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="h-[100vh] w-full px-16 py-4 flex flex-col bg-secondaryDark">
        <div className="flex">
          <Navbar />
        </div>
        <div className="">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  )
}
