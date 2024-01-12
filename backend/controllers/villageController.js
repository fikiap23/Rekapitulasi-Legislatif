import User from '../models/userModel.js'
import Party from '../models/partyModel.js'
import { Village } from '../models/regionModel.js'
import apiHandler from '../utils/apiHandler.js'

const villageController = {
  addVotesArrayToValidBallots: async (req, res) => {
    try {
      const votes = req.body

      if (!votes || !Array.isArray(votes) || votes.length === 0) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Votes array is required',
          data: null,
          error: null,
        })
      }

      const userId = req.user._id

      const user = await User.findById(userId)
      if (!user) {
        return apiHandler({
          res,
          status: 'error',
          code: 404,
          message: 'User not found',
          data: null,
          error: null,
        })
      }

      const villageId = user.village_id

      const village = await Village.findById(villageId)
      if (!village) {
        return apiHandler({
          res,
          status: 'error',
          code: 404,
          message: 'Village not found',
          data: null,
          error: null,
        })
      }

      const totalVoters = village.total_voters
      let totalVotesAdded = 0

      for (const vote of votes) {
        const { code, numberOfVotes } = vote

        const party = await Party.findOne({ code })
        if (!party) {
          return apiHandler({
            res,
            status: 'error',
            code: 404,
            message: `Party with code ${code} not found`,
            data: null,
            error: null,
          })
        }

        const existingBallotIndex = village.valid_ballots.findIndex(
          (ballot) => String(ballot.code) === code
        )

        if (existingBallotIndex !== -1) {
          totalVotesAdded += numberOfVotes
        } else {
          totalVotesAdded += numberOfVotes
        }
      }

      console.log(totalVotesAdded)

      if (totalVotesAdded > totalVoters) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Total number of votes exceeds the limit',
          data: null,
          error: null,
        })
      }

      for (const vote of votes) {
        const { code, numberOfVotes } = vote

        const party = await Party.findOne({ code })
        if (!party) {
          return apiHandler({
            res,
            status: 'error',
            code: 404,
            message: `Party with code ${code} not found`,
            data: null,
            error: null,
          })
        }

        const existingBallotIndex = village.valid_ballots.findIndex(
          (ballot) => String(ballot.code) === code
        )

        if (existingBallotIndex !== -1) {
          await Village.updateOne(
            { _id: villageId, 'valid_ballots.code': code },
            { $set: { 'valid_ballots.$.numberOfVotes': numberOfVotes } }
          )
        } else {
          await Village.updateOne(
            { _id: villageId },
            {
              $push: {
                valid_ballots: {
                  partyId: party._id,
                  code,
                  numberOfVotes,
                },
              },
            }
          )
        }
      }

      await Village.updateOne(
        { _id: villageId },
        { $set: { invalid_ballots: totalVoters - totalVotesAdded } }
      )

      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Votes added/updated successfully',
        data: null,
        error: null,
      })
    } catch (error) {
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

export default villageController
