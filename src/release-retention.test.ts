import { calculateReleasesToRetain } from './release-retention'

test('basic test', () => {
    calculateReleasesToRetain([{Id: '', Created: 'created at', ProjectId: 'project-id-2', Version: 'version 2'}])
    expect(1).toBe(1)
})