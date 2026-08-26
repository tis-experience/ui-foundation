# ADR-006 — Versioned source-registry releases

- Status: Accepted
- Date: 2026-08-21

## Context

UI Foundation is already available through generated shadcn registry JSON on GitHub Pages. The `/r` path follows the latest `main` deployment, which is useful for evaluation but cannot reproduce a prior installation after source evolves. Publishing the repository itself as an npm package would duplicate catalog, tests and generated files while bypassing the source-first installation model.

## Decision

The shadcn registry remains the only product distribution for the React adapter.

Two channels coexist:

1. `/r` is the mutable preview channel for the latest validated `main` build.
2. `/releases/<version>` is an immutable snapshot created only after an owner-approved version change.

Every versioned snapshot rewrites internal registry dependencies to the same release root and contains a SHA-256 manifest covering registry items, contracts, tokens, schemas, documentation and AI sources. The release tool refuses to overwrite an existing version.

The repository package remains `private`. npm publication requires a future ADR and a separate package responsibility.

## Consequences

- products can pin a reproducible registry version;
- evaluation can continue using the shorter preview URLs;
- release integrity and compatibility become machine-readable;
- release snapshots add duplicated static JSON and Markdown to the repository;
- every correction to a published release requires a new version;
- Pages remains the public transport, while shadcn remains the installer and source ownership model.

## Alternatives considered

### Publish the full repository to npm

Rejected because the current package contains catalog application code, tests and generated artifacts and has no coherent runtime entrypoint.

### Keep only mutable `/r` URLs

Rejected because consumers could not reproduce or audit the exact source installed at an earlier date.

### Use Git tags alone

Tags preserve repository state but do not provide the existing static-JSON transport, dependency closure and integrity manifest expected by current consumers.

## References

- `docs/installation.md`
- `docs/developer-api.md`
- `docs/releases.md`
- `scripts/release-registry.mjs`
