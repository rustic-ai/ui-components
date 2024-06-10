import type { Sender } from '../../src'

export const supportedViewports = ['iphone-6' as const, 'macbook-13' as const]

export const testUser: Sender = {
  id: '12345678',
  name: 'Test User',
}

export const botUser: Sender = {
  id: '987654',
  name: 'Scheduling Agent',
}
