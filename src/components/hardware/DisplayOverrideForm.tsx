import { useState } from 'react'

import { useI18n } from '../../i18n/useI18n'
import type { ManualDisplayOverride } from '../../lib/hardware'

interface DisplayOverrideFormProps {
  override: ManualDisplayOverride
  onApply: (override: ManualDisplayOverride) => void
  onReset: () => void
}

export function DisplayOverrideForm({
  override,
  onApply,
  onReset,
}: DisplayOverrideFormProps) {
  const { copy } = useI18n()
  const overrideCopy = copy.pages.diagnostics.hardware.override
  const [draft, setDraft] = useState<ManualDisplayOverride>(override)

  function updateField(field: keyof ManualDisplayOverride, value: string | boolean) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <div className="form-field">
      <button
        className="form-select"
        onClick={() => updateField('enabled', true)}
        type="button"
      >
        {overrideCopy.useManual}
      </button>

      <label className="form-label" htmlFor="display-override-width">
        {overrideCopy.width}
      </label>
      <input
        className="form-select"
        id="display-override-width"
        onChange={(event) => updateField('widthPx', event.target.value)}
        value={draft.widthPx}
      />

      <label className="form-label" htmlFor="display-override-height">
        {overrideCopy.height}
      </label>
      <input
        className="form-select"
        id="display-override-height"
        onChange={(event) => updateField('heightPx', event.target.value)}
        value={draft.heightPx}
      />

      <label className="form-label" htmlFor="display-override-refresh-rate">
        {overrideCopy.refreshRate}
      </label>
      <input
        className="form-select"
        id="display-override-refresh-rate"
        onChange={(event) => updateField('refreshHz', event.target.value)}
        value={draft.refreshHz}
      />

      <div className="hardware-actions">
        <button
          className="form-select"
          onClick={() => onApply({ ...draft, enabled: true })}
          type="button"
        >
          {overrideCopy.apply}
        </button>
        <button
          className="form-select"
          onClick={onReset}
          type="button"
        >
          {overrideCopy.reset}
        </button>
      </div>
    </div>
  )
}
