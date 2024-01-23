import apiHandler from '../utils/apiHandler.js'
import VotesResult from '../models/votesResultModel.js'
import { Village, District, Regency } from '../models/regionModel.js'
import Party from '../models/partyModel.js'
import VotesResultHistory from '../models/resultVoteHistoryModel.js'
import mongoose from 'mongoose'

const votesResultController = {
  fillValidBallotsDetail: async (req, res) => {
    try {
      const { villageId } = req.params
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
          total_voters: village.total_voters,
          valid_ballots_detail: validBallotsDetail,
          total_valid_ballots: totalVotesAllParties,
          total_invalid_ballots: village.total_voters - totalVotesAllParties,
        },
        { new: true, upsert: true }
      )

      // Create a history entry
      const historyEntry = {
        updated_at: new Date(),
        created_by: req.user._id,
        changes: {
          total_voters: village.total_voters,
          valid_ballots_detail: validBallotsDetail,
          total_valid_ballots: totalVotesAllParties,
          total_invalid_ballots: village.total_voters - totalVotesAllParties,
        },
      }

      // Save the history entry to VotesResultHistory
      const history = await VotesResultHistory.findOneAndUpdate(
        { votesResultId: updatedVotesResult._id, village_id: villageId },
        { $push: { history: historyEntry } },
        { new: true, upsert: true }
      )

      // Return the updated document and history entry
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Valid ballots detail updated successfully',
        data: { updatedVotesResult, history },
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

      // Check if districtId is exist
      const district = await District.findById(districtId)
      if (!district) {
        return apiHandler({
          res,
          status: 'error',
          code: 404,
          message: 'District not found',
          error: null,
        })
      }

      // Extract village IDs
      const villageIds = district.villages

      // Fetch all results for the villages in the given district
      const resultsByDistrict = await VotesResult.find({
        village_id: { $in: villageIds },
      })

      let valid_ballots_detail = await getValidBallotsHelper(resultsByDistrict)

      // Combine and aggregate the results
      const aggregatedResult = {
        total_invalid_ballots: resultsByDistrict.reduce(
          (total, result) => total + result.total_invalid_ballots,
          0
        ),
        total_valid_ballots: resultsByDistrict.reduce(
          (total, result) => total + result.total_valid_ballots,
          0
        ),
      }

      // Return the aggregated result
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Voting results for the district retrieved successfully',
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

  getAllResult: async (req, res) => {
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

      // Sum up the total_voters from all villages
      const total_voters = villages.reduce(
        (total, village) => total + village.total_voters,
        0
      )

      // Combine and aggregate the results
      const aggregatedResult = {
        total_invalid_ballots: result.reduce(
          (total, result) => total + result.total_invalid_ballots,
          0
        ),
        total_valid_ballots: result.reduce(
          (total, result) => total + result.total_valid_ballots,
          0
        ),
        total_voters: total_voters,
      }

      // Return the aggregated result
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Voting results for all villages retrieved successfully',
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

  getAllDistricts: async (req, res) => {
    try {
      // Find all districts with populated villages
      const districts = await District.find().populate('villages')

      // Array to store results for each district
      const resultsByDistricts = []

      // Iterate through each district
      for (const district of districts) {
        // Extract village IDs for the district
        const villageIds = district.villages.map((village) => village._id)

        // Fetch results for the villages in the district concurrently
        const villagePromises = villageIds.map((villageId) =>
          Village.findById(villageId)
        )
        const villages = await Promise.all(villagePromises)

        // Calculate total voters for the district
        const totalVotersForDistrict = villages.reduce(
          (total, village) => total + (village ? village.total_voters : 0),
          0
        )

        // Fetch results for the villages in the district
        const resultsByDistrict = await VotesResult.find({
          village_id: { $in: villageIds },
        })

        // Aggregate the results for the district
        const aggregatedResult = {
          district_id: district._id,
          district_name: district.district_name,
          total_voters: totalVotersForDistrict,
          total_invalid_ballots: resultsByDistrict.reduce(
            (total, result) => total + result.total_invalid_ballots,
            0
          ),
          total_valid_ballots: resultsByDistrict.reduce(
            (total, result) => total + result.total_valid_ballots,
            0
          ),
        }

        resultsByDistricts.push(aggregatedResult)
      }

      // Return the results for all districts
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Voting results for all districts retrieved successfully',
        data: resultsByDistricts,
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

  getAllVillageByDistrictId: async (req, res) => {
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

      // Check if districtId exists
      const district = await District.findById(districtId)
      if (!district) {
        return apiHandler({
          res,
          status: 'error',
          code: 404,
          message: 'District not found',
          error: null,
        })
      }

      // Extract village IDs
      const villageIds = district.villages

      // Fetch all villages for the given district
      const villages = await Village.find({ _id: { $in: villageIds } })

      // Fetch results for the villages in the district
      const resultsByDistrict = await VotesResult.find({
        village_id: { $in: villageIds },
      })

      // Map results to village IDs for easier lookup
      const resultsMap = resultsByDistrict.reduce((acc, result) => {
        acc[result.village_id] = result
        return acc
      }, {})

      // Combine village data with voting results
      const villagesWithResults = villages.map((village) => {
        const result = resultsMap[village._id.toString()] || {
          total_invalid_ballots: 0,
          total_valid_ballots: 0,
        }

        return {
          village_id: village._id,
          village_name: village.village_name,
          total_voters: village.total_voters,
          total_invalid_ballots: result.total_invalid_ballots,
          total_valid_ballots: result.total_valid_ballots,
        }
      })

      // Return the villages with voting results
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Villages for the district retrieved successfully',
        data: villagesWithResults,
        error: null,
      })
    } catch (error) {
      console.error('Error getting villages by district:', error)
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
  getVillageByVillageId: async (req, res) => {
    try {
      const { villageId } = req.params

      // Check if villageId is provided
      if (!villageId) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Missing villageId parameter',
          error: null,
        })
      }

      // Check if villageId exists
      const village = await Village.findById(villageId)

      if (!village) {
        return apiHandler({
          res,
          status: 'error',
          code: 404,
          message: 'Village not found',
          error: null,
        })
      }

      // Fetch voting results for the village with populated party details (_id, code, name)
      const results = await VotesResult.findOne({
        village_id: villageId,
      }).populate({
        path: 'valid_ballots_detail.party_id',
        select: '_id code name',
      })

      // Return the village with populated voting results
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Village retrieved successfully',
        data: {
          village_id: village._id,
          village_name: village.village_name,
          total_voters: village.total_voters,
          total_invalid_ballots: results ? results.total_invalid_ballots : 0,
          total_valid_ballots: results ? results.total_valid_ballots : 0,
          valid_ballots_detail: results ? results.valid_ballots_detail : [],
        },
        error: null,
      })
    } catch (error) {
      console.error('Error getting village by villageId:', error)
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

  getHistoryByVillageId: async (req, res) => {
    try {
      const { villageId } = req.params

      // Check if villageId is provided
      if (!villageId) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Missing villageId parameter',
          error: null,
        })
      }

      // Check if villageId exists
      const village = await Village.findById(villageId)

      if (!village) {
        return apiHandler({
          res,
          status: 'error',
          code: 404,
          message: 'Village not found',
          error: null,
        })
      }

      const results = await VotesResultHistory.findOne({
        village_id: villageId,
      })
        .populate({
          path: 'village_id',
          model: 'Village', // replace with the actual model name for the village
        })
        .populate({
          path: 'history.created_by',
          model: 'User', // replace with the actual model name for the user
          select: '_id username',
        })

      // Return the village with populated voting results
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Village retrieved successfully',
        data: results,
        error: null,
      })
    } catch (error) {
      console.error('Error getting village by villageId:', error)
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
    const transformedResult = Object.values(totalVotes).map((party) => {
      const partyData = partyMap[party.party_id]
      return {
        party_id: party.party_id,
        total_votes_party: party.total_votes_party,
        name: partyData.name,
        code: partyData.code,
        logoUrl: partyData.logoUrl,
        candidates: Object.values(party.candidates).map((candidate) => {
          // Access candidate data from the party map
          const candidateData = partyData.candidates.find(
            (c) => c._id.toString() === candidate.candidate_id.toString()
          )
          return {
            candidate_id: candidate.candidate_id,
            number_of_votes: candidate.number_of_votes,
            candidate_data: candidateData,
          }
        }),
      }
    })

    // Return the aggregated result
    return transformedResult
  } catch (error) {
    console.error('Error getting total results by district:', error)
    return null
  }
}

export default votesResultController
