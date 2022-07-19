# Dev Ops Deploy Release Retention

This was a technical test I was asked to complete for a role with a Cloud infrastructure company 


### Running the solution

Run `yarn install` to download the necessary NPM packages, and then use the following commands:

| Command      | Purpose                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| `yarn start` | Transpiles `.ts` files from the `src` directory into the `dist` directory and runs the `release-retention.js` file |
| `yarn build` | Transpiles `.ts` files from the `src` directory into the `dist` directory                                          |
| `yarn watch` | Runs the `release-retention.ts` file and watches for changes                                                       |
| `yarn lint`  | Runs eslint over the `src` files                                                                                   |
| `yarn test`  | Runs the test suite                                                                                                |

### Assumptions

I made a few assumptions when writing this. These assumptions have (mostly) been recorded as code commends as well.

1. If a release is associated with a Project that isn't in the Projects.json file then this release should be excluded from the results.
2. If a deployment is associated with an Environment that isn't in the Environments.json file then this deployment won't be used when filtering releases.
3. I've tried to stay away from mutating data as much as possible. I've generally gone with mutating data structures on a first pass, and then tried to refactor to more immutable code as time allowed. In a few places I've still got the initial approach where I haven't had the chance to revise.
4. I'm assuming that the number of releases, deployments, projects, etc (especially releases and deployments) could be in the thousands. I've tried to stay away from nested loops, etc, and other approaches that won't scale well as the data increases.
