import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import React from 'react'
import useAPIData from '../../../../api.config/useAPIData'

import SlotHeading from '@/components/SlotHeading'
import Slot from '@/components/Slot'

function ScheduleItem() {
  const { getItems } = useAPIData()

  const [heading, setHeading] = useState()
  const [scheduleId, setScheduleId] = useState(-1)

  const [row, setRow] = useState([])
  const [col, setCol] = useState([])

  const [tasks, setTasks] = useState([])
  const [venues, setVenues] = useState([])
  const [humans, setHumans] = useState([])

  const [slots, setSlots] = useState([])

  const router = useRouter()
  const { sid } = router.query
  const param = (sid + '').split('_')
  // console.log('param', param)

  const fetchSlots = async () => {
    const rowsResponse = await getItems(
      'HRS_Row',
      undefined,
      undefined,
      undefined,
      { schedule: scheduleId },
      undefined,
      undefined,
      true
    )
    const colResponse = await getItems(
      'HRS_Column',
      undefined,
      undefined,
      undefined,
      { Schedule: scheduleId },
      undefined,
      undefined,
      true
    )
    const rowData = rowsResponse.data
    const colData = colResponse.data

    const slot = []
    for (let i = 0; i < rowData.length; i++) {
      const response = await getItems(
        'HRS_Slot',
        undefined,
        undefined,
        undefined,
        { row: rowData[i].id },
        'id',
        undefined,
        true
      )
      const data = response.data
      slot.push(data)
    }
    setSlots(slot)
    setCol(colData)
    setRow(rowData)
    // console.log(slot)
  }

  async function fetchData() {
    const team = Number(localStorage.getItem('team'))
    const responseTask = await getItems(
      'HRS_Work',
      undefined,
      undefined,
      undefined,
      { team: team },
      undefined,
      undefined,
      true
    )
    const dataTask = responseTask.data
    const responseVenue = await getItems(
      'HRS_Venue',
      undefined,
      undefined,
      undefined,
      { team: team },
      undefined,
      undefined,
      true
    )
    const dataVenue = responseVenue.data
    const responseHuman = await getItems(
      'HRS_HumanResource',
      undefined,
      undefined,
      undefined,
      { team: team },
      undefined,
      undefined,
      true
    )
    const dataHuman = responseHuman.data
    setTasks(dataTask)
    setVenues(dataVenue)
    setHumans(dataHuman)
  }

  useEffect(() => {
    if (param.length >= 2) {
      setHeading(param[0])
      setScheduleId(param[1])
    }
  }, [param])

  useEffect(() => {
    if (scheduleId !== -1) {
      fetchSlots()
    }
  }, [scheduleId])
  // console.log(heading, scheduleId)

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="w-full flex p-2">
      <div className="flex flex-col items-center justify-center">
        <div className="h-24 w-48 flex justify-center items-center rounded-lg bg-secondary">
          {heading}
        </div>
        <div className="">
          {/* <div className="flex flex-col justify-between"> */}
          {row.map((r) => {
            return <SlotHeading type="row" key={r.id} title={r.day} />
          })}
        </div>
      </div>
      <div className="">
        <div className="flex">
          {col.map((c) => {
            return (
              <SlotHeading
                type="col"
                colId={c.id}
                key={c.id}
                title={c.name}
                startTime={c.start_time}
                endTime={c.end_time}
              />
            )
          })}
        </div>
        <div className="">
          {slots.map((row, index) => (
            <div key={index} className="flex">
              {row.map((colItem) => (
                <Slot
                  key={`${colItem.row}_${colItem.column}`}
                  slotId={colItem.id}
                  rowId={colItem.row}
                  columnId={colItem.column}
                  workId={colItem.work}
                  venueId={colItem.venue}
                  humanId={colItem.human}
                  tasksList={tasks}
                  venuesList={venues}
                  humansList={humans}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ScheduleItem
