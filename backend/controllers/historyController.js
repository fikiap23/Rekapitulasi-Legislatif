import History from '../models/historyModel.js'

import apiHandler from '../utils/apiHandler.js'
const historyController = {
  getAllHistoryByTps: async (req, res) => {
    try {
      const { tpsId } = req.params
      const history = await History.find({ tps_id: tpsId })
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'Voting results for all Hisotry retrieved successfully',
        data: history,
        error: null,
      })
    } catch (error) {
      console.error('Error getting total results by district:', error)
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
export default historyController
