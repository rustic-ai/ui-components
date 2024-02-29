import Table from './table'

describe('Table', () => {
  const testData = [
    { col1: 'abc', col2: 123 },
    { col1: 'def', col2: 456 },
  ]
  const firstRowIndex = 0

  it('renders data rows and cells', () => {
    cy.mount(<Table data={testData} />)

    cy.get('tbody tr').should('have.length', testData.length)
    cy.get('tbody tr:first td:first').contains(testData[firstRowIndex].col1)
    cy.get('tbody tr:first td:last').contains(testData[firstRowIndex].col2)
  })

  it('renders title if provided', () => {
    cy.mount(<Table title="Test Title" data={testData} />)
    cy.get('[data-cy="table-title"]').contains('Test Title')
  })

  it('renders description if provided', () => {
    cy.mount(<Table description="Test Description" data={testData} />)
    cy.get('[data-cy="table-description"]').should(
      'contain',
      'Test Description'
    )
  })

  it('renders headers based on data keys even though headers are not provided', () => {
    cy.mount(<Table data={testData} />)
    Object.keys(testData[firstRowIndex]).forEach((item) => {
      cy.get('th').contains(item, { matchCase: false })
    })
  })

  it('renders headers if provided', () => {
    const headers = ['column 1', 'column 2']
    cy.mount(<Table headers={headers} data={testData} />)
    headers.forEach((header) => {
      cy.get('th').contains(header, { matchCase: false })
    })
  })
})
