import mongoose from 'mongoose'
import Village from '../models/villageModel.js'
import Tps from '../models/tpsModel.js'
import History from '../models/historyModel.js'
import Party from '../models/partyModel.js'
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

      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Bulk TPS created successfully',
        data: insertedTps,
      })
    } catch (error) {
      console.error(error)
      return apiHandler({
        res,
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
        error: { type: 'InternalServerError', details: error.message },
      })
    }
  },

  fillValidBallotsDetail: async (req, res) => {
    try {
      const { tpsId } = req.params
      const validBallotsDetail = req.body
      // Check if validBallotsDetail is an array and not empty
      if (
        !Array.isArray(validBallotsDetail) ||
        validBallotsDetail.length === 0
      ) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Invalid or empty validBallotsDetail format',
          error: null,
        })
      }

      // Check tpsId
      if (!tpsId) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Missing tpsId parameter',
          error: null,
        })
      }

      // Check if tps exists
      const tps = await Tps.findById(tpsId)
      if (!tps) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'TPS not found',
          error: null,
        })
      }

      // Validate existence of parties and candidates
      let totalVotesAllParties = 0 // Variable to track total votes for all parties

      for (const item of validBallotsDetail) {
        if (item.party_id) {
          const partyExists = await Party.findById(item.party_id)

          if (!partyExists) {
            return apiHandler({
              res,
              status: 'error',
              code: 400,
              message: `Party with ID ${item.party_id} not found`,
              error: null,
            })
          }

          // Add party details to the current item
          item.name = partyExists.name
          item.code = partyExists.code
          item.logoUrl = partyExists.logoUrl

          if (partyExists.candidates && partyExists.candidates.length > 0) {
            let totalVotesParty = 0

            for (const candidate of item.candidates) {
              const candidateId = new mongoose.Types.ObjectId(
                candidate?.candidate_id
              )
              const candidateExists = partyExists.candidates.find((c) =>
                c._id.equals(candidateId)
              )

              if (!candidateExists) {
                console.warn(
                  `Candidate with ID ${candidate?.candidate_id} not found for party ${item.party_id}. Skipping...`
                )

                // Skip to the next iteration if candidate is not found
                continue
              }

              // Add candidate details to the current item
              candidate.name = candidateExists.name
              candidate.gender = candidateExists.gender

              totalVotesParty += candidate.number_of_votes || 0
            }

            // Rest of the code for processing totalVotesParty
            // Add total votes for the party to the overall total
            totalVotesAllParties += totalVotesParty

            // Set total_votes_party for the party
            item.total_votes_party = totalVotesParty
          } else {
            return apiHandler({
              res,
              status: 'error',
              code: 400,
              message: `No candidates found for party ${item.party_id}`,
              error: null,
            })
          }
        }
      }

      // Check if total votes for all parties exceed maxVotes

      if (totalVotesAllParties > tps.total_voters) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: `Total votes for all parties exceed the maximum allowed votes, total votes for all parties: ${totalVotesAllParties}, max votes: ${tps.total_voters}`,
          error: null,
        })
      }

      // update  is_fillBallot in tps
      const updatedTps = await Tps.findOneAndUpdate(
        { _id: tpsId },
        {
          total_voters: tps.total_voters,
          valid_ballots_detail: validBallotsDetail,
          total_valid_ballots: totalVotesAllParties,
          total_invalid_ballots: tps.total_voters - totalVotesAllParties,
          is_fillBallot: true,
        }
      )
      // Create a history entry
      const historyEntry = {
        updated_at: new Date(),
        created_by: req.user._id,

        total_voters: tps.total_voters,
        valid_ballots_detail: validBallotsDetail,
        total_valid_ballots: totalVotesAllParties,
        total_invalid_ballots: tps.total_voters - totalVotesAllParties,
      }

      // Save the history entry to VotesResultHistory
      const history = await History.findOneAndUpdate(
        { tps_id: tpsId },
        {
          $push: { history: historyEntry },
        },
        { new: true, upsert: true }
      )

      // Return the updated document and history entry
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Valid ballots detail updated successfully',
        // send lash history
        data: history.history[history.history.length - 1],

        error: null,
      })
    } catch (error) {
      console.error('Error filling valid_ballots_detail:', error)
      return apiHandler({
        res,
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
        data: null,
        error: { type: 'InternalServerError', details: error.message },
      })
    }
  },

  getAllTpsResult: async (req, res) => {
    try {
      // Ambil semua TPS
      const tps = await Tps.find().select(
        '_id total_voters total_invalid_ballots total_valid_ballots valid_ballots_detail'
      )

      // Proses secara paralel untuk mendapatkan hasil yang diinginkan
      const [aggregatedResult, valid_ballots_detail] = await Promise.all([
        calculateAggregatedResult(tps),
        getValidBallotsHelper(tps),
      ])

      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Voting results for all TPS retrieved successfully',
        data: { ...aggregatedResult, valid_ballots_detail },
        error: null,
      })
    } catch (error) {
      console.error('Error getting total results by district:', error)
      return apiHandler({
        res,
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
        data: null,
        error: { type: 'InternalServerError', details: error.message },
      })
    }
  },
}

const getValidBallotsHelper = async (validBallots) => {
  try {
    // Memastikan validBallots adalah array
    const ballotsArray = Array.isArray(validBallots)
      ? validBallots
      : [validBallots]

    const totalVotes = ballotsArray.reduce((acc, result) => {
      for (const party of Object.values(result.valid_ballots_detail)) {
        const partyId = party.party_id

        if (!acc[partyId]) {
          acc[partyId] = {
            party_id: partyId,
            name: party.name, // Include party name
            total_votes_party: 0,
            candidates: {},
          }
        }

        for (const candidate of Object.values(party.candidates)) {
          if (candidate) {
            const candidateId = candidate.candidate_id

            if (!acc[partyId].candidates[candidateId]) {
              acc[partyId].candidates[candidateId] = {
                candidate_id: candidateId,
                name: candidate.name, // Include candidate name
                number_of_votes: 0,
              }
            }

            acc[partyId].candidates[candidateId].number_of_votes +=
              candidate.number_of_votes
            acc[partyId].total_votes_party += candidate.number_of_votes
          }
        }
      }

      return acc
    }, {})

    const totalVotesTransformed = Object.values(totalVotes).map((party) => ({
      party_id: party.party_id,
      name: party.name,
      total_votes_party: party.total_votes_party,
      candidates: Object.values(party.candidates).map((candidate) => ({
        candidate_id: candidate.candidate_id,
        name: candidate.name,
        number_of_votes: candidate.number_of_votes,
      })),
    }))

    return totalVotesTransformed
  } catch (error) {
    console.error('Error getting total results by district:', error)
    return null
  }
}

const calculateAggregatedResult = (tps) => {
  // Hitung hasil agregat dari data TPS
  const aggregatedResult = {
    total_invalid_ballots: tps.reduce(
      (total, tps) => total + tps.total_invalid_ballots,
      0
    ),
    total_valid_ballots: tps.reduce(
      (total, tps) => total + tps.total_valid_ballots,
      0
    ),
    total_voters: tps.reduce((total, tps) => total + tps.total_voters, 0),
  }

  return aggregatedResult
}

export default tpsController