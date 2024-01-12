import User from '../models/userModel.js'
import Party from '../models/partyModel.js'
import { District, Regency, Village } from '../models/regionModel.js'

const villageController = {
  addVotesToValidBallots: async (req, res) => {
    try {
      const { partyId, numberOfVotes } = req.body
      const userId = req.user._id

      //   check input not null
      if (!partyId || !numberOfVotes) {
        return res.status(400).json({ error: 'All fields are required' })
      }

      //   check partyId
      const party = await Party.findById(partyId)
      if (!party) {
        return res.status(404).json({ error: 'Party not found' })
      }

      //   check if user exists
      const user = await User.findById(userId)

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const villageId = user.village_id

      // Cek apakah partyId sudah ada di dalam array validBallots
      const village = await Village.findById(villageId)

      if (!village) {
        return res.status(404).json({ error: 'Village not found' })
      }

      const existingBallotIndex = village.valid_ballots.findIndex(
        (ballot) => String(ballot.partyId) === partyId
      )

      if (existingBallotIndex !== -1) {
        /// Jika partai sudah ada, error karena partai sudah ada
        return res
          .status(400)
          .json({ error: 'Partai ini sudah di inputkan suaranya' })
      } else {
        // Jika partai belum ada, tambahkan partai baru ke dalam valid_ballot
        // limit valid_ballots
        const totalValidBallots = village.valid_ballots.reduce(
          (accumulator, currentBallot) =>
            accumulator + currentBallot.numberOfVotes,
          0
        )
        const validBallotsLimit =
          village.total_voters - village.invalid_ballots - totalValidBallots
        console.log('validBallotsLimit: ', validBallotsLimit)

        if (numberOfVotes > validBallotsLimit) {
          return res.status(400).json({ error: 'Invalid vote, too many votes' })
        }

        await Village.updateOne(
          { _id: villageId },
          {
            $push: {
              valid_ballots: {
                code: party.code,
                partyId,
                numberOfVotes,
              },
            },
          }
        )
      }

      res.status(200).json({ message: 'Votes added successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('Error in addVotesToValidBallots: ', error.message)
    }
  },

  updateVotesToValidBallots: async (req, res) => {
    try {
      let { partyId, numberOfVotes } = req.body
      const userId = req.user._id

      numberOfVotes = parseInt(numberOfVotes)
      console.log('numberOfVotes: ', numberOfVotes)

      //   check input not null
      if (!partyId) {
        return res.status(400).json({ error: 'All fields are required' })
      }

      //   check partyId
      const party = await Party.findById(partyId)
      if (!party) {
        return res.status(404).json({ error: 'Party not found' })
      }

      //   check if user exists
      const user = await User.findById(userId)

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const villageId = user.village_id

      // Cek apakah partyId sudah ada di dalam array validBallots
      const village = await Village.findById(villageId)

      if (!village) {
        return res.status(404).json({ error: 'Village not found' })
      }

      const existingBallotIndex = village.valid_ballots.findIndex(
        (ballot) => String(ballot.partyId) === partyId
      )

      if (existingBallotIndex !== -1) {
        // Jika partai sudah ada
        const totalValidBallots = village.valid_ballots.reduce(
          (accumulator, currentBallot) =>
            accumulator + currentBallot.numberOfVotes,
          0
        )

        // Subtract the existing votes from the limit
        const validBallotsLimit =
          village.total_voters -
          village.invalid_ballots -
          totalValidBallots +
          village.valid_ballots[existingBallotIndex].numberOfVotes

        console.log('validBallotsLimit: ', validBallotsLimit)

        if (numberOfVotes > validBallotsLimit) {
          return res.status(400).json({ error: 'Invalid vote, too many votes' })
        }

        await Village.updateOne(
          { _id: villageId, 'valid_ballots.partyId': partyId },
          { $set: { 'valid_ballots.$.numberOfVotes': numberOfVotes } }
        )
      } else {
        // Jika partai belum ada
        return res
          .status(400)
          .json({ error: 'Partai ini belum di inputkan suaranya' })
      }

      res.status(200).json({ message: 'Votes updated successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('Error in updateVotesToValidBallots: ', error.message)
    }
  },

  addVoteToInvalidBallots: async (req, res) => {
    try {
      const { numberOfinvalidBallots } = req.body
      const userId = req.user._id

      const user = await User.findById(userId)

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const villageId = user.village_id

      // Cek apakah partyId sudah ada di dalam array validBallots
      const village = await Village.findById(villageId)
      if (!village) {
        return res.status(404).json({ error: 'Village not found' })
      }

      const totalVoters = village.total_voters

      const totalValidBallots = village.valid_ballots.reduce(
        (accumulator, currentBallot) =>
          accumulator + currentBallot.numberOfVotes,
        0
      )

      // limit invalid_ballots
      const invalidBallotsLimit = totalVoters - totalValidBallots
      console.log('invalidBallotsLimit: ', invalidBallotsLimit)

      if (numberOfinvalidBallots > invalidBallotsLimit) {
        return res.status(400).json({ error: 'Invalid vote, too many votes' })
      }

      // Update jumlah suara invalid_ballots pada Village
      await Village.updateOne(
        { _id: villageId },
        { $set: { invalid_ballots: numberOfinvalidBallots } }
      )

      res.status(200).json({ message: 'Invalid vote added successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('Error in addVoteToInvalidBallots: ', error.message)
    }
  },
}

export default villageController
