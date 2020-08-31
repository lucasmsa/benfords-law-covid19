import { Router } from 'express'
import CovidWorldDataService from '../services/CovidWorldDataService'

const covidWorldDataService = new CovidWorldDataService()

const covidDataRoutes = Router()

covidDataRoutes.get('/all', async (req, res) => {

  const covidDataResponse = await covidWorldDataService.run()

  console.log(covidDataResponse)

  return res.json(covidDataResponse)
})

export default covidDataRoutes