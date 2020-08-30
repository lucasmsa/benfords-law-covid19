import puppeteer, { Page } from 'puppeteer'

export default class CovidDeathsService {

  private data: []

  constructor() {
    this.data = []
  }

  public async run(): Promise<[] | Page> {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.worldometers.info/coronavirus/')   
    
    await page.evaluate(() => {
      
      let table = document.getElementById('main_table_countries_today')
      let allCountriesTable = table?.getElementsByTagName('tbody')[0]
      let allCountriesRows = allCountriesTable?.getElementsByTagName('tr')

      // for (var country in allCountriesRows) {
      //   this.data.push(country as unknown as never)
      // }

      this.data.push(allCountriesRows as unknown as never)
    })

    await browser.close()
    return this.data
  }
}