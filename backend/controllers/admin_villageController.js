import { District, Regency, Village } from '../models/regionModel.js'

import apiHandler from '../utils/apiHandler.js'
const adminVillageController = {
  createNewVillage: async (req, res) => {
    try {
      const { village_name, total_voters, district_id } = req.body

      if (!village_name || !total_voters || !district_id) {
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
}

export default adminVillageController
