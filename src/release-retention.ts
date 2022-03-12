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

export interface Project {
  Id: string
  Name: string
}

export interface DeployedRelease {
  Id: string
  Version?: string | null
  DeployedAt: string
}

export interface ReleaseRetention {
  ProjectId: string
  EnvironmentId: string
  Releases: DeployedRelease[]
}


export async function readFile(path: string) {
  const a = await fs.readFile(path, 'utf-8')
  const things: Release[] = JSON.parse(a)
  console.log(things)
}

export function filterReleasesWithNoDeploymentsOrProjects(releases: Release[], deployments: Deployment[], projects: Project[]) {
  const releasesWithDeployments = releases.filter(release => {
    if (deployments.some(deployment => deployment.ReleaseId === release.Id)){
      return true
    }
    return false
  })

  // I'm assuming that if a release is associated with a Project that isn't in the Projects.json file, 
  // then this release should be excluded from the results.
  const releasesWithProjects = releasesWithDeployments.filter(release => {
    if (projects.some(project => project.Id === release.ProjectId)) {
      return true
    }
    return false
  })

  return releasesWithProjects
}

export function calculateReleasesToRetain(releases: Release[], deployments: Deployment[], projects: Project[]): ReleaseRetention[] {
  const filteredReleases = filterReleasesWithNoDeploymentsOrProjects(releases, deployments, projects)

  const releaseRetentionsToReturn: ReleaseRetention[] = []

  filteredReleases.map(release => {
    const deploymentsToLookAt = deployments.filter(deploy => deploy.ReleaseId === release.Id)

    deploymentsToLookAt.map(deploy => {
      const check = releaseRetentionsToReturn.find(thing => thing.EnvironmentId === deploy.EnvironmentId && thing.ProjectId === release.ProjectId)
      if (check) {
        check.Releases.push({Id: release.Id, Version: release.Version, DeployedAt: deploy.DeployedAt})
      } else {
        releaseRetentionsToReturn.push({EnvironmentId: deploy.EnvironmentId, ProjectId: release.ProjectId, Releases: [{Id: release.Id, Version: release.Version, DeployedAt: deploy.DeployedAt}]})
      }
    })
  })



  // iterate through the releases. 
  // compare to Deployments.json
  // generate new object 
  // ReleaseRetention []
  return releaseRetentionsToReturn
}
