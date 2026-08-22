# Registry releases

UI Foundation uses the shadcn source registry as its distribution artifact. The repository package remains `private` to prevent accidental npm publication.

## Channels

- `/r/<item>.json` — current preview channel, updated whenever `main` is deployed;
- `/releases/<version>/r/<item>.json` — immutable release snapshot;
- `/releases/<version>/manifest.json` — release inventory, compatibility and SHA-256 integrity evidence;
- `/releases/current.json` — pointer to the latest staged release.

The preview channel is convenient for evaluation. Production consumers should pin a versioned release URL.

## Rehearsal

Every pull request runs a release rehearsal as part of `npm test`:

```bash
npm run release:dry-run
```

The rehearsal verifies version parity, required public artifacts, registry item closure, versioned internal dependencies, compatibility metadata and file digests. It writes only to a temporary directory and does not publish or mutate a committed release.

## Staging a release

Staging requires an owner-approved version change first. After all generated artifacts are current:

```bash
npm run build:all
npm run release:stage -- --version <approved-version>
```

`release:stage` creates `public/releases/<version>` and refuses to overwrite an existing version. The staged snapshot must be reviewed, committed through a pull request and pass all repository gates before a Git tag is created.

## Required evidence

- clean dependency audit at the configured severity;
- `npm test`;
- `npm run test:consumer` against generated source;
- `npm run test:e2e`;
- merged CI checks;
- successful GitHub Pages deploy;
- `npm run test:consumer:public` against the deployed registry;
- HTTP 200 for the release manifest and selected registry items;
- recomputed manifest integrity matching the published files.

## Versioning

- prerelease identifiers (`alpha.N`, `beta.N`, `rc.N`) are used while the public source API can still change;
- patch releases contain compatible fixes;
- minor releases add compatible components, Blocks, Charts or capabilities;
- major releases may change existing source or contracts incompatibly.

A published version is immutable. Corrections require a new version; an existing release directory is never regenerated or overwritten.

## npm boundary

There is intentionally no `ui-foundation` runtime package. Publishing the catalog repository would duplicate source, examples, tests and generated registry artifacts without improving component consumption. A future npm package would require a separate ADR, a scoped package name and a concrete runtime or tooling responsibility that the shadcn registry does not already satisfy.
