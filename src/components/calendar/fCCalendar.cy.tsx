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
  const eventTime = '*[class^="fc-event-time"]'
  const prevButton = '*[class^="fc-prev-button"]'
  const nextButton = '*[class^="fc-next-button"]'
  const initialDate = 'Feb 7, 2024'
  const initialWeek = 'Feb 4 – 10, 2024'
  const initialMonth = 'Feb 2024'

  beforeEach(() => {
    cy.mount(<FCCalendar events={mockEvents} />)
  })

  supportedViewports.forEach((viewport) => {
    it(`can toggle to show week view and day view on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('button').contains('week').click()
      cy.contains(initialWeek).should('be.visible')
      cy.get('button').contains('day').click()
      cy.contains(initialDate).should('be.visible')
    })

    it(`can toggle to show week view and day view on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('button').contains('week').click()
      cy.contains(initialWeek).should('be.visible')
      cy.get('button').contains('day').click()
      cy.contains(initialDate).should('be.visible')
    })

    it(`allows the user to navigate to the next and previous week on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('button').contains('week').click()
      cy.get(prevButton).click()
      cy.contains('Jan 28 – Feb 3, 2024').should('be.visible')
      cy.get(nextButton).click()
      cy.contains(initialWeek).should('be.visible')
    })

    it(`allows the user to navigate to the next and previous day on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('button').contains('day').click()
      cy.get(prevButton).click()
      cy.contains('Feb 6, 2024').should('be.visible')
      cy.get(nextButton).click()
      cy.contains(initialDate).should('be.visible')
    })
  })

  context('Desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-13')
      cy.mount(<FCCalendar events={mockEvents} />)
    })

    it('can show the title and events properly', () => {
      cy.contains(initialMonth).should('be.visible')
      cy.get(eventTitle).first().contains('Aquarium').should('be.visible')
      cy.get(eventTime).first().contains('10:00 AM').should('be.visible')
      cy.get(eventTitle).last().contains('Casa Loma').should('be.visible')
      cy.get(eventTime).last().contains('02:00 PM').should('be.visible')
    })

    it('allows the user to navigate to the next and previous month', () => {
      cy.get(prevButton).click()
      cy.contains('Jan 2024').should('be.visible')
      cy.get(nextButton).click()
      cy.contains(initialMonth).should('be.visible')
    })
  })

  context('Mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
      cy.mount(<FCCalendar events={mockEvents} />)
    })

    it('can show the title and events properly', () => {
      cy.contains(initialDate).should('be.visible')
      cy.get(eventTitle).first().contains('Aquarium').should('be.visible')
      cy.get(eventTime).first().contains('10:00 AM').should('be.visible')
      cy.get(eventTitle).last().contains('Lunch').should('be.visible')
      cy.get(eventTime)
        .last()
        .should('contain', '12:00 PM')
        .and('contain', '02:00 PM')
    })

    it('allows the user to navigate to the next and previous month', () => {
      cy.get('button').contains('month').click()
      cy.get(prevButton).click()
      cy.contains('Jan 2024').should('be.visible')
      cy.get(nextButton).click()
      cy.contains(initialMonth).should('be.visible')
    })
  })
})
