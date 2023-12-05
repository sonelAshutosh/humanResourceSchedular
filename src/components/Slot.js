import React, { useEffect, useState } from 'react'
import useAPIData from '../../api.config/useAPIData'

function Slot(props) {
  const { slotId, rowId, columnId, workId, venueId, humanId } = props
  const { tasksList, venuesList, humansList } = props
  const { updateItem } = useAPIData()

  const handleTaskChange = (e) => {
    const temp = e.target.value
    updateItem('HRS_Slot', slotId, { work: temp }, true)
  }
  const handleVenueChange = (e) => {
    const temp = e.target.value
    updateItem('HRS_Slot', slotId, { venue: temp }, true)
  }
  const handleHumanChange = (e) => {
    const temp = e.target.value
    updateItem('HRS_Slot', slotId, { human: temp }, true)
  }

  return (
    <div
      id={slotId}
      key={slotId}
      className="w-48 p-1 m-0.5 flex flex-col items-center bg-secondary rounded-lg"
    >
      <div className="w-full flex justify-center">
        <select
          onChange={handleTaskChange}
          defaultValue={workId}
          placeholder="Task"
          className="w-40 rounded-md my-0.5"
        >
          <option value=""></option>
          {tasksList.map((task) => {
            return (
              <option id={task.id} key={task.id} value={task.id}>
                {task.name}
              </option>
            )
          })}
        </select>
      </div>
      <div className="w-full flex justify-center">
        <select
          onChange={handleVenueChange}
          defaultValue={venueId}
          placeholder="Venue"
          className="w-40 rounded-md my-0.5"
        >
          <option value=""></option>
          {venuesList.map((venue) => {
            return (
              <option id={venue.id} key={venue.id} value={venue.id}>
                {venue.shortname}
              </option>
            )
          })}
        </select>
      </div>
      <div className="w-full flex justify-center">
        <select
          onChange={handleHumanChange}
          defaultValue={humanId}
          placeholder="Human"
          className="w-40 rounded-md my-0.5"
        >
          <option value=""></option>
          {humansList.map((human) => {
            return (
              <option id={human.id} key={human.id} value={human.id}>
                {human.name}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}

export default Slot
