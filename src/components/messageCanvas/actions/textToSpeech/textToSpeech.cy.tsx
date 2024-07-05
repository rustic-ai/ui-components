import type { ThreadableMessage } from '../../../types' // Adjust if needed
import TextToSpeech from './textToSpeech'

describe('TextToSpeech Component', () => {
  const mockMessage: ThreadableMessage = {
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
  const textToSpeechButton = '[data-cy="text-to-speech-button"]'
  const tooltip = '[role="tooltip"]'
  it('shows tooltips on hover', () => {
    cy.mount(<TextToSpeech message={mockMessage} />)
    cy.get(textToSpeechButton).trigger('mouseover')
    cy.get(tooltip).should('be.visible').and('have.text', 'Text to speech')
    cy.get(textToSpeechButton).click()
    cy.get(tooltip).should('be.visible').and('have.text', 'Stop speech')
  })

  it('combines text content correctly', () => {
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
})
