import { expect, test, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { analyze } from '../src/lib/analysis'
import { formatInt, formatMad, formatP, formatStat } from '../src/lib/format'
import { sampleValues, type SamplingChoice } from '../src/lib/sampling'
import type { Dataset } from '../src/lib/series'
import type { DigitTest } from '../src/lib/benford'

const world = JSON.parse(readFileSync('public/data/world.json', 'utf8')) as Dataset
const brazil = JSON.parse(readFileSync('public/data/brazil.json', 'utf8')) as Dataset

const fullWindow = (dataset: Dataset) => ({ start: 0, end: dataset.dates.length - 1 })

async function expectFitPanel(page: Page, dataset: Dataset, choice: SamplingChoice, test: DigitTest) {
  const expected = analyze(sampleValues(dataset, choice), test)
  await expect(page.getByTestId('fit-n')).toHaveText(formatInt(expected.distribution.n))
  await expect(page.getByTestId('fit-chi')).toHaveText(formatStat(expected.chi.statistic))
  await expect(page.getByTestId('fit-critical')).toHaveText(String(expected.chi.criticalValue05))
  await expect(page.getByTestId('fit-p')).toHaveText(formatP(expected.chi.pValue))
  await expect(page.getByTestId('fit-mad')).toHaveText(formatMad(expected.mad))
  return expected
}

test('loads the default world analysis and matches the library output', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText("Benford's law")
  await expect(page.getByRole('heading', { level: 2, name: 'First digit' })).toBeVisible()
  const expected = await expectFitPanel(
    page,
    world,
    { sample: 'all', region: '', metric: 'cases', kind: 'daily', window: fullWindow(world) },
    'first',
  )
  expect(expected.distribution.n).toBeGreaterThan(100_000)
  await expect(page.getByTestId('fit-small-sample')).toHaveCount(0)

  await page.getByRole('button', { name: 'Regions summed, per day' }).click()
  const pooled = await expectFitPanel(
    page,
    world,
    { sample: 'pooled', region: '', metric: 'cases', kind: 'daily', window: fullWindow(world) },
    'first',
  )
  expect(pooled.distribution.n).toBe(world.dates.length)
})

test('switches to Brazil, one state, deaths, first two digits', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Brazil 🇧🇷' }).click()
  await page.getByRole('button', { name: 'One region, per day' }).click()
  await page.getByRole('button', { name: 'Deaths 💀' }).click()
  await page.getByRole('button', { name: 'First two digits' }).click()
  await expect(page.getByRole('combobox', { name: 'state' })).toHaveValue('SP')
  await expect(page.getByRole('heading', { level: 2, name: 'First two digits' })).toBeVisible()
  await expectFitPanel(
    page,
    brazil,
    { sample: 'region', region: 'SP', metric: 'deaths', kind: 'daily', window: fullWindow(brazil) },
    'firstTwo',
  )
  await page.getByRole('combobox', { name: 'state' }).selectOption('RJ')
  await expectFitPanel(
    page,
    brazil,
    { sample: 'region', region: 'RJ', metric: 'deaths', kind: 'daily', window: fullWindow(brazil) },
    'firstTwo',
  )
})

test('one value per region flags the small sample and cumulative changes the numbers', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'One value per region' }).click()
  await page.getByRole('button', { name: 'Cumulative' }).click()
  const expected = await expectFitPanel(
    page,
    world,
    { sample: 'snapshot', region: '', metric: 'cases', kind: 'cumulative', window: fullWindow(world) },
    'first',
  )
  expect(expected.distribution.n).toBe(Object.keys(world.series).length)
  await expect(page.getByTestId('fit-small-sample')).toBeVisible()
})

test('the date window narrows the sample', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Regions summed, per day' }).click()
  const from = page.getByLabel('From')
  await from.fill('300')
  const to = page.getByLabel('To')
  await to.fill('400')
  await expectFitPanel(
    page,
    world,
    { sample: 'pooled', region: '', metric: 'cases', kind: 'daily', window: { start: 300, end: 400 } },
    'first',
  )
  await expect(page.getByText('101 days selected')).toBeVisible()
})

test('screenshot for the README', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('fit-n').waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: 'docs/screenshot.png', fullPage: false })
})
