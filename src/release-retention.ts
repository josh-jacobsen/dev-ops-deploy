import * as fs from 'fs/promises'

export interface Release {
  Id: string
  ProjectId: string
  Version?: string | null
  Created?: string | null
}

export interface Environment {
  Id: string
  Name: string
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

export const filterReleasesWithNoDeploymentsOrProjects = (
  releases: Release[],
  deployments: Deployment[],
  projects: Project[]
): Release[] => {
  const releasesWithDeployments = releases.filter((release) => {
    if (deployments.some((deployment) => deployment.ReleaseId === release.Id)) {
      return true
    }
    return false
  })

  // I'm assuming that if a release is associated with a Project that isn't in the Projects.json file,
  // then this release should be excluded from the results.
  const releasesWithProjects = releasesWithDeployments.filter((release) => {
    if (projects.some((project) => project.Id === release.ProjectId)) {
      return true
    }
    return false
  })

  return releasesWithProjects
}

const convertIndexToEnglishString = (index: number) => {
  switch (index) {
    case 0:
      return 'most recently'
    case 1:
      return index + 1 + 'nd most recently'
    case 2:
      return index + 1 + 'rd most recently'
    case 3:
      return index + 1 + 'th most recently'
    default:
      return index + 1 + 'th most recently'
  }
}

export const orderAndFilterReleases = (
  numberOfPastReleaseToRetain: number,
  releasesMap: Map<string, DeployedRelease[]>
) => {
  const releasesToActuallyReturn: string[] = []
  releasesMap.forEach((key: DeployedRelease[], value: string) => {
    const environment = value.split(':')
    console.log(
      `For enviroment and project ${value}, the retained releases are:`
    )
    const sortedArray = key.sort((a, b) => {
      return Date.parse(b.DeployedAt) - Date.parse(a.DeployedAt)
    })
    const otherThing = sortedArray.slice(0, numberOfPastReleaseToRetain)
    otherThing.map((release, index) => {
      releasesToActuallyReturn.push(release.Id)
      console.log(
        `${release.Id} kept becasue it was the ${convertIndexToEnglishString(
          index
        )} deployed to ${environment[0]} `
      )
    })
  })

  return releasesToActuallyReturn
}

export const calculateReleasesToRetain = (
  numberOfPastReleaseToRetain: number,
  releases: Release[],
  deployments: Deployment[],
  projects: Project[],
  environments: Environment[]
): string[] => {
  const filteredReleases = filterReleasesWithNoDeploymentsOrProjects(
    releases,
    deployments,
    projects
  )

  // TODO Immutably return a Map within the below function instead of declaring one and then mutating it
  const releasesMap = new Map<string, DeployedRelease[]>()
  filteredReleases.map((release) => {
    const releaseDeployments = deployments.filter(
      (deploy) => deploy.ReleaseId === release.Id
    )

    releaseDeployments.flatMap((deploy) => {
      // I'm assuming that if a deployment was to an enviroment that isn't
      // in the Environments list then it should be filtered out
      if (
        !environments.some(
          (environment) => environment.Id === deploy.EnvironmentId
        )
      ) {
        return []
      }

      // TODO Can I use .reduce here to build the object instead of mutating releasesMap?
      const existingReleases = releasesMap.get(
        `${deploy.EnvironmentId}:${release.ProjectId}`
      )
      if (existingReleases) {
        existingReleases.push({
          Id: release.Id,
          Version: release.Version,
          DeployedAt: deploy.DeployedAt,
        })
      } else {
        releasesMap.set(`${deploy.EnvironmentId}:${release.ProjectId}`, [
          {
            Id: release.Id,
            Version: release.Version,
            DeployedAt: deploy.DeployedAt,
          },
        ])
      }
    })
  })

  // TODO Using Sets is going to improve the access speed

  // I'm assuming that for the instruction to "Return the releases that should be kept", the Release Id is the only detail that needs
  // to be returned (if this assumption is incorrect it is easy enough to change)
  return orderAndFilterReleases(numberOfPastReleaseToRetain, releasesMap)
}
