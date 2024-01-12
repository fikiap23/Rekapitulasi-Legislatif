import Admin from '../models/adminModel.js'
import User from '../models/userModel.js'
import { District, Regency, Village } from '../models/regionModel.js'
import Party from '../models/partyModel.js'
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js'

const adminController = {
  //* kelola user
  createNewUser: async (req, res) => {
    try {
      const { username, password, village_id } = req.body

      // Validate input not null
      if (!username || !password || !village_id) {
        return res.status(400).json({ error: 'All fields are required' })
      }

      // check is village exists
      const village = await Village.findById(village_id)
      if (!village) {
        return res.status(400).json({ error: 'Village not found' })
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' })
      }

      // Encrypt password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Create new user
      const newUser = new User({
        username,
        password: hashedPassword,
        village_id,
      })
      await newUser.save()

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        village_id: newUser.village_id,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('Error in createNewUser: ', error.message)
    }
  },

  //* kelola partai
  createNewParty: async (req, res) => {
    try {
      let { name, code, path, logoUrl } = req.body

      // Validate input
      if (!name || !code || !path) {
        return res.status(400).json({ error: 'Missing required fields' })
      }
      name = name.toLowerCase()
      code = code.toLowerCase()

      // Check if the party already exists
      const existingParty = await Party.findOne({ code })
      if (existingParty) {
        return res.status(400).json({ error: 'Party already exists' })
      }

      // Create new party
      const newParty = new Party({
        logoUrl,
        name,
        code,
        path,
      })
      await newParty.save()

      res.status(201).json({
        _id: newParty._id,
        logoUrl: newParty.logoUrl,
        name: newParty.name,
        path: newParty.path,
        code: newParty.code,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('Error in createNewParty: ', error.message)
    }
  },

  getAllParties: async (req, res) => {
    try {
      // Retrieve all parties from the database
      const allParties = await Party.find()

      // Respond with the list of parties
      res.status(200).json(allParties)
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('Error in getAllParties: ', error.message)
    }
  },

  //* kelola desa
  createNewVillage: async (req, res) => {
    try {
      const { village_name, total_voters, district_id } = req.body

      // Check if input is null
      if (!village_name || !total_voters || !district_id) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // check if district exists
      const district = await District.findById(district_id)
      if (!district) {
        return res.status(400).json({ error: 'District not found' })
      }

      const newVillage = new Village({
        village_name,
        district_id,
        total_voters,
      })

      await newVillage.save()

      // add to district
      district.villages.push(newVillage._id)
      await district.save()

      res.status(201).json({
        _id: newVillage._id,
        district_id: newVillage.district_id,
        village_name: newVillage.village_name,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('Error in createNewVillage: ', error.message)
    }
  },

  //* kelola kecamatan
  createNewDistrict: async (req, res) => {
    try {
      const { district_name, regency_id } = req.body

      // Check if input is null
      if (!district_name || !regency_id) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // check if regency exists
      const regency = await Regency.findById(regency_id)
      if (!regency) {
        return res.status(400).json({ error: 'Regency not found' })
      }

      const newDistrict = new District({
        district_name,
        regency_id,
      })

      await newDistrict.save()

      // add to regency
      regency.districts.push(newDistrict._id)
      await regency.save()

      res.status(201).json({
        _id: newDistrict._id,
        district_name: newDistrict.district_name,
        regency_id: newDistrict.regency_id,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('Error in createNewDistrict: ', error.message)
    }
  },

  //*kelola kabupaten
  createNewRegency: async (req, res) => {
    try {
      const { regency_name } = req.body

      // Check if input is null
      if (!regency_name) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const newRegency = new Regency({
        regency_name,
      })

      await newRegency.save()

      res.status(201).json({
        _id: newRegency._id,
        regency_name: newRegency.regency_name,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('Error in createNewRegency: ', error.message)
    }
  },
}

export default adminController
