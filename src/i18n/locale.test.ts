import { describe, expect, it } from 'vitest'

import { resolveLocale } from './locale'

describe('resolveLocale', () => {
  it('prefers a saved locale over the detected system locale', () => {
    expect(resolveLocale({ storedLocale: 'en', systemLocales: ['pt-BR'] })).toBe('en')
  })

  it('maps Portuguese system locales to pt-BR and falls back to English', () => {
    expect(resolveLocale({ systemLocales: ['pt-PT'] })).toBe('pt-BR')
    expect(resolveLocale({ systemLocales: ['es-ES'] })).toBe('en')
  })
})
