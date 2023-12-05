import React, { useState } from 'react'
import useAPIData from '../../api.config/useAPIData'

function SlotHeading({ type, title, colId, startTime, endTime }) {
  const { updateItem } = useAPIData()

  const [columnTitle, setColumnTitle] = useState(title)
  const [columnStartTime, setColumnStartTime] = useState(startTime)
  const [columnEndTime, setColumnEndTime] = useState(endTime)

  function convertToTimeString(num) {
    const formattedNum = num.toString().padStart(4, '0')
    let timeString
    if (formattedNum.length === 4) {
      timeString = `${formattedNum.slice(0, 2)}:${formattedNum.slice(2)}`
    } else if (formattedNum.length === 3) {
      timeString = `0${formattedNum.slice(0, 1)}:${formattedNum.slice(1)}`
    }
    // else {
    //   throw new Error('Number must be between 0 and 9999')
    // }
    return timeString
  }

  const handleColumnTitle = (e) => {
    const title = e.target.value
    setColumnTitle(title)
    updateItem(
      'HRS_Column',
      colId,
      {
        name: title,
      },
      true
    )
  }
  const handleColumnStartTime = (e) => {
    const sTime = e.target.value
    setColumnStartTime(sTime)
    if (sTime != null && sTime !== undefined) {
      var temp = String(sTime).split(':')
      temp = temp[0] + temp[1]
      updateItem(
        'HRS_Column',
        colId,
        {
          start_time: temp,
        },
        true
      )
    }
  }
  const handleColumnEndTime = (e) => {
    const eTime = e.target.value
    setColumnEndTime(eTime)
    // console.log(e.target.value)
    var temp = String(eTime).split(':')
    if (eTime != null && eTime !== undefined) {
      // add check for null or undefined
      temp = temp[0] + temp[1]
      updateItem(
        'HRS_Column',
        colId,
        {
          end_time: temp,
        },
        true
      )
    }
  }
  // console.log('ColId' + colId, columnTime, columnTitle)

  if (type == 'row') {
    return (
      <div className="h-20 w-48 m-3 flex justify-center items-center rounded-lg bg-secondary">
        {title}
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center w-48 p-1 m-0.5 bg-secondary rounded-lg">
        <input
          type="text"
          placeholder="Column Title"
          onChange={handleColumnTitle}
          value={columnTitle}
          className="w-40 my-0.5 text-center rounded-lg"
        />
        <div className="w-full px-[0.75rem] flex justify-between">
          <label htmlFor="">Start Time: </label>
          <input
            type="time"
            placeholder="Column Start Time"
            onChange={handleColumnStartTime}
            value={convertToTimeString(columnStartTime)}
            className="w-20 my-0.5 text-center rounded-lg"
          />
        </div>
        <div className="w-full px-[0.75rem] flex justify-between">
          <label htmlFor="">End Time:</label>
          <input
            type="time"
            placeholder="Column End Time"
            onChange={handleColumnEndTime}
            value={convertToTimeString(columnEndTime)}
            className="w-20 my-0.5 text-center rounded-lg"
          />
        </div>
      </div>
    )
  }
}

export default SlotHeading
