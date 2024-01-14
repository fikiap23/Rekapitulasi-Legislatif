import { District, Village } from '../models/regionModel.js'
import Admin from '../models/adminModel.js'
import Party from '../models/partyModel.js'

import apiHandler from '../utils/apiHandler.js'
const villageController = {
  createOneVillage: async (req, res) => {
    try {
      const { village_name, code, total_voters, district_id } = req.body

      if ((!village_name || !total_voters || !district_id, !code)) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Missing required fields',
          error: null,
        })
      }

      const district = await District.findById(district_id)
      if (!district) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'District not found',
          error: null,
        })
      }

      const newVillage = new Village({
        village_name,
        code,
        district_id,
        total_voters,
      })

      await newVillage.save()

      district.villages.push(newVillage._id)
      await district.save()

      return apiHandler({
        res,
        status: 'success',
        code: 201,
        message: 'Village created successfully',
        data: {
          _id: newVillage._id,
          code: newVillage.code,
          district_id: newVillage.district_id,
          village_name: newVillage.village_name,
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
  createManyVillage: async (req, res) => {
    try {
      const villages = req.body

      if (!villages || !Array.isArray(villages) || villages.length === 0) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Invalid or empty villages data',
          error: null,
        })
      }

      const createdVillages = []

      for (const villageData of villages) {
        const { village_name, total_voters, district_id, code } = villageData

        if ((!village_name || !total_voters || !district_id, !code)) {
          return apiHandler({
            res,
            status: 'error',
            code: 400,
            message: 'Missing required fields',
            error: null,
          })
        }

        const district = await District.findById(district_id)
        if (!district) {
          return apiHandler({
            res,
            status: 'error',
            code: 400,
            message: 'District not found',
            error: null,
          })
        }

        const newVillage = new Village({
          village_name,
          code,
          district_id,
          total_voters,
        })

        await newVillage.save()

        district.villages.push(newVillage._id)
        await district.save()

        createdVillages.push({
          _id: newVillage._id,
          district_id: newVillage.district_id,
          code: newVillage.code,
          village_name: newVillage.village_name,
        })
      }

      return apiHandler({
        res,
        status: 'success',
        code: 201,
        message: 'Villages created successfully',
        data: createdVillages,
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

  createManyVillageByDistrict: async (req, res) => {
    try {
      const { district_id } = req.params
      const villages = req.body

      if (!villages || !Array.isArray(villages) || villages.length === 0) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Invalid or empty villages data',
          error: null,
        })
      }

      const district = await District.findById(district_id)
      if (!district) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'District not found',
          error: null,
        })
      }

      const createdVillages = []

      for (const villageData of villages) {
        const { village_name, code, total_voters } = villageData

        if (!village_name || !total_voters || !code) {
          return apiHandler({
            res,
            status: 'error',
            code: 400,
            message: 'Missing required fields',
            error: null,
          })
        }

        const newVillage = new Village({
          village_name,
          district_id,
          total_voters,
        })

        await newVillage.save()

        district.villages.push(newVillage._id)
        await district.save()

        createdVillages.push({
          _id: newVillage._id,
          district_id: newVillage.district_id,
          village_name: newVillage.village_name,
        })
      }

      return apiHandler({
        res,
        status: 'success',
        code: 201,
        message: 'Villages created successfully',
        data: createdVillages,
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
