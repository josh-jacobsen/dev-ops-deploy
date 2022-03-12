import {
  calculateReleasesToRetain,
  Deployment,
  filterReleasesWithNoDeploymentsOrProjects,
  Project,
  Release,
} from './release-retention'

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
  describe('Filter releases with no deployments', () => {
      
    it('Returns releases that have at least one deployment', () => {
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
          ReleaseId: 'Release-1',
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
        releases,
        deployments,
        projects
      )
      expect(retainedReleases).toEqual([
        {
          ProjectId: 'Project-1',
          EnvironmentId: 'Environment-1',
          Releases: [{Id: 'Release-3', Version: '1.0.1', DeployedAt: '2000-01-01T10:00:00'}]
        },
      ])
    })

    it('should return multiple releases for each project and environment combination', () => {
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
          releases,
          deployments,
          projects
        )
        expect(retainedReleases).toEqual([
          {
            ProjectId: 'Project-1',
            EnvironmentId: 'Environment-1',
            Releases: [{Id: 'Release-3', Version: '1.0.1', DeployedAt: '2000-01-01T10:00:00'}, {Id: 'Release-4', Version: '1.0.2', DeployedAt: '2000-01-03T13:00:00'}]
          },
        ])
      })
  })
})
