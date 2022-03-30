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
