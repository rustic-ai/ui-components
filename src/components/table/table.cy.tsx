import { supportedViewports } from '../../../cypress/support/variables'
import Table from './table'

describe('Table', () => {
  const testData = [
    { col1: 'abc', col2: 123 },
    { col1: 'def', col2: 456 },
  ]

  const manyDataRows = [
    {
      food: 'rice milk',
      calories: 120,
      carbs: 22.0,
      protein: 1.0,
      fat: 2.5,
    },
    {
      food: 'almond milk',
      calories: 30,
      carbs: 1.0,
      protein: 1.0,
      fat: 2.5,
    },
    {
      food: 'soy milk',
      calories: 80,
      carbs: 4.0,
      protein: 7.0,
      fat: 4.0,
    },
    {
      food: 'coconut milk',
      calories: 45,
      carbs: 2.0,
      protein: 0.5,
      fat: 4.5,
    },
    {
      food: 'oat milk',
      calories: 120,
      carbs: 16.0,
      protein: 3.0,
      fat: 5.0,
    },
    {
      food: 'hemp milk',
      calories: 70,
      carbs: 1.0,
      protein: 3.0,
      fat: 6.0,
    },
    {
      food: 'cashew milk',
      calories: 25,
      carbs: 1.0,
      protein: 1.0,
      fat: 2.0,
    },
    {
      food: 'pea milk',
      calories: 70,
      carbs: 0.0,
      protein: 8.0,
      fat: 4.5,
    },
    {
      food: 'goat milk',
      calories: 168,
      carbs: 11.0,
      protein: 9.0,
      fat: 10.0,
    },
    {
      food: 'camel milk',
      calories: 107,
      carbs: 5.8,
      protein: 5.2,
      fat: 4.5,
    },
    {
      food: 'buffalo milk',
      calories: 237,
      carbs: 12.0,
      protein: 9.0,
      fat: 16.0,
    },
  ]

  const firstRowIndex = 0

  supportedViewports.forEach((viewport) => {
    it(`renders data rows and cells correctly on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<Table data={testData} />)

      cy.get('tbody tr').should('have.length', testData.length)
      cy.get('tbody tr:first td:first').contains(testData[firstRowIndex].col1)
      cy.get('tbody tr:first td:last').contains(testData[firstRowIndex].col2)
    })

    it(`renders title if provided on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<Table title="Test Title" data={testData} />)
      cy.get('[data-cy="table-title"]').contains('Test Title')
    })

    it(`renders description if provided on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<Table description="Test Description" data={testData} />)
      cy.get('[data-cy="table-description"]').should(
        'contain',
        'Test Description'
      )
    })

    it(`renders headers based on data keys if headers props are not provided on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<Table data={testData} />)
      Object.keys(testData[firstRowIndex]).forEach((item) => {
        cy.get('th').contains(item, { matchCase: false })
      })
    })

    it(`renders headers if provided on ${viewport} screen`, () => {
      cy.viewport(viewport)
      const headers = [
        { dataKey: 'col2', label: 'column 2' },
        { dataKey: 'col1', label: 'column 1' },
      ]
      cy.mount(<Table headers={headers} data={testData} />)
      headers.forEach((header) => {
        cy.get('th').contains(header.label, { matchCase: false })
      })

      cy.get('.rustic-table tbody tr').each((row) => {
        cy.wrap(row)
          .find('td')
          .each((cell, index) => {
            const header = headers[index]
            const value = (testData as Record<string, any>)[row.index()][
              header.dataKey
            ]
            expect(cell.text().trim()).to.equal(value.toString())
          })
      })
    })

    it(`shows 'No data available' if empty array is provided on ${viewport} screen`, () => {
      cy.viewport(viewport)

      cy.mount(<Table data={[]} />)
      cy.get('p').contains('No data available')
    })

    it(`does not show data if its header is not in the headers props on ${viewport} screen`, () => {
      cy.viewport(viewport)
      const headers = [{ dataKey: 'col1' }, { dataKey: 'col2' }]
      const testDataWithExtra = [...testData, { col1: 'ghl', col3: 'extra' }]
      cy.mount(<Table headers={headers} data={testDataWithExtra} />)
      cy.contains('extra').should('not.exist')
    })

    it(`can render rows based on headers on ${viewport} screen`, () => {
      cy.viewport(viewport)
      const headers = [{ dataKey: 'col2' }, { dataKey: 'col1' }]
      cy.mount(<Table headers={headers} data={testData} />)
      cy.get('th').each((th, index) => {
        expect(th.text().trim().toLowerCase()).contains(headers[index].dataKey)
      })

      cy.get('.rustic-table tbody tr').each((row) => {
        cy.wrap(row)
          .find('td')
          .each((cell, index) => {
            const header = headers[index]
            const value = (testData as Record<string, any>)[row.index()][
              header.dataKey
            ]
            expect(cell.text().trim()).to.equal(value.toString())
          })
      })
    })

    it(`has pagination if there are more than 10 data rows on ${viewport} screen`, () => {
      const tablePagination = '[data-cy="table-pagination"]'
      const initialRowsPerPage = 10

      cy.viewport(viewport)
      cy.mount(<Table data={manyDataRows} />)
      cy.get('tbody tr').should('have.length', initialRowsPerPage)
      cy.get(tablePagination).should(
        'contain',
        `1–${initialRowsPerPage} of ${manyDataRows.length}`
      )
      cy.get(`${tablePagination} button`).last().click()
      cy.get('tbody tr').should('have.length', 1)
      cy.get(tablePagination).should(
        'contain',
        `11–11 of ${manyDataRows.length}`
      )
    })

    it(`can sort by the headers on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<Table data={manyDataRows} />)

      cy.get('tbody tr').first().should('contain', 'rice milk')

      // sort by food
      cy.get('tr th').first().click()
      cy.get('tbody tr').first().should('contain', 'almond milk')
    })
  })
})
