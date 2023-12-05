import ScheduleItem from '@/components/ScheduleItem'
import useAPIData from '../../../../api.config/useAPIData'
import { useEffect, useState } from 'react'
import AddIcon from '@/svg/AddIcon'
import Link from 'next/link'

function Index() {
  const { getItems } = useAPIData()
  const [scheduleItems, setScheduleItems] = useState([])

  useEffect(() => {
    const team = Number(localStorage.getItem('team'))
    async function fetchData() {
      const response = await getItems(
        'HRS_Schedule_Defination',
        undefined,
        undefined,
        undefined,
        { team: team },
        undefined,
        undefined,
        true
      )
      const data = response.data
      setScheduleItems(data)
    }

    fetchData()
  }, [])
  // console.log(scheduleItems)

  return (
    <>
      <div className="h-[85vh] relative">
        <div className="flex flex-wrap justify-evenly">
          {scheduleItems.map((scheduleItem) => {
            return (
              <ScheduleItem
                key={scheduleItem.id}
                scheduleId={scheduleItem.id}
                title={scheduleItem.title}
                shortcode={scheduleItem.shortcode}
                session={scheduleItem.session}
              />
            )
          })}
        </div>
        <Link href="createSchedule">
          <div className="absolute right-0 bottom-0 cursor-pointer flex justify-center py-4 px-8 text-primaryDark bg-light rounded-xl hover:text-primaryDark hover:bg-gray-300">
            <AddIcon /> Create Schedule
          </div>
        </Link>
      </div>
    </>
  )
}

export default Index
