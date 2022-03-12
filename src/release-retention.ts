import * as fs from 'fs/promises'

export interface Release {
  Id: string
  ProjectId: string
  Version: string
  Created: string
}

export async function readFile(path: string) {
  const a = await fs.readFile(path, 'utf-8')
  const things: Release[] = JSON.parse(a)
  console.log(things)
}

export function calculateReleasesToRetain(releases: Release[]) {
  console.log(releases)

}
