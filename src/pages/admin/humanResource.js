import React, { useState, useEffect } from 'react'
import DeleteIcon from '@/svg/DeleteIcon'
import AddIcon from '@/svg/AddIcon'
import useAPIData from '../../../api.config/useAPIData'

function HumanResource() {
  const { getItems, createItem, deleteItem } = useAPIData()

  // State variables for humanResource, name, code, and type
  const [humanResource, setHumanResource] = useState([])

  useEffect(() => {
    async function fetchData() {
      const team = localStorage.getItem('team')
      const response = await getItems(
        'HRS_HumanResource',
        ['id', 'name', 'shortname'],
        undefined,
        undefined,
        { team: team },
        undefined,
        undefined,
        true
      )
      const data = response.data
      setHumanResource(data)
      // console.log(data)
    }
    fetchData()
  }, [])

  // Function to handle adding a new task
  const handleAddButtonClick = async () => {
    if (name && shortname) {
      // Only add the task if all three inputs are filled
      const newHuman = {
        name,
        shortname,
        team,
      }
      setHumanResource([...humanResource, newHuman])
      setName('')
      setShortname('')

      createItem('HRS_HumanResource', newHuman, true)
    }
  }

  const handleHumanResourceAddition = (e) => {
    e.preventDefault()

    const data = new FormData(e.target)

    const humanName = data.get('humanName')
    const humanCode = data.get('humanCode')
    const humanTeam = localStorage.getItem('team')

    if (humanName && humanCode) {
      const newHuman = {
        name: humanName,
        shortname: humanCode,
        team: humanTeam,
      }
      setHumanResource([...humanResource, newHuman])
      createItem('HRS_HumanResource', newHuman, true)
    }
  }

  // Function to handle deleting a task
  const handleDeleteButtonClick = async (index) => {
    if (confirm('Confirm Deletion ? ')) {
      const humanToDelete = humanResource[index]

      await deleteItem('HRS_HumanResource', humanToDelete.id, undefined, true)
      const updatedHumanResource = [...humanResource]
      updatedHumanResource.splice(index, 1)
      setHumanResource(updatedHumanResource)
    }
  }

  return (
    <>
      <div className="p-8">
        <div className="flex flex-col items-center">
          <div className="bg-secondary rounded-3xl">
            <table>
              <thead>
                <tr>
                  <th className="px-8 py-4 text-center bg-primary rounded-tl-3xl rounded-bl-3xl">
                    Name
                  </th>
                  <th className="px-8 py-4 text-center bg-primary">
                    Short Name
                  </th>
                  <th className="px-8 py-4 text-center bg-primary rounded-tr-3xl rounded-br-3xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {humanResource.map((human, index) => (
                  <tr key={index} className="">
                    <td className="text-center px-8 py-2">{human.name}</td>
                    <td className="text-center px-8 py-2">{human.shortname}</td>
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
            <form
              className="flex"
              onSubmit={handleHumanResourceAddition}
              method="post"
            >
              <input
                id="humanName"
                name="humanName"
                placeholder="Name"
                className="px-4 mx-2 rounded-3xl"
              />
              &nbsp;
              <input
                id="humanCode"
                name="humanCode"
                placeholder="Short Name"
                className="px-4 mx-2 rounded-3xl"
              />
              <button
                type="submit"
                className="flex justify-center py-2 px-4 text-primaryDark bg-light rounded-xl hover:text-primary hover:bg-gray-300"
              >
                <AddIcon />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default HumanResource
