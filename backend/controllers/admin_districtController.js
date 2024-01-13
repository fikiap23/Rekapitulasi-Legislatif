import { District, Regency } from '../models/regionModel.js'

import apiHandler from '../utils/apiHandler.js'
const adminDistrictController = {
  createNewDistrict: async (req, res) => {
    try {
      const { district_name, regency_id } = req.body

      if (!district_name || !regency_id) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Missing required fields',
          error: null,
        })
      }

      const regency = await Regency.findById(regency_id)
      if (!regency) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Regency not found',
          error: null,
        })
      }

      const newDistrict = new District({
        district_name,
        regency_id,
      })

      await newDistrict.save()

      regency.districts.push(newDistrict._id)
      await regency.save()

      return apiHandler({
        res,
        status: 'success',
        code: 201,
        message: 'District created successfully',
        data: {
          _id: newDistrict._id,
          district_name: newDistrict.district_name,
          regency_id: newDistrict.regency_id,
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

export default adminDistrictController
