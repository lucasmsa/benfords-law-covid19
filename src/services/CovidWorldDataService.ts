import https from 'https'

interface CountryData {
  TotalConfirmed: number;
  TotalDeaths: number;
}

interface Response {
  deaths: number[],
  cases: number[]
}

export default class CovidWorldDataService {

  private dataDeaths: Array<number>
  private dataConfirmedCases: Array<number>


  constructor() {
    this.dataDeaths = []
    this.dataConfirmedCases = []
  }

  public async run(): Promise<Response> {
  
    https.get('https://api.covid19api.com/summary', (response) => {
      let rawData = ''
      response.setEncoding('utf8')

      response.on('data', async (dataChunk) => {
        rawData += await dataChunk
      })
      response.on('end', () => {
        const parsedData = JSON.parse(rawData)
        const countries = parsedData.Countries
        countries.forEach((country: CountryData) => {
          if(country.TotalConfirmed) {
            console.log(country.TotalConfirmed)
          }

          if(country.TotalDeaths) {
            console.log(country.TotalDeaths)
          }
          console.log('\n')
        })
      })
    })

    return {
      deaths: this.dataDeaths,
      cases: this.dataConfirmedCases
    }
  }
}