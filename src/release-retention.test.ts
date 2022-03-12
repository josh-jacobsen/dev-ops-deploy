import {
  calculateReleasesToRetain,
  Deployment,
  filterReleasesWithNoDeployments,
  Release,
} from './release-retention'

describe('CalculateReleasesToRetain', () => {
  describe('Filter releases with no deployments', () => {
    it('Returns releases that have at least one deployment', () => {
      const releases: Release[] = [
        {
          Id: 'Release-1',
          ProjectId: 'Project-1',
          Version: null,
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

      const filteredReleases = filterReleasesWithNoDeployments(
        releases,
        deployments
      )

      expect(filteredReleases).toEqual([
        {
          Id: 'Release-1',
          ProjectId: 'Project-1',
          Version: null,
          Created: '2000-01-02T13:00:00',
        },
      ])
    })

    it('Returns multiple releases that have at least one deployment', () => {
        const releases: Release[] = [
          {
            Id: 'Release-1',
            ProjectId: 'Project-1',
            Version: null,
            Created: '2000-01-02T13:00:00',
          },
          {
            Id: 'Release-2',
            ProjectId: 'Project-1',
            Version: null,
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
  
        const filteredReleases = filterReleasesWithNoDeployments(
          releases,
          deployments
        )
  
        expect(filteredReleases).toEqual([
            {
                Id: 'Release-1',
                ProjectId: 'Project-1',
                Version: null,
                Created: '2000-01-02T13:00:00',
              },
              {
                Id: 'Release-2',
                ProjectId: 'Project-1',
                Version: null,
                Created: '2000-01-02T13:00:00',
              },
        ])
      })
    it('Remove releases with no deployments', () => {
      const releases: Release[] = [
        {
          Id: 'Release-3',
          ProjectId: 'Project-1',
          Version: null,
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

      const filteredReleases = filterReleasesWithNoDeployments(
        releases,
        deployments
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
          Version: null,
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
      const retainedReleases = calculateReleasesToRetain(releases, deployments)
      expect(retainedReleases).toEqual([
        {
          Id: 'Release-3',
          ProjectId: 'Project-1',
          Version: null,
          Created: '2000-01-02T13:00:00',
        },
      ])
    })

  })
})
