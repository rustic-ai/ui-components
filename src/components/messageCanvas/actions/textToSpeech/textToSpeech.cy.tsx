import type { Message } from '../../../types' // Adjust if needed
import TextToSpeech from './textToSpeech'

describe('TextToSpeech Component', () => {
  const mockMessage: Message = {
    id: '1',
    timestamp: '2020-01-02T00:00:00.000Z',
    conversationId: 'lkd9vc',
    topic: 'default',
    format: 'text',
    sender: { name: 'Scheduling agent', id: 'bh1hbjkidjn' },
    data: {
      title: 'Sample Title.',
      description: 'This is a sample description.',
      text: 'The main message text.',
    },
  }
  const textToSpeechButton = '[data-cy="start-reading-aloud-button"]'
  const tooltip = '[role="tooltip"]'
  it('shows tooltips on hover', () => {
    cy.mount(<TextToSpeech message={mockMessage} />)
    cy.get(textToSpeechButton).trigger('mouseover')
    cy.get(tooltip).should('be.visible').and('have.text', 'Start reading aloud')
    cy.get(textToSpeechButton).click()
    cy.get(tooltip).should('be.visible').and('have.text', 'Stop reading aloud')
  })

  it('reads the correct content for text-based components correctly', () => {
    // Mock speechSynthesis.speak to extract the text
    cy.window().then((win) => {
      cy.stub(win.speechSynthesis, 'speak').callsFake((utterance) => {
        expect(utterance.text).to.equal(
          'Sample Title. This is a sample description. The main message text.'
        )
      })
    })
    cy.mount(<TextToSpeech message={mockMessage} />)
    cy.get(textToSpeechButton).click()
  })

  it('reads the correct content for visualization components correctly', () => {
    cy.window().then((win) => {
      cy.stub(win.speechSynthesis, 'speak').callsFake((utterance) => {
        expect(utterance.text).to.equal(
          'Sample Title. This is a sample description. The alternative text.'
        )
      })
    })
    cy.mount(
      <TextToSpeech
        message={{
          id: '1',
          timestamp: '2020-01-02T00:00:00.000Z',
          conversationId: 'lkd9vc',
          topic: 'default',
          format: 'table',
          sender: { name: 'Scheduling agent', id: 'bh1hbjkidjn' },
          data: {
            title: 'Sample Title.',
            description: 'This is a sample description.',
            alt: 'The alternative text.',
            data: [
              { col1: 'abc', col2: 123 },
              { col1: 'def', col2: 456 },
            ],
          },
        }}
      />
    )

    cy.get(textToSpeechButton).click()
  })

  it('reads the correct content for media components correctly', () => {
    cy.window().then((win) => {
      cy.stub(win.speechSynthesis, 'speak').callsFake((utterance) => {
        expect(utterance.text).to.equal(
          'Sample Title. This is a sample description. Transcript content.'
        )
      })
    })
    cy.mount(
      <TextToSpeech
        message={{
          id: '1',
          timestamp: '2020-01-02T00:00:00.000Z',
          conversationId: 'lkd9vc',
          topic: 'default',
          format: 'sound',
          sender: { name: 'Scheduling agent', id: 'bh1hbjkidjn' },
          data: {
            title: 'Sample Title.',
            description: 'This is a sample description.',
            transcript: 'Transcript content.',
            src: '/audioExamples/audioStorybook.mp3',
          },
        }}
      />
    )

    cy.get(textToSpeechButton).click()
  })
})
