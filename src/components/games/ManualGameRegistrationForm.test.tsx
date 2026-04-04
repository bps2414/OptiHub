import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '../../i18n/I18nProvider'
import { ManualGameRegistrationForm } from './ManualGameRegistrationForm'

describe('ManualGameRegistrationForm', () => {
  it('requires a display name and supports save/cancel', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const onCancel = vi.fn()

    render(
      <MemoryRouter>
        <I18nProvider initialLocale="en">
          <ManualGameRegistrationForm
            executablePath="D:/Games/Celeste/Celeste.exe"
            onCancel={onCancel}
            onSave={onSave}
          />
        </I18nProvider>
      </MemoryRouter>,
    )

    const displayName = screen.getByLabelText('Display name')

    await user.clear(displayName)
    expect(screen.getByRole('button', { name: 'Save game' })).toBeDisabled()

    await user.type(displayName, 'Celeste')
    await user.click(screen.getByRole('button', { name: 'Save game' }))

    expect(onSave).toHaveBeenCalledWith({
      displayName: 'Celeste',
      executablePath: 'D:/Games/Celeste/Celeste.exe',
    })

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalled()
  })
})
