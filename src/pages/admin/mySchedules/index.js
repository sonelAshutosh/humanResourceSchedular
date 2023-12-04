import ScheduleItem from '@/components/ScheduleItem'
import useAPIData from '../../../../api.config/useAPIData'
import { useEffect, useState } from 'react'

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
  )
}

export default Index
