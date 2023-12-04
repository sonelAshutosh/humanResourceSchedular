import React, { useState, useEffect } from 'react'
import useAPIData from '../../../api.config/useAPIData'

import AddIcon from '@/svg/AddIcon'
import DeleteIcon from '@/svg/DeleteIcon'

function Tasks() {
  const { getItems, createItem, deleteItem } = useAPIData()

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    async function fetchData() {
      const team = localStorage.getItem('team')
      const response = await getItems(
        'HRS_Work',
        ['id', 'name', 'shortcode', 'type'],
        undefined,
        undefined,
        { team: team },
        undefined,
        undefined,
        true
      )
      const data = response.data
      setTasks(data)
    }

    fetchData()
  }, [])

  const handleTaskAddition = async (e) => {
    e.preventDefault()

    const data = new FormData(e.target)

    const taskName = data.get('taskName')
    const taskCode = data.get('taskCode')
    const taskType = data.get('taskType')
    const taskTeam = localStorage.getItem('team')

    if (taskName && taskCode && taskType) {
      const newTask = {
        name: taskName,
        type: taskType,
        shortcode: taskCode,
        team: taskTeam,
      }
      setTasks([...tasks, newTask])
      createItem('HRS_Work', newTask, true)
    }
  }

  const handleDeleteButtonClick = async (index) => {
    // Get the task to be deleted
    if (confirm('Confirm Deletion ? ')) {
      const taskToDelete = tasks[index]

      await deleteItem('HRS_Work', taskToDelete.id, undefined, true)
      const updatedTasks = [...tasks]
      updatedTasks.splice(index, 1)
      setTasks(updatedTasks)
    }
  }

  return (
    <>
      <div className="p-8">
        <div className="flex flex-col items-center">
          <table className="bg-secondary rounded-3xl">
            <thead>
              <tr>
                <th className="px-8 py-4 text-center bg-primary rounded-tl-3xl rounded-bl-3xl">
                  Tasks Name
                </th>
                <th className="px-8 py-4 text-center bg-primary">Tasks Code</th>
                <th className="px-8 py-4 text-center bg-primary">Tasks Type</th>
                <th className="px-8 py-4 text-center bg-primary rounded-tr-3xl rounded-br-3xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td className="text-center px-8 py-2">{task.name}</td>
                  <td className="text-center px-8 py-2">{task.shortcode}</td>
                  <td className="text-center px-8 py-2">{task.type}</td>
                  <td className="text-center px-8 py-2">
                    <button
                      className="flex justify-center py-2 px-4 text-primaryDark bg-light rounded-xl hover:text-primary hover:bg-gray-300"
                      onClick={() => handleDeleteButtonClick(index)}
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center p-4">
          <form className="flex" onSubmit={handleTaskAddition} method="post">
            <input
              id="taskName"
              className="px-4 mx-2 rounded-3xl"
              placeholder="Task Name"
              name="taskName"
            />
            <input
              id="taskCode"
              className="px-4 mx-2 rounded-3xl"
              placeholder="Task Code"
              name="taskCode"
            />
            <input
              id="taskType"
              className="px-4 mx-2 rounded-3xl"
              placeholder="Task Type"
              name="taskType"
            />
            <button
              type="submit"
              className="flex justify-center p-2 mx-4 text-primaryDark bg-light rounded-xl hover:text-primary hover:bg-gray-300"
            >
              <AddIcon />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Tasks
