import User from '../models/userModel.js'
import { District, Regency, Village } from '../models/regionModel.js'
import Party from '../models/partyModel.js'
import bcrypt from 'bcryptjs'
import apiHandler from '../utils/apiHandler.js'

const adminController = {
  createNewUser: async (req, res) => {
    try {
      const { username, password, village_id } = req.body

      if (!username || !password || !village_id) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'All fields are required',
          error: null,
        })
      }

      const village = await Village.findById(village_id)
      if (!village) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Village not found',
          error: null,
        })
      }

      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'User already exists',
          error: null,
        })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const newUser = new User({
        username,
        password: hashedPassword,
        village_id,
      })
      await newUser.save()

      return apiHandler({
        res,
        status: 'success',
        code: 201,
        message: 'User created successfully',
        data: {
          _id: newUser._id,
          username: newUser.username,
          village_id: newUser.village_id,
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

export default adminController
