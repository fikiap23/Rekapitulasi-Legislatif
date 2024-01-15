import { District, Village } from '../models/regionModel.js'
import apiHandler from '../utils/apiHandler.js'

const villageController = {
  createOneVillage: async (req, res) => {
    try {
      const { village_name, code, total_voters, district_id } = req.body

      if (!village_name || !total_voters || !district_id || !code) {
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

      // Check if code already exists
      const existingVillage = await Village.findOne({ code })
      if (existingVillage) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Village already exists',
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

  createBulkVillages: async (req, res) => {
    try {
      const villagesData = req.body

      if (!villagesData || !Array.isArray(villagesData)) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Invalid villages data format',
          error: null,
        })
      }

      // Ambil semua district_ids dari villagesData
      const districtIdsSet = new Set(
        villagesData.map((village) => village.district_id)
      )
      const districtIds = Array.from(districtIdsSet)

      // Periksa apakah semua district_ids ada di database
      const districtsExist = await District.find({ _id: { $in: districtIds } })

      // Jika ada district_ids yang tidak ditemukan, kembalikan respons error
      if (districtIds.length !== districtsExist.length) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'One or more districts not found',
          error: null,
        })
      }

      const villageIds = villagesData.map((village) => village.code)

      const foundVillages = await Village.find({ code: { $in: villageIds } })

      if (foundVillages.length > 0) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'One or more villages already exist',
          error: null,
        })
      }

      // Semua distrik ditemukan, lanjutkan dengan menyimpan desa
      const createdVillages = await Village.insertMany(villagesData)

      // Loop melalui setiap desa dan tambahkan _id desa ke array villages di masing-masing distrik
      for (const village of createdVillages) {
        const district = districtsExist.find(
          (d) => d._id.toString() === village.district_id.toString()
        )
        district.villages.push(village._id)
        await district.save()
      }

      return apiHandler({
        res,
        status: 'success',
        code: 201,
        message:
          'Bulk villages created and associated with districts successfully',
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

  createBulkVillagesByDistrict: async (req, res) => {
    try {
      const villagesData = req.body
      const { district_id } = req.params

      if (!district_id || !villagesData || !Array.isArray(villagesData)) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Invalid request format',
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

      // Menambahkan district_id ke setiap objek desa
      const villagesWithDistrictId = villagesData.map((village) => ({
        ...village,
        district_id,
      }))

      const villageIds = villagesData.map((village) => village.code)

      const foundVillages = await Village.find({
        code: { $in: villageIds },
      })

      if (foundVillages.length > 0) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'One or more villages already exist',
          error: null,
        })
      }

      const createdVillages = await Village.insertMany(villagesWithDistrictId)

      createdVillages.forEach((village) => {
        district.villages.push(village._id)
      })

      await district.save()

      return apiHandler({
        res,
        status: 'success',
        code: 201,
        message:
          'Bulk villages created and associated with the district successfully',
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
