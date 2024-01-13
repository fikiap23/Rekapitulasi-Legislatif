import { Regency } from '../models/regionModel.js'

import apiHandler from '../utils/apiHandler.js'

const adminRegencyController = {
  createNewRegency: async (req, res) => {
    try {
      const { regency_name } = req.body

      if (!regency_name) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Missing required fields',
          error: null,
        })
      }

      const newRegency = new Regency({
        regency_name,
      })

      await newRegency.save()

      return apiHandler({
        res,
        status: 'success',
        code: 201,
        message: 'Regency created successfully',
        data: {
          _id: newRegency._id,
          regency_name: newRegency.regency_name,
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

export default adminRegencyController
