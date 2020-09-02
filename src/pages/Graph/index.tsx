import React, { useState, useEffect, useMemo } from 'react'
import { Container } from './styles'
import api from '../../services/api'

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

const Graph: React.FC = (props) => {

  const propsRoute = props as RouteParams
  const dataToSearch = propsRoute.match.path
  const place = dataToSearch.split('/')[2]

  const [responseData, setResponseData] = useState<Response>()

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
    
    return totalCases
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
    
    return totalDeaths
  }, [responseData, place])

  
  return (
    <Container>
      {totalCasesData.length && <h1>{totalCasesData}</h1>}
      {totalDeathsData.length && <h1>{totalDeathsData}</h1>}
    </Container>
  )
}

export default Graph