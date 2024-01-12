import User from '../models/userModel.js'
import Party from '../models/partyModel.js'
import { Village } from '../models/regionModel.js'

const villageController = {
  addVotesArrayToValidBallots: async (req, res) => {
    try {
      const votes = req.body // directly use the array of votes

      // Check if input is not null and is an array
      if (!votes || !Array.isArray(votes) || votes.length === 0) {
        return res.status(400).json({ error: 'Votes array is required' })
      }

      const userId = req.user._id

      // Check if user exists
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const villageId = user.village_id

      const village = await Village.findById(villageId)
      if (!village) {
        return res.status(404).json({ error: 'Village not found' })
      }

      // check limit of votes
      const total_voters = village.total_voters

      // Variable to track total votes added
      let totalVotesAdded = 0

      for (const vote of votes) {
        const { code, numberOfVotes } = vote

        // Check if code is valid
        const party = await Party.findOne({ code })
        if (!party) {
          return res
            .status(404)
            .json({ error: `Party with code ${code} not found` })
        }

        // Check if the party has already been voted for
        const existingBallotIndex = village.valid_ballots.findIndex(
          (ballot) => String(ballot.code) === code
        )

        if (existingBallotIndex !== -1) {
          // If the party has been voted for, update the vote
          totalVotesAdded += numberOfVotes
        } else {
          // If the party has not been voted for, add a new vote
          totalVotesAdded += numberOfVotes
        }
      }

      // Verifikasi apakah totalVotesAdded melebihi total_voters
      if (totalVotesAdded > total_voters) {
        return res
          .status(400)
          .json({ error: 'Total number of votes exceeds the limit' })
      }

      // Jika tidak melebihi, simpan ke database
      for (const vote of votes) {
        const { code, numberOfVotes } = vote

        // Check if code is valid
        const party = await Party.findOne({ code })
        if (!party) {
          return res
            .status(404)
            .json({ error: `Party with code ${code} not found` })
        }

        // Check if the party has already been voted for
        const existingBallotIndex = village.valid_ballots.findIndex(
          (ballot) => String(ballot.code) === code
        )

        if (existingBallotIndex !== -1) {
          // If the party has been voted for, update the vote
          await Village.updateOne(
            { _id: villageId, 'valid_ballots.code': code },
            { $set: { 'valid_ballots.$.numberOfVotes': numberOfVotes } }
          )
        } else {
          // If the party has not been voted for, add a new vote
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

      // console.log(totalVotesAdded)
      // add invalid ballots
      await Village.updateOne(
        { _id: villageId },
        { $set: { invalid_ballots: total_voters - totalVotesAdded } }
      )

      res.status(200).json({ message: 'Votes added/updated successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('Error in addVotesArrayToValidBallots: ', error.message)
    }
  },
}

export default villageController
