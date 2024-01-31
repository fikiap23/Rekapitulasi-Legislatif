import Village from '../models/villageModel.js'
import Tps from '../models/tpsModel.js'
import apiHandler from '../utils/apiHandler.js'

const tpsController = {
  bulkTps: async (req, res) => {
    try {
      const bulkTpsData = req.body

      // Create an array to store all TPS documents for insertion
      const tpsDocuments = []

      // Loop through the bulkTpsData array and process each village's TPS data
      for (const villageData of bulkTpsData) {
        const { village_code, tps } = villageData

        // Find or create the village based on the village_code
        let village = await Village.findOne({ code: village_code })

        if (!village) {
          return apiHandler({
            res,
            status: 'error',
            code: 404,
            message: 'One or more villages not found',
            error: null,
          })
        }

        // Create TPS documents for the village
        const tpsEntries = tps.map((tpsData) => ({
          number: tpsData.number,
          total_voters: tpsData.total_voters,
          village_id: village._id,
          village_code: village.code,
          district_id: village.district_id,
        }))

        // Add the TPS documents to the array
        tpsDocuments.push(...tpsEntries)
      }

      // Use insertMany to insert all TPS documents at once
      const insertedTps = await Tps.insertMany(tpsDocuments)

      // Update the village.tps array with the inserted TPS document IDs
      for (const villageData of bulkTpsData) {
        const { village_code, tps } = villageData
        const village = await Village.findOne({ code: village_code })

        // Find the corresponding TPS documents using the number and total_voters
        const correspondingTps = tps.map((tpsData) => {
          const { number, total_voters } = tpsData
          return insertedTps.find(
            (insertedTpsData) =>
              insertedTpsData.number === number &&
              insertedTpsData.total_voters === total_voters
          )
        })

        // Update the village.tps array with the corresponding TPS document IDs
        village.tps.push(...correspondingTps.map((tps) => tps._id))

        // Save the updated village with the new TPS references
        await village.save()
      }

      res.status(200).json({ message: 'Bulk TPS data saved successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },
}

export default tpsController
