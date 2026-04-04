import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { I18nProvider } from '../i18n/I18nProvider'
import { SettingsPage } from '../pages/SettingsPage'
import { Sidebar } from './Sidebar'

describe('shell localization', () => {
  it('renders pt-BR shell copy and lets the user switch back to English', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/settings']}>
        <I18nProvider initialLocale="pt-BR">
          <Sidebar />
          <SettingsPage />
        </I18nProvider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument()
    expect(screen.getByText('Biblioteca')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Configurações' })).toBeInTheDocument()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Idioma do aplicativo' }), 'en')

    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument()
    expect(screen.getByText('Library')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })
})
