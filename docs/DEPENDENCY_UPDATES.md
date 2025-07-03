# Dependency Updates

## Changes Made to Address Deprecation Warnings

### 1. Replaced bundlesize with bundlewatch

- Removed the deprecated `bundlesize` package
- Installed `bundlewatch` as a modern alternative
- Updated configuration from `.bundlesizerc.json` to `bundlewatch.config.json`
- Updated CI workflow to use `bundlewatch`
- Added `performance:size` npm script

### 2. Updated ESLint Configuration

- Using the modern flat config format (`eslint.config.js`)
- Updated npm scripts to use the new config
- Added appropriate ESLint dependencies

### 3. Updated Package Dependencies

- Updated patch versions of all dependencies to their latest compatible versions
- Installed modern versions of packages:
  - `rimraf` (v4+)
  - `glob` (v9+)
  - `lru-cache` (as alternative to `inflight`)
- Added development tools as explicit dependencies:
  - `audit-ci`
  - `depcheck`
  - `npm-check-updates`
  - `vite-bundle-visualizer` (replaced webpack-bundle-analyzer)

### 4. Fixed Performance Budget Script

- Updated to use ESM modules
- Fixed module exports
- Used modern file path handling with URL imports

### 5. Updated CI Workflow

- Updated to use Node.js 20.x
- Made ESLint check more resilient
- Updated Security Audit step to use custom audit-ci configuration
- Updated bundle analysis steps to use bundlewatch

### 6. Added Security Audit Configuration

- Created `.audit-ci.json` for security audit rules
- Configured to allow certain vulnerabilities temporarily

## Remaining Issues to Address

### 1. esbuild Vulnerability

- **Issue**: Moderate vulnerability in esbuild (GHSA-67mh-4wv8-2f99)
- **Solution**: Requires updating Vite to version 7.0+
- **Impact**: Major version update that requires careful testing
- **Decision**: Accepted risk for now - vulnerability is only relevant in development mode
- **Future Plan**: Review this in a later sprint as part of a planned Vite upgrade

### 2. ESLint 9.x Migration

- **Current**: Using ESLint 8.57.1
- **Future**: Consider upgrading to ESLint 9.x
- **Requirements**: Additional configuration changes and plugin updates
- **Recommendation**: Plan as a separate task after sufficient plugin support is available

### 3. React 19 Compatibility

- Several dependencies have React 19 compatible versions available
- Consider planning a migration path to React 19

## Maintenance Guidelines

1. **Regular Dependency Updates**:

   - Run `npm outdated` periodically
   - Update patch and minor versions regularly
   - Plan major version updates carefully

2. **Security Auditing**:

   - Run `npm audit` regularly
   - Update `.audit-ci.json` as needed
   - Don't allow high or critical vulnerabilities long-term

3. **CI Pipeline**:
   - Monitor CI pipeline for deprecation warnings
   - Update tooling as needed
