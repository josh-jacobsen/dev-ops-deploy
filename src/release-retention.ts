import { DeployedRelease, Deployment, Environment, Project, Release } from './interfaces'
import {
    createDeploymentMap,
    filterReleasesWithNoDeploymentsOrProjects,
    isRelease,
    orderAndFilterReleases
} from './helpers'
import { readFileSync } from 'fs'

export const calculateReleasesToRetain = (
    numberOfPastReleaseToRetain: number,
    releases: Release[],
    deployments: Deployment[],
    projects: Project[],
    environments: Environment[]
): Release[] => {
    const filteredReleases = filterReleasesWithNoDeploymentsOrProjects(
        releases,
        deployments,
        projects
    )

    const deploymentMap = createDeploymentMap(deployments)

    const releasesToRetain: Record<string, DeployedRelease[]> = {}
    filteredReleases.map((release) => {
        const releaseDeployments = deploymentMap[release.Id]

        releaseDeployments.flatMap((deploy) => {
            // I'm assuming that if a deployment was to an environment that isn't
            // in the Environments list then it should be filtered out
            if (
                !environments.some(
                    (environment) => environment.Id === deploy.EnvironmentId
                )
            ) {
                return []
            }

            const existingReleases =
                releasesToRetain[`${deploy.EnvironmentId}:${release.ProjectId}`]

            if (existingReleases) {
                existingReleases.push({
                    Id: release.Id,
                    Version: release.Version,
                    DeployedAt: deploy.DeployedAt,
                })
            } else {
                releasesToRetain[`${deploy.EnvironmentId}:${release.ProjectId}`] = [
                    {
                        Id: release.Id,
                        Version: release.Version,
                        DeployedAt: deploy.DeployedAt,
                    },
                ]
            }
        })
    })

    const releaseMap = new Map(releases.map((release) => [release.Id, release]))

    const releaseIds = orderAndFilterReleases(
        numberOfPastReleaseToRetain,
        releasesToRetain
    )

    return releaseIds
        .map((releaseId) => {
            return releaseMap.get(releaseId)
        })
        .filter(isRelease)
}

function run() {
    const NUMBER_OF_RELEASES_TO_RETAIN = 10
    const releases: Release[] = JSON.parse(readFileSync('data/Releases.json', 'utf-8'))
    const deployments: Deployment[] = JSON.parse(
        readFileSync('data/Deployments.json', 'utf-8')
    )
    const projects: Project[] = JSON.parse(readFileSync('data/Projects.json', 'utf-8'))
    const environments: Environment[] = JSON.parse(
        readFileSync('data/Environments.json', 'utf-8')
    )
    calculateReleasesToRetain(
        NUMBER_OF_RELEASES_TO_RETAIN,
        releases,
        deployments,
        projects,
        environments
    )
}

run()

