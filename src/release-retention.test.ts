import { calculateReleasesToRetain } from './release-retention'
import { Deployment, Environment, Project, Release } from './interfaces'
import { filterReleasesWithNoDeploymentsOrProjects } from './helpers'

const RETAIN_ONE_RELEASE = 1
const RETAIN_TEN_RELEASES = 10

describe('CalculateReleasesToRetain', () => {
    const releases: Release[] = [
        {
            Id: 'Release-1',
            ProjectId: 'Project-1',
            Version: '1.0.1',
            Created: '2000-01-02T13:00:00',
        },
    ]

    const deployments: Deployment[] = [
        {
            Id: 'Deployment-1',
            ReleaseId: 'Release-1',
            EnvironmentId: 'Environment-1',
            DeployedAt: '2000-01-01T10:00:00',
        },
    ]
    const projects: Project[] = [
        {
            Id: 'Project-1',
            Name: 'Random Quotes',
        },
    ]

    const environments: Environment[] = [
        {
            Id: 'Environment-1',
            Name: 'Staging',
        },
        {
            Id: 'Environment-2',
            Name: 'Production',
        },
    ]
    describe('Filter releases with no deployments or projects', () => {
        it('Returns releases that have at least one deployment and one project', () => {
            const filteredReleases = filterReleasesWithNoDeploymentsOrProjects(
                releases,
                deployments,
                projects
            )

            expect(filteredReleases).toEqual([
                {
                    Id: 'Release-1',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
            ])
        })

        it('Returns multiple releases that have at least one deployment', () => {
            const releases: Release[] = [
                {
                    Id: 'Release-1',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-2',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
            ]

            const deployments: Deployment[] = [
                {
                    Id: 'Deployment-1',
                    ReleaseId: 'Release-1',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-2',
                    ReleaseId: 'Release-2',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
            ]

            const filteredReleases = filterReleasesWithNoDeploymentsOrProjects(
                releases,
                deployments,
                projects
            )

            expect(filteredReleases).toEqual([
                {
                    Id: 'Release-1',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-2',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
            ])
        })
        it('Remove releases with no deployments', () => {
            const deployments: Deployment[] = [
                {
                    Id: 'Deployment-1',
                    ReleaseId: 'Release-11',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
            ]

            const filteredReleases = filterReleasesWithNoDeploymentsOrProjects(
                releases,
                deployments,
                projects
            )

            expect(filteredReleases).toEqual([])
        })

        it('Remove releases with no projects', () => {
            const projects: Project[] = [
                {
                    Id: 'Project-11',
                    Name: 'Random Quotes',
                },
            ]

            const filteredReleases = filterReleasesWithNoDeploymentsOrProjects(
                releases,
                deployments,
                projects
            )

            expect(filteredReleases).toEqual([])
        })
    })

    describe('Logs the correct result', () => {
        it('log the 1st, 2nd, 3rd, 4th, nth result', () => {
            const releases: Release[] = [
                {
                    Id: 'Release-1',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-2',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T14:00:00',
                },
                {
                    Id: 'Release-3',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-4',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-5',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-6',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-7',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-8',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-9',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-10',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-11',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
            ]

            const deployments: Deployment[] = [
                {
                    Id: 'Deployment-1',
                    ReleaseId: 'Release-1',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-2',
                    ReleaseId: 'Release-2',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-3',
                    ReleaseId: 'Release-3',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-4',
                    ReleaseId: 'Release-4',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-5',
                    ReleaseId: 'Release-5',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-6',
                    ReleaseId: 'Release-6',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-7',
                    ReleaseId: 'Release-7',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-8',
                    ReleaseId: 'Release-8',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-9',
                    ReleaseId: 'Release-9',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-10',
                    ReleaseId: 'Release-10',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-11',
                    ReleaseId: 'Release-11',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
            ]

            const retainedReleases = calculateReleasesToRetain(
                RETAIN_TEN_RELEASES,
                releases,
                deployments,
                projects,
                environments
            )
            expect(retainedReleases).toEqual([
                {
                    Created: '2000-01-02T13:00:00',
                    Id: 'Release-1',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
                {
                    Created: '2000-01-02T14:00:00',
                    Id: 'Release-2',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
                {
                    Created: '2000-01-02T13:00:00',
                    Id: 'Release-3',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
                {
                    Created: '2000-01-02T13:00:00',
                    Id: 'Release-4',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
                {
                    Created: '2000-01-02T13:00:00',
                    Id: 'Release-5',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
                {
                    Created: '2000-01-02T13:00:00',
                    Id: 'Release-6',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
                {
                    Created: '2000-01-02T13:00:00',
                    Id: 'Release-7',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
                {
                    Created: '2000-01-02T13:00:00',
                    Id: 'Release-8',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
                {
                    Created: '2000-01-02T13:00:00',
                    Id: 'Release-9',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
                {
                    Created: '2000-01-02T13:00:00',
                    Id: 'Release-10',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
            ])
        })
    })

    describe('CalculateReleasesToRetain', () => {
        it('should calculate release to retain', () => {
            const releases: Release[] = [
                {
                    Id: 'Release-3',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
            ]

            const deployments: Deployment[] = [
                {
                    Id: 'Deployment-1',
                    ReleaseId: 'Release-3',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
            ]
            const retainedReleases = calculateReleasesToRetain(
                RETAIN_ONE_RELEASE,
                releases,
                deployments,
                projects,
                environments
            )
            expect(retainedReleases).toEqual([
                {
                    Created: '2000-01-02T13:00:00',
                    Id: 'Release-3',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
            ])
        })

        it('should return multiple releases for the same project and environment combination', () => {
            const releases: Release[] = [
                {
                    Id: 'Release-3',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-4',
                    ProjectId: 'Project-1',
                    Version: '1.0.2',
                    Created: '2000-01-03T10:00:00',
                },
            ]

            const deployments: Deployment[] = [
                {
                    Id: 'Deployment-1',
                    ReleaseId: 'Release-3',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-2',
                    ReleaseId: 'Release-4',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-03T13:00:00',
                },
            ]
            const retainedReleases = calculateReleasesToRetain(
                RETAIN_TEN_RELEASES,
                releases,
                deployments,
                projects,
                environments
            )
            expect(retainedReleases).toEqual([
                {
                    Created: '2000-01-03T10:00:00',
                    Id: 'Release-4',
                    ProjectId: 'Project-1',
                    Version: '1.0.2',
                },
                {
                    Created: '2000-01-02T13:00:00',
                    Id: 'Release-3',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
            ])
        })

        it('should return multiple releases when there are different project and environment combinations', () => {
            const releases: Release[] = [
                {
                    Id: 'Release-3',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-4',
                    ProjectId: 'Project-1',
                    Version: '1.0.2',
                    Created: '2000-01-03T10:00:00',
                },
            ]

            const deployments: Deployment[] = [
                {
                    Id: 'Deployment-1',
                    ReleaseId: 'Release-3',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-2',
                    ReleaseId: 'Release-4',
                    EnvironmentId: 'Environment-2',
                    DeployedAt: '2000-01-03T13:00:00',
                },
            ]
            const retainedReleases = calculateReleasesToRetain(
                RETAIN_ONE_RELEASE,
                releases,
                deployments,
                projects,
                environments
            )
            expect(retainedReleases).toEqual([
                {
                    Created: '2000-01-02T13:00:00',
                    Id: 'Release-3',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
                {
                    Created: '2000-01-03T10:00:00',
                    Id: 'Release-4',
                    ProjectId: 'Project-1',
                    Version: '1.0.2',
                },
            ])
        })

        it('should order releases by deployment date', () => {
            const releases: Release[] = [
                {
                    Id: 'Release-3',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                    Created: '2000-01-02T13:00:00',
                },
                {
                    Id: 'Release-4',
                    ProjectId: 'Project-1',
                    Version: '1.0.2',
                    Created: '2000-01-02T11:00:00',
                },
            ]

            const deployments: Deployment[] = [
                {
                    Id: 'Deployment-1',
                    ReleaseId: 'Release-3',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T10:00:00',
                },
                {
                    Id: 'Deployment-2',
                    ReleaseId: 'Release-4',
                    EnvironmentId: 'Environment-1',
                    DeployedAt: '2000-01-01T13:00:00',
                },
            ]
            const retainedReleases = calculateReleasesToRetain(
                RETAIN_TEN_RELEASES,
                releases,
                deployments,
                projects,
                environments
            )
            expect(retainedReleases).toEqual([
                {
                    Created: '2000-01-02T11:00:00',
                    Id: 'Release-4',
                    ProjectId: 'Project-1',
                    Version: '1.0.2',
                },
                {
                    Created: '2000-01-02T13:00:00',
                    Id: 'Release-3',
                    ProjectId: 'Project-1',
                    Version: '1.0.1',
                },
            ])
        })

        it('filters out releases that have no corresponding environment', () => {
            const environments: Environment[] = [
                {
                    Id: 'Environment--doesnt-exist',
                    Name: 'Production',
                },
            ]

            const retainedReleases = calculateReleasesToRetain(
                RETAIN_ONE_RELEASE,
                releases,
                deployments,
                projects,
                environments
            )
            expect(retainedReleases).toEqual([])
        })
    })
})
