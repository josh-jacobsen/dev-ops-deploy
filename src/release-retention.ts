import * as fs from 'fs/promises'

export interface Release {
  Id: string
  ProjectId: string
  Version?: string | null
  Created?: string | null
}

export interface Deployment {
  Id: string
  ReleaseId: string
  EnvironmentId: string
  DeployedAt: string
}

export async function readFile(path: string) {
  const a = await fs.readFile(path, 'utf-8')
  const things: Release[] = JSON.parse(a)
  console.log(things)
}

export function filterReleasesWithNoDeployments(releases: Release[], deployments: Deployment[]) {
  return releases.filter(release => {
    if (deployments.some(deployment => deployment.ReleaseId === release.Id)){
      return true
    }
    return false
  })
}

export function calculateReleasesToRetain(releases: Release[], deployments: Deployment[]): Release[] {
  const filteredReleases = filterReleasesWithNoDeployments(releases, deployments)

  return filteredReleases
}
