import User from '../models/userModel.js'
import Party from '../models/partyModel.js'
import { District, Regency, Village } from '../models/regionModel.js'

// Fungsi pembantu untuk mendapatkan rekapitulasi suara per distrik
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
      // Langkah 1: Mencari Semua Distrik
      const districts = await District.find()

      // Langkah 2: Membuat array untuk menyimpan rekapitulasi setiap distrik
      const districtsSummary = []

      // Langkah 3: Iterasi melalui setiap distrik untuk mendapatkan rekapitulasi
      for (const district of districts) {
        // Mendapatkan rekapitulasi untuk setiap distrik menggunakan fungsi sebelumnya
        const districtSummary = await getVotesPartiesByDistrictHelper(
          district._id
        )

        // Menambahkan informasi distrik ke rekapitulasi distrik
        districtsSummary.push({
          districtId: district._id,
          districtName: district.district_name,
          ...districtSummary,
        })
      }

      // Mengirim respons dengan rekapitulasi distrik
      res.status(200).json(districtsSummary)
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('Error in getDistricts: ', error.message)
    }
  },

  getDistrictById: async (req, res) => {
    try {
      const districtId = req.params.id
      const district = await District.findById(districtId)

      if (!district) {
        return res.status(404).json({ error: 'District not found' })
      }

      res.status(200).json(district)
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('Error in getDistrictById: ', error.message)
    }
  },

  getVotesSummaryByDistrict: async (req, res) => {
    try {
      // Langkah 1: Mendapatkan ID Distrik dari Permintaan (Request)
      const districtId = req.params.id

      // Langkah 2: Mencari Distrik Berdasarkan ID
      const district = await District.findById(districtId)
      if (!district) {
        return res.status(404).json({ error: 'District not found' })
      }

      const districtSummary = await getVotesSummaryByDistrictHelper(districtId)

      res.status(200).json({
        districtId: district._id,
        districtName: district.district_name,
        ...districtSummary,
      })
    } catch (error) {
      // Menangani kesalahan dan mengirim tanggapan dengan status 500
      res.status(500).json({ error: error.message })
      console.log('Error in getVotesSummaryByDistrict: ', error.message)
    }
  },
}

export default districtController
