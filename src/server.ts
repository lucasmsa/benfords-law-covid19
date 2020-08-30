import express from 'express'
import covidDataRoutes from './routes/covidData.routes'

const app = express()

app.use(express.json())
app.use(covidDataRoutes)

app.listen(5000, () => {
  console.log('App listening on port 5000! 🐘')
})
