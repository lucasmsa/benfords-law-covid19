import React, { useState, useEffect, useMemo } from 'react'
import { Container, GraphContainer } from './styles'
import api from '../../services/api'
import belfordsLawNumbers from '../../utils/belfordsLawNumbers'
import getNumberOcurrences  from '../../utils/extractNumbeOcurrences'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


interface RouteParams {
  match: {
    path: string
  }
}

interface Response {
  Countries?: CountriesData[]
  data?: BrazilStatesData[]
}

interface CountriesData {
  TotalDeaths?: number,
  TotalConfirmed?: number
}

interface BrazilStatesData {
  deaths?: number,
  cases?: number
}

interface DataPercentage {
  [key: string]: number;
}

interface DataGraphInterface {
  name: string;
  Belfords_law?: number;
  Covid_cases?: number;
  Covid_deaths?: number;
}


const Graph: React.FC = (props) => {

  const propsRoute = props as RouteParams
  const dataToSearch = propsRoute.match.path
  const place = dataToSearch.split('/')[2]

  const [responseData, setResponseData] = useState<Response>()

  const [deathsPercentage, setDeathsPercentage] = useState<DataPercentage>({})
  const [casesPercentage, setCasesPercentage] = useState<DataPercentage>({})
  const [selector, setSelector] = useState<'deaths' | 'cases'>('cases')

  useEffect(() => {
    async function loadDataWorld(): Promise<void> {
      await api.get('https://api.covid19api.com/summary').then((response) => {
        setResponseData(response.data)
      }) 
    }

    async function loadDataBrazil(): Promise<void> {
      await api.get('https://covid19-brazil-api.now.sh/api/report/v1').then((response) => {
        setResponseData(response.data)
      }) 
    }

    place === 'world' && loadDataWorld()
    place === 'brazil' && loadDataBrazil()
  }, [place])


  const totalCasesData = useMemo(() => {
    const totalCases: number[] = []
    
    if (place === 'world' && responseData?.Countries){
      responseData.Countries.forEach((country) => {
        country.TotalConfirmed &&
          totalCases.push(Number(country.TotalConfirmed.toString()[0]))
      })
    } else if (place === 'brazil' && responseData?.data) {
      responseData.data.forEach((state) => {
        state.cases &&
          totalCases.push(Number(state.cases.toString()[0]))
      })
    }

    const valueCasesPercentage: DataPercentage = getNumberOcurrences(totalCases)

    return valueCasesPercentage
  }, [responseData, place])


  const totalDeathsData = useMemo(() => {
    const totalDeaths: number[] = []

    if (place === 'world' && responseData?.Countries){
      responseData.Countries.forEach((country) => {
        country.TotalDeaths &&
          totalDeaths.push(Number(country.TotalDeaths.toString()[0]))
      })
    } else if (place === 'brazil' && responseData?.data) {
      responseData.data.forEach((state) => {
        state.deaths &&
          totalDeaths.push(Number(state.deaths.toString()[0]))
      })
    }

    const valueDeathsPercentage: DataPercentage = getNumberOcurrences(totalDeaths)

    return valueDeathsPercentage
  }, [responseData, place])


  const dataToGraph = useMemo(() => {
    const data: DataGraphInterface[] = [{ name: '' }]

    for (var number = 1; number < 10; number++){
      let number_str = number.toString()
      console.log(belfordsLawNumbers)

      data.push({
        name: number_str,
        Belfords_law: belfordsLawNumbers[number_str],
        Covid_cases: totalCasesData[number_str],
        Covid_deaths: totalDeathsData[number_str]
      })
    }

    data.push({ name: '' })
    console.log(data)
    return data
  }, [totalCasesData, totalDeathsData])

  return (
    <Container>
      {totalCasesData.length && <h1>{totalCasesData}</h1>}
      {totalDeathsData.length && <h1>{totalDeathsData}</h1>}
      <GraphContainer>
       {dataToGraph && (

        <LineChart
          width={700}
          height={600}
          data={dataToGraph}
          
          style={{background: 'none'}}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >

          <CartesianGrid stroke='#000' fill='#a5bbad'/>
          <XAxis dataKey="name"  stroke='#000'  />
          <YAxis stroke='#000'/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Belfords_law" stroke='#893' strokeDasharray="6" strokeWidth='6px'/>
          <Line type="natural" dataKey="Covid_cases" stroke="#5e2a41" strokeWidth='6px' />
        </LineChart>  
      
       )}
      </GraphContainer>
    </Container>
  )
}

export default Graph