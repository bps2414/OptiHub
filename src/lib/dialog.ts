import { open } from '@tauri-apps/plugin-dialog'

export async function pickGameExecutable(): Promise<string | null> {
  const selected = await open({
    multiple: false,
    directory: false,
    filters: [
      {
        name: 'Windows executable',
        extensions: ['exe'],
      },
    ],
  })

  return typeof selected === 'string' ? selected : null
}
