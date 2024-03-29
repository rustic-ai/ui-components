import { supportedViewports } from '../../../cypress/support/variables'
import Table from './table'

describe('Table', () => {
  const testData = [
    { col1: 'abc', col2: 123 },
    { col1: 'def', col2: 456 },
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
  })
})
