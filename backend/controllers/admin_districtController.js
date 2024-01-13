import { District, Regency } from '../models/regionModel.js'

import apiHandler from '../utils/apiHandler.js'
const adminDistrictController = {
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
  createMultipleDistricts: async (req, res) => {
    try {
      const districtsData = req.body

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

      const createdDistricts = []

      for (const districtData of districtsData) {
        const { district_name, regency_id } = districtData

        if (!district_name || !regency_id) {
          return apiHandler({
            res,
            status: 'error',
            code: 400,
            message: 'Missing required fields in district data',
            error: null,
          })
        }

        const regency = await Regency.findById(regency_id)

        if (!regency) {
          return apiHandler({
            res,
            status: 'error',
            code: 400,
            message: `Regency with ID ${regency_id} not found`,
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

        createdDistricts.push({
          _id: newDistrict._id,
          district_name: newDistrict.district_name,
          regency_id: newDistrict.regency_id,
        })
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

      const regency = await Regency.findById(regency_id)

      if (!regency) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: `Regency with ID ${regency_id} not found`,
          error: null,
        })
      }

      const createdDistricts = []

      for (const districtData of districtsData) {
        const { district_name, code } = districtData

        if ((!district_name, !code)) {
          return apiHandler({
            res,
            status: 'error',
            code: 400,
            message: 'Missing required fields in district data',
            error: null,
          })
        }

        const newDistrict = new District({
          district_name,
          code,
          regency_id,
        })

        await newDistrict.save()

        regency.districts.push(newDistrict._id)
        await regency.save()

        createdDistricts.push({
          _id: newDistrict._id,
          district_name: newDistrict.district_name,
          code: newDistrict.code,
          regency_id: newDistrict.regency_id,
        })
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
}

export default adminDistrictController
