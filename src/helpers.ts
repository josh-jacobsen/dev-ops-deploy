import { Deployment, Project, Release } from './interfaces'

export const isRelease = (release: Release | undefined): release is Release => {
    return Boolean(release)
}

export const filterReleasesWithNoDeploymentsOrProjects = (
    releases: Release[],
    deployments: Deployment[],
    projects: Project[]
): Release[] => {
    const releasesWithDeployments = releases.filter((release) => {
        return deployments.some((deployment) => deployment.ReleaseId === release.Id)
    })

    // I'm assuming that if a release is associated with a Project that isn't in the Projects.json file,
    // then this release should be excluded from the results.
    return releasesWithDeployments.filter((release) => {
        return projects.some((project) => project.Id === release.ProjectId)
    })
}

export const convertIndexToEnglishString = (index: number) => {
    switch (index) {
        case 0:
            return 'most recently'
        case 1:
            return index + 1 + 'nd most recently'
        case 2:
            return index + 1 + 'rd most recently'
        default:
            return index + 1 + 'th most recently'
    }
}

export const createDeploymentMap = (deployments: Deployment[]) => {
    return deployments.reduce((group, deployment) => {
        const { ReleaseId } = deployment
        group[ReleaseId] = group[ReleaseId] ?? []
        group[ReleaseId].push(deployment)
        return group
    }, {} as Record<string, Deployment[]>)
}
