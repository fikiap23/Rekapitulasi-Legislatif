import apiHandler from '../utils/apiHandler.js'
import VotesResult from '../models/votesResultModel.js'
import { Village } from '../models/regionModel.js'
import Party from '../models/partyModel.js'
import mongoose from 'mongoose'

const votesResultController = {
  fillValidBallotsDetail: async (req, res) => {
    try {
      const { villageId } = req.params
      const validBallotsDetail = req.body

      // Check if validBallotsDetail is an array
      if (!Array.isArray(validBallotsDetail)) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Invalid validBallotsDetail format',
          error: null,
        })
      }

      // Check villageId
      if (!villageId) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Missing villageId parameter',
          error: null,
        })
      }

      // Check if village exists
      const village = await Village.findById(villageId)
      if (!village) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Village not found',
          error: null,
        })
      }

      // Validate existence of parties and candidates
      let totalVotesAllParties = 0 // Variable to track total votes for all parties

      for (const item of validBallotsDetail) {
        if (item.party_id) {
          // Check if party exists
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

          // Check if candidates exist for the party
          if (partyExists.candidates && partyExists.candidates.length > 0) {
            let totalVotesParty = 0

            for (const candidate of item.candidates) {
              const candidateId = new mongoose.Types.ObjectId(
                candidate.candidate_id
              )
              const candidateExists = partyExists.candidates.find((c) =>
                c._id.equals(candidateId)
              )

              if (!candidateExists) {
                return apiHandler({
                  res,
                  status: 'error',
                  code: 400,
                  message: `Candidate with ID ${candidate.candidate_id} not found for party ${item.party_id}`,
                  error: null,
                })
              }

              totalVotesParty += candidate.number_of_votes || 0
            }

            // Check if total votes for the party exceed maxVotes
            if (totalVotesParty > village.total_voters) {
              return apiHandler({
                res,
                status: 'error',
                code: 400,
                message: `Total votes for party ${item.party_id} exceed the maximum allowed votes`,
                error: null,
              })
            }

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

      if (totalVotesAllParties > village.total_voters) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: `Total votes for all parties exceed the maximum allowed votes, total votes for all parties: ${totalVotesAllParties}, max votes: ${village.total_voters}`,
          error: null,
        })
      }

      //check total valid ballots number
      //   console.log('total valid ballots', totalVotesAllParties)
      //   console.log(
      //     'total invalid ballots',
      //     village.total_voters - totalVotesAllParties
      //   )

      // Update VotesResult document
      const updatedVotesResult = await VotesResult.findOneAndUpdate(
        { village_id: villageId },
        {
          valid_ballots_detail: validBallotsDetail,
          total_valid_ballots: totalVotesAllParties,
          total_invalid_ballots: village.total_voters - totalVotesAllParties,
        },
        { new: true, upsert: true }
      )

      // Return the updated document
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Valid ballots detail updated successfully',
        data: updatedVotesResult,
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
  getAllResult: async (req, res) => {
    try {
      // Fetch all results from the VotesResult model
      const allResults = await VotesResult.find()

      // Return the results
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'All voting results retrieved successfully',
        data: allResults,
        error: null,
      })
    } catch (error) {
      console.error('Error getting all voting results:', error)
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
  getAllResultsByDistrict: async (req, res) => {
    try {
      const { districtId } = req.params

      // Check if districtId is provided
      if (!districtId) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Missing districtId parameter',
          error: null,
        })
      }

      // Find villages in the given district
      const villagesInDistrict = await Village.find({ district_id: districtId })

      // Extract village IDs
      const villageIds = villagesInDistrict.map((village) => village._id)

      // Fetch all results for the villages in the given district
      const resultsByDistrict = await VotesResult.find({
        village_id: { $in: villageIds },
      })

      // Return the results
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Voting results for the district retrieved successfully',
        data: resultsByDistrict,
        error: null,
      })
    } catch (error) {
      console.error('Error getting voting results by district:', error)
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

export default votesResultController
