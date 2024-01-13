import Party from '../models/partyModel.js'
import apiHandler from '../utils/apiHandler.js'
const adminPartyController = {
  createNewParty: async (req, res) => {
    try {
      let { name, code, path, logoUrl } = req.body

      if (!name || !code || !path) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Missing required fields',
          error: null,
        })
      }
      name = name.toLowerCase()
      code = code.toLowerCase()

      const existingParty = await Party.findOne({ code })
      if (existingParty) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Party already exists',
          error: null,
        })
      }

      const newParty = new Party({
        logoUrl,
        name,
        code,
        path,
      })
      await newParty.save()

      return apiHandler({
        res,
        status: 'success',
        code: 201,
        message: 'Party created successfully',
        data: {
          _id: newParty._id,
          logoUrl: newParty.logoUrl,
          name: newParty.name,
          path: newParty.path,
          code: newParty.code,
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

  getAllParties: async (req, res) => {
    try {
      const allParties = await Party.find()
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Parties retrieved successfully',
        data: allParties,
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

export default adminPartyController
