import {
  calculateReleasesToRetain,
  Deployment,
  Environment,
  filterReleasesWithNoDeploymentsOrProjects,
  Project,
  Release,
} from './release-retention'

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
      expect(retainedReleases).toEqual(['Release-3'])
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
      expect(retainedReleases).toEqual(['Release-4', 'Release-3'])
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
      expect(retainedReleases).toEqual(['Release-3', 'Release-4'])
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
