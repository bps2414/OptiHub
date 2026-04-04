import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { I18nProvider } from '../../i18n/I18nProvider'
import { DisplayOverrideForm } from './DisplayOverrideForm'

describe('DisplayOverrideForm', () => {
  it('applies and resets a manual display override', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    const onReset = vi.fn()

    render(
      <I18nProvider initialLocale="en">
        <DisplayOverrideForm
          override={{
            enabled: false,
            widthPx: '',
            heightPx: '',
            refreshHz: '',
          }}
          onApply={onApply}
          onReset={onReset}
        />
      </I18nProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Use manual override' }))
    await user.type(screen.getByLabelText('Width'), '2560')
    await user.type(screen.getByLabelText('Height'), '1440')
    await user.type(screen.getByLabelText('Refresh rate'), '144')
    await user.click(screen.getByRole('button', { name: 'Apply override' }))

    expect(onApply).toHaveBeenCalledWith({
      enabled: true,
      widthPx: '2560',
      heightPx: '1440',
      refreshHz: '144',
    })

    await user.click(screen.getByRole('button', { name: 'Reset to detected' }))

    expect(onReset).toHaveBeenCalledOnce()
  })
})
