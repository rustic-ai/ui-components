import { supportedViewports } from '../../../cypress/support/variables'
import FCCalendar from './fCCalendar'

describe('ScheduleCalendar Component', () => {
  const mockEvents = [
    {
      id: '1',
      start: '2024-02-07T10:00:00',
      end: '2024-02-07T12:00:00',
      title: 'Aquarium',
    },
    {
      id: '2',
      start: '2024-02-07T12:00:00',
      end: '2024-02-07T14:00:00',
      title: 'Lunch',
    },
    {
      id: '3',
      start: '2024-02-08T09:00:00',
      end: '2024-02-08T16:00:00',
      title: 'Niagra Falls',
    },
    {
      id: '4',
      start: '2024-02-09T14:00:00',
      end: '2024-02-09T16:00:00',
      title: 'Casa Loma',
    },
    {
      id: '5',
      start: '2024-02-09T10:30:00',
      end: '2024-02-09T12:30:00',
      title: 'Royal Ontario Museum',
    },
  ]

  const eventTitle = '*[class^="fc-event-title"]'
  const prevButton = '*[class^="fc-prev-button"]'
  const nextButton = '*[class^="fc-next-button"]'
  const initialDate = '7 Wednesday' // first event
  const initialWeek = '4 Sun' // week of first event
  const initialMonth = 'February 2024' // month of first event

  beforeEach(() => {
    cy.mount(<FCCalendar events={mockEvents} />)
  })

  supportedViewports.forEach((viewport) => {
    it(`allows the user to navigate to the next and previous week on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('button').contains('week').click()
      cy.get(prevButton).click()
      cy.contains('29 Mon').should('be.visible')
      cy.get(nextButton).click()
      cy.contains('7 Wed').should('be.visible')
    })

    it(`allows the user to navigate to the next and previous day on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('button').contains('day').click()
      cy.get(prevButton).click()
      cy.contains('6 Tuesday').should('be.visible')
      cy.get(nextButton).click()
      cy.contains(initialDate).should('be.visible')
    })
  })

  context('Desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-13')
      cy.mount(<FCCalendar events={mockEvents} />)
    })

    it('can toggle to show week view and day view on screen', () => {
      cy.get('button').contains('week').click()
      cy.contains(initialWeek).should('be.visible')
      cy.get('button').contains('day').click()
      cy.contains(initialDate).should('be.visible')
    })

    it('can show the title and events properly', () => {
      cy.contains(initialMonth).should('be.visible')
      cy.get(eventTitle).first().contains('Aquarium').should('be.visible')
      cy.get(eventTitle).last().contains('Casa Loma').should('be.visible')
    })

    it('allows the user to navigate to the next and previous month', () => {
      cy.get(prevButton).click()
      cy.contains('January 2024').should('be.visible')
      cy.get(nextButton).click()
      cy.contains(initialMonth).should('be.visible')
    })
  })

  context('Mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
      cy.mount(<FCCalendar events={mockEvents} />)
    })

    it('can toggle to show week view and day view on screen', () => {
      cy.get('button').contains('week').click()
      cy.contains(initialWeek).should('be.visible')
      cy.get('button').contains('day').click()
      cy.contains(initialDate).should('be.visible')
    })

    it('can show the title and events properly', () => {
      cy.contains(initialDate).should('be.visible')
      cy.get(eventTitle).first().contains('Aquarium').should('exist')
      cy.get(eventTitle).last().contains('Lunch').should('exist')
    })

    it('allows the user to navigate to the next and previous month', () => {
      cy.get('button').contains('month').click()
      cy.get(prevButton).click()
      cy.contains('January 2024').should('be.visible')
      cy.get(nextButton).click()
      cy.contains(initialMonth).should('be.visible')
    })
  })
})
