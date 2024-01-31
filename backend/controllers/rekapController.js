import Tps from '../models/tpsModel.js'
import apiHandler from '../utils/apiHandler.js'

const rekapController = {
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
  getAllDistrictWithResultVotes: async (req, res) => {
    try {
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

export default rekapController
