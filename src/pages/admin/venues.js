import React, { useState, useEffect } from 'react'
import DeleteIcon from '@/svg/DeleteIcon'
import AddIcon from '@/svg/AddIcon'
import useAPIData from '../../../api.config/useAPIData'

function Venues() {
  const { getItems, createItem, deleteItem } = useAPIData()

  const [venues, setVenues] = useState([])

  useEffect(() => {
    async function fetchData() {
      const team = localStorage.getItem('team')
      const response = await getItems(
        'HRS_Venue',
        ['id', 'name', 'shortname'],
        undefined,
        undefined,
        { team: team },
        undefined,
        undefined,
        true
      )
      const data = await response.data
      setVenues(data)
    }

    fetchData()
  }, [])

  const handleVenueAddition = (e) => {
    e.preventDefault()

    const data = new FormData(e.target)

    const venueName = data.get('venueName')
    const venueCode = data.get('venueCode')
    const venueTeam = localStorage.getItem('team')

    if (venueName && venueCode) {
      const newVenue = {
        name: venueName,
        shortname: venueCode,
        team: venueTeam,
      }
      setVenues([...venues, newVenue])
      createItem('HRS_Venue', newVenue, true)
    }
  }

  const handleDeleteButtonClick = async (index) => {
    if (confirm('Confirm Deletion ? ')) {
      const venueToDelete = venues[index]
      await deleteItem('HRS_Venue', venueToDelete.id, undefined, true)

      const updatedVenues = [...venues]
      updatedVenues.splice(index, 1)
      setVenues(updatedVenues)
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
                    Venue Name
                  </th>
                  <th className="px-8 py-4 text-center bg-primary">
                    Venue Code
                  </th>
                  <th className="px-8 py-4 text-center bg-primary rounded-tr-3xl rounded-br-3xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {venues.map((venue, index) => (
                  <tr key={index} className="">
                    <td className="text-center px-8 py-2">{venue.name}</td>
                    <td className="text-center px-8 py-2">{venue.shortname}</td>
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
        </div>
        <div className="flex justify-center p-4">
          <form className="flex" onSubmit={handleVenueAddition} method="post">
            <input
              id="venueName"
              name="venueName"
              placeholder="Venue Name"
              className="px-4 mx-2 rounded-3xl"
            />
            <input
              id="venueCode"
              name="venueCode"
              placeholder="Venue Code"
              className="px-4 mx-2 rounded-3xl"
            />
            <button
              type="submit"
              className="flex justify-center py-2 px-4 text-primaryDark bg-light rounded-xl hover:text-primary hover:bg-gray-300 "
            >
              <AddIcon />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Venues
