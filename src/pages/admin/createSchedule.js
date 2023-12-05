import React, { useEffect, useState } from 'react'
import useAPIData from '../../../api.config/useAPIData'
import { useRouter } from 'next/router'

function CreateSchedule() {
  var scheduleId = -1
  const router = useRouter()
  const [allProfiles, setAllProfiles] = useState([])
  const [profile, setProfile] = useState({})
  const [team, setTeam] = useState('')
  const { getItems, createItem } = useAPIData()

  const weekDay = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thrusday',
    'Friday',
    'Saturday',
  ]

  useEffect(() => {
    setTeam(localStorage.getItem('team'))

    async function fetchData() {
      const response = await getItems(
        'HRS_ColumnProfile',
        ['id', 'name', 'number_of_column'],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true
      )
      const data = response.data
      // console.log(data[0])
      setAllProfiles(data)
      setProfile(data[0])
    }

    fetchData()
  }, [])

  const handleCreateSchedule = async (e) => {
    e.preventDefault()
    const data = new FormData(e.target)

    const title = data.get('scheduleName')
    const session = data.get('session')
    const format = data.get('format')
    const profileId = data.get('profile')
    const team = localStorage.getItem('team')
    const shortcode = title.toLocaleUpperCase()

    let number_of_rows = -1
    if (format === 'Day') {
      number_of_rows = 6
    } else {
      number_of_rows = 1
    }

    const newSchedule = {
      title,
      shortcode,
      session,
      number_of_rows,
      profile: profileId,
      team,
    }

    await createItem('HRS_Schedule_Defination', newSchedule, true)

    new Promise(async (resolve) => {
      const response = await getItems(
        'HRS_Schedule_Defination',
        undefined,
        undefined,
        undefined,
        {
          title: newSchedule.title,
          shortcode: newSchedule.shortcode,
          session: newSchedule.session,
        },
        undefined,
        undefined,
        true
      )
      const data = response.data
      // console.log(data[0].id)
      resolve(data[0])
    })
      .then(async (data) => {
        scheduleId = data.id

        for (var i = 0; i < profile.number_of_column; i++) {
          const newColumn = {
            name: '',
            start_time: 0,
            end_time: 0,
            profile: profile.id,
            Schedule: data.id,
          }

          await createItem('HRS_Column', newColumn, true)
        }

        for (var i = 0; i < number_of_rows; i++) {
          if (format === 'Day') {
            var newRow = {
              type: 'Day',
              day: weekDay[i],
              date: 0,
              schedule: data.id,
            }
          }
          // if (format === 'Date')
          // add this code here********************************************************
          createItem('HRS_Row', newRow, true)
        }
      })
      .then(async () => {
        const responseCol = await getItems(
          'HRS_Column',
          undefined,
          undefined,
          undefined,
          { Schedule: scheduleId },
          undefined,
          undefined,
          true
        )
        const dataCol = responseCol.data
        const responseRow = await getItems(
          'HRS_Row',
          undefined,
          undefined,
          undefined,
          { schedule: scheduleId },
          undefined,
          undefined,
          true
        )
        const dataRow = responseRow.data
        return [dataCol, dataRow]
      })
      .then((data) => {
        const [dataCol, dataRow] = data
        const work = null
        const venue = null
        const human = null

        dataCol.forEach((col) => {
          dataRow.forEach((row) => {
            const newSlot = {
              work,
              venue,
              human,
              row: row.id,
              column: col.id,
            }
            createItem('HRS_Slot', newSlot, true)
          })
        })
      })

    router.push('/admin')
  }

  return (
    <div className="h-[70vh] w-[35vw] relative m-auto my-16 flex flex-col items-center bg-secondary rounded-3xl shadow-lg">
      <h1 className="text-2xl font-bold m-12">New Schedule Details</h1>

      <form className="w-[70%]" onSubmit={handleCreateSchedule} method="post">
        <div className="w-full p-4 flex justify-between font-semibold">
          <label htmlFor="teamNumber">Team Number: </label>
          <input
            className="p-0.5 rounded-lg"
            id="teamNumber"
            name="teamNumber"
            defaultValue={team}
            readOnly={true}
          />
        </div>

        <div className="w-full p-4 flex justify-between font-semibold">
          <label htmlFor="scheduleName">Schedule Name: </label>
          <input
            className="p-0.5 rounded-lg"
            id="scheduleName"
            name="scheduleName"
            required
          />
        </div>

        <div className="w-full p-4 flex justify-between font-semibold">
          <label htmlFor="session">Session: </label>
          <select
            className="rounded-lg p-0.5"
            name="session"
            id="session"
            defaultValue={new Date().getFullYear()}
          >
            {Array(50)
              .fill(0)
              .map((_, index) => {
                const year = 2000 + index
                return (
                  <option className="p-0.5 rounded-lg" key={year} value={year}>
                    {year} - {year + 1}
                  </option>
                )
              })}
          </select>
        </div>
        <div className="w-full p-4 flex justify-between font-semibold">
          <label htmlFor="format">Format: </label>
          <select className="rounded-lg p-0.5" name="format" id="format">
            <option className="p-0.5 rounded-lg" value="Day">
              Day
            </option>
            <option className="p-0.5 rounded-lg" value="Date">
              Date
            </option>
          </select>
        </div>
        <div className="w-full p-4 flex justify-between font-semibold">
          <label htmlFor="profile">Profile: </label>
          <select
            className="rounded-lg p-0.5"
            name="profile"
            id="profile"
            onChange={(e) => setProfile(e.target.value)}
          >
            {allProfiles.map((pf) => {
              return (
                <option
                  className="p-0.5"
                  id={pf.id}
                  key={pf.id}
                  defaultValue={pf.id}
                  value={pf.id}
                >
                  {pf.name}
                </option>
              )
            })}
          </select>
        </div>
        <button
          className="absolute right-8 bottom-8 cursor-pointer flex justify-center py-4 px-8 text-primaryDark bg-light rounded-xl hover:text-primaryDark hover:bg-gray-300"
          type="submit"
        >
          + Create Schedule
        </button>
      </form>
    </div>
  )
}

export default CreateSchedule
