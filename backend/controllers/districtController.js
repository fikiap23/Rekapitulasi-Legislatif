import { District, Regency } from '../models/regionModel.js'

import apiHandler from '../utils/apiHandler.js'
const districtController = {
  createNewDistrict: async (req, res) => {
    try {
      const { district_name, regency_id, code } = req.body

      if (!district_name || !regency_id || !code) {
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
        code,
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
          code: newDistrict.code,
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

  createMultipleDistrictsByRegency: async (req, res) => {
    try {
      const { regency_id } = req.params
      const districtsData = req.body

      if (!regency_id) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Missing regency_id parameter',
          error: null,
        })
      }

      //   Check if the regency exists
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

      if (
        !districtsData ||
        !Array.isArray(districtsData) ||
        districtsData.length === 0
      ) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Invalid or missing districts data',
          error: null,
        })
      }

      const createdDistricts = await District.insertMany(
        districtsData.map((district) => ({ ...district, regency_id }))
      )

      // Update the regency's districts array
      if (regency) {
        regency.districts.push(
          ...createdDistricts.map((district) => district._id)
        )
        await regency.save()
      }

      return apiHandler({
        res,
        status: 'success',
        code: 201,
        message: 'Districts created successfully',
        data: createdDistricts,
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
  getAllDistricts: async (req, res) => {
    try {
      const allDistricts = await District.find().populate(
        'villages',
        'village_name'
      )

      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'All districts retrieved successfully',
        data: allDistricts,
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
