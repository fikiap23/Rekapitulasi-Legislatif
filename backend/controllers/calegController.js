import apiHandler from '../utils/apiHandler.js'
import VotesResult from '../models/votesResultModel.js'
import { Village, District } from '../models/regionModel.js'
import Party from '../models/partyModel.js'
import mongoose from 'mongoose'

const calegController = {
  getAllCalegs: async (req, res) => {
    try {
      // Find all villages
      const villages = await Village.find()

      // Extract village IDs
      const villageIds = villages.map((village) => village._id)

      // Fetch all results for the villages
      const result = await VotesResult.find({
        village_id: { $in: villageIds },
      })

      let valid_ballots_detail = await getValidBallotsHelper(result)

      // Return the aggregated result
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Voting results for all villages retrieved successfully',
        data: valid_ballots_detail,
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

const getValidBallotsHelper = async (resultsByDistrict) => {
  try {
    // Object to store total votes for each party and candidate
    const totalVotes = {}

    // Iterate through each result
    resultsByDistrict.forEach((result) => {
      result.valid_ballots_detail.forEach((party) => {
        const partyId = party.party_id

        if (!totalVotes[partyId]) {
          totalVotes[partyId] = {
            party_id: partyId,
            total_votes_party: 0,
            candidates: {},
          }
        }

        console.log(
          `Party ID: ${partyId}, Total Votes Party: ${totalVotes[partyId].total_votes_party}`
        )

        party.candidates.forEach((candidate) => {
          if (candidate) {
            const candidateId = candidate.candidate_id

            if (!totalVotes[partyId].candidates[candidateId]) {
              totalVotes[partyId].candidates[candidateId] = {
                candidate_id: candidateId,
                number_of_votes: 0,
              }
            }

            totalVotes[partyId].candidates[candidateId].number_of_votes +=
              candidate.number_of_votes

            console.log(
              `Candidate ID: ${candidateId}, Number of Votes: ${totalVotes[partyId].candidates[candidateId].number_of_votes}`
            )
            // add total votes party
            totalVotes[partyId].total_votes_party += candidate.number_of_votes
          }
        })
      })
    })
    console.log('Total Votes:', totalVotes)

    // Collect all party IDs and candidate IDs
    const allPartyIds = Object.keys(totalVotes)

    // Populate party data
    const populatedParties = await Party.find({
      _id: { $in: allPartyIds },
    }).select('_id name code candidates logoUrl')

    // Transform party data into a mapping for easy access
    const partyMap = populatedParties.reduce((acc, party) => {
      acc[party._id] = party
      return acc
    }, {})

    // Transform the result with populated party data and candidates
    const transformedResult = Object.values(totalVotes).flatMap((party) => {
      const partyData = partyMap[party.party_id]
      return Object.values(party.candidates).map((candidate) => {
        // Access candidate data from the party map
        const candidateData = partyData.candidates.find(
          (c) => c._id.toString() === candidate.candidate_id.toString()
        )
        return {
          party_id: party.party_id,
          party_name: partyData.name,
          candidate_id: candidate.candidate_id,
          number_of_votes: candidate.number_of_votes,
          candidate_data: candidateData,
        }
      })
    })

    // Return the aggregated result
    return transformedResult
  } catch (error) {
    console.error('Error getting total results by district:', error)
    return null
  }
}

export default calegController
