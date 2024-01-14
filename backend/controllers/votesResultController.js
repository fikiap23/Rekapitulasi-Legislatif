import apiHandler from '../utils/apiHandler.js'
import VotesResult from '../models/votesResultModel.js'
import { Village } from '../models/regionModel.js'

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

      // Transform the input structure to match the model
      const transformedValidBallotsDetail = validBallotsDetail.map((item) => {
        const totalVotesParty = item.candidates.reduce(
          (acc, candidate) => acc + candidate.number_of_votes,
          0
        )
        return {
          code: item.code,
          total_votes_party: totalVotesParty,
          candidates: item.candidates.map((candidate) => ({
            candidate_id: candidate.candidate_id,
            number_of_votes: candidate.number_of_votes || 0,
          })),
        }
      })

      // Update VotesResult document
      const updatedVotesResult = await VotesResult.findOneAndUpdate(
        { village_id: villageId, result_type: 'village' },
        { valid_ballots_detail: transformedValidBallotsDetail },
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
}

export default votesResultController
