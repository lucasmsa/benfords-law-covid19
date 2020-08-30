import { Router } from 'express'
import CovidDeathsService from '../services/CovidDeathsService'

const covidDeathsService = new CovidDeathsService()

const covidDataRoutes = Router()

covidDataRoutes.get('/all', async (req, res) => {

  const covidDataResponse = await covidDeathsService.run()

  console.log(covidDataResponse)

  return res.json(covidDataResponse)
})

export default covidDataRoutes