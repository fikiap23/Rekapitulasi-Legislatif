import Party from '../models/partyModel.js'
import { District, Village } from '../models/regionModel.js'
import apiHandler from '../utils/apiHandler.js'
const getVotesSummaryByDistrictHelper = async (districtId) => {
  const district = await District.findById(districtId)
  if (!district) {
    return { error: 'District not found' }
  }

  const villages = await Village.find({ _id: { $in: district.villages } })

  let totalValidVotes = 0
  let totalInvalidVotes = 0
  let totalVoters = 0
  const partyVotes = {}

  const votesSummary = villages.map((village) => {
    const villageVotes = village.valid_ballots.reduce(
      (accumulator, currentBallot) => {
        if (!partyVotes[currentBallot.partyId]) {
          partyVotes[currentBallot.partyId] = 0
        }
        partyVotes[currentBallot.partyId] += currentBallot.numberOfVotes

        return accumulator + currentBallot.numberOfVotes
      },
      0
    )

    const totalInvalid = village.invalid_ballots
    const totalVillageVoters = village.total_voters

    totalValidVotes += villageVotes
    totalInvalidVotes += totalInvalid
    totalVoters += totalVillageVoters

    return {
      villageId: village._id,
      villageName: village.village_name,
      totalValid: villageVotes,
      totalInvalid,
      totalVillageVoters,
      valid_vote_detail: village.valid_ballots,
    }
  })

  const detailedPartyVotes = []

  for (const [partyId, partyVoteCount] of Object.entries(partyVotes)) {
    const partyDetails = await Party.findById(partyId)

    if (partyDetails) {
      detailedPartyVotes.push({
        partyId: partyDetails._id,
        partyName: partyDetails.party_name,
        code: partyDetails.code,
        votes: partyVoteCount,
      })
    }
  }

  return {
    totalValidVotes,
    totalInvalidVotes,
    totalVoters,
    votesSummary,
    detailedPartyVotes,
  }
}

const getVotesPartiesByDistrictHelper = async (districtId) => {
  const district = await District.findById(districtId)
  if (!district) {
    return { error: 'District not found' }
  }

  const villages = await Village.find({ _id: { $in: district.villages } })

  let totalValidVotes = 0
  let totalInvalidVotes = 0
  let totalVoters = 0
  const partyVotes = {}

  for (const village of villages) {
    const villageVotes = village.valid_ballots.reduce(
      (accumulator, currentBallot) => {
        if (!partyVotes[currentBallot.partyId]) {
          partyVotes[currentBallot.partyId] = 0
        }
        partyVotes[currentBallot.partyId] += currentBallot.numberOfVotes

        return accumulator + currentBallot.numberOfVotes
      },
      0
    )

    const totalInvalid = village.invalid_ballots
    const totalVillageVoters = village.total_voters

    totalValidVotes += villageVotes
    totalInvalidVotes += totalInvalid
    totalVoters += totalVillageVoters
  }

  const detailedPartyVotes = []

  for (const [partyId, partyVoteCount] of Object.entries(partyVotes)) {
    const partyDetails = await Party.findById(partyId)

    if (partyDetails) {
      detailedPartyVotes.push({
        partyId: partyDetails._id,
        code: partyDetails.code,
        partyName: partyDetails.party_name,
        votes: partyVoteCount,
      })
    }
  }

  return {
    totalValidVotes,
    totalInvalidVotes,
    totalVoters,
    detailedPartyVotes,
  }
}

const districtController = {
  getDistricts: async (req, res) => {
    try {
      const districts = await District.find()
      const districtsSummary = []

      for (const district of districts) {
        const districtSummary = await getVotesPartiesByDistrictHelper(
          district._id
        )

        districtsSummary.push({
          districtId: district._id,
          districtName: district.district_name,
          ...districtSummary,
        })
      }

      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Districts retrieved successfully',
        data: districtsSummary,
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

  getDistrictById: async (req, res) => {
    try {
      const districtId = req.params.id
      const district = await District.findById(districtId)

      if (!district) {
        return apiHandler({
          res,
          status: 'error',
          code: 404,
          message: 'District not found',
          data: null,
          error: null,
        })
      }

      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'District retrieved successfully',
        data: district,
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

  getVotesSummaryByDistrict: async (req, res) => {
    try {
      const districtId = req.params.id
      const district = await District.findById(districtId)

      if (!district) {
        return apiHandler({
          res,
          status: 'error',
          code: 404,
          message: 'District not found',
          data: null,
          error: null,
        })
      }

      const districtSummary = await getVotesSummaryByDistrictHelper(districtId)

      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Votes summary retrieved successfully',
        data: {
          districtId: district._id,
          districtName: district.district_name,
          ...districtSummary,
        },
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

export default districtController
