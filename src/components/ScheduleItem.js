import React from 'react'
import { useRouter } from 'next/router'

function ScheduleItem(props) {
  const { scheduleId, title, shortcode, session } = props

  const router = useRouter()
  const handleSchedule = () => {
    router.push(`/admin/mySchedules/${title}_${scheduleId}`)
  }

  return (
    <div
      key={scheduleId}
      className="bg-secondary py-8 m-4 cursor-pointer rounded-3xl shadow-md"
      onClick={handleSchedule}
    >
      <div className="text-primaryDark text-md font-medium px-12">
        {/* <span> Title:</span> */}
        {title}
      </div>
      <div className="text-primaryDark text-md font-medium px-12">
        {/* <span> Code:</span> */}
        {shortcode}
      </div>
      <div className="text-primaryDark text-md font-medium px-12">
        {/* <span> Session:</span> */}
        {session} - {session + 1}
      </div>
    </div>
  )
}

export default ScheduleItem
