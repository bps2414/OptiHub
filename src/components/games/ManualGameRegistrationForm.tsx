import { useEffect, useState } from 'react'

import { useI18n } from '../../i18n/useI18n'
import type { ManualGameRegistrationInput } from '../../types/ipc'

interface ManualGameRegistrationFormProps {
  executablePath: string
  onCancel: () => void
  onSave: (input: ManualGameRegistrationInput) => void | Promise<void>
}

function getSuggestedDisplayName(executablePath: string) {
  const normalizedPath = executablePath.replace(/\\/g, '/')
  const filename = normalizedPath.split('/').pop() ?? executablePath

  return filename.replace(/\.exe$/i, '')
}

export function ManualGameRegistrationForm({
  executablePath,
  onCancel,
  onSave,
}: ManualGameRegistrationFormProps) {
  const { copy } = useI18n()
  const formCopy = copy.pages.library.form
  const [displayName, setDisplayName] = useState(() =>
    getSuggestedDisplayName(executablePath),
  )

  useEffect(() => {
    setDisplayName(getSuggestedDisplayName(executablePath))
  }, [executablePath])

  return (
    <section className="page-card manual-game-form">
      <label className="form-label" htmlFor="manual-game-executable">
        {formCopy.executable}
      </label>
      <input
        className="form-select"
        id="manual-game-executable"
        readOnly
        value={executablePath}
      />

      <label className="form-label" htmlFor="manual-game-display-name">
        {formCopy.displayName}
      </label>
      <input
        className="form-select"
        id="manual-game-display-name"
        onChange={(event) => setDisplayName(event.target.value)}
        value={displayName}
      />

      <div className="hardware-actions">
        <button
          className="form-select"
          disabled={displayName.trim().length === 0}
          onClick={() => {
            void onSave({
              displayName: displayName.trim(),
              executablePath,
            })
          }}
          type="button"
        >
          {formCopy.save}
        </button>
        <button
          className="form-select"
          onClick={onCancel}
          type="button"
        >
          {formCopy.cancel}
        </button>
      </div>
    </section>
  )
}
