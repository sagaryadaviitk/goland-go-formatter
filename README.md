# GoLand Go Formatter

GoLand Go Formatter is a lightweight VS Code extension that applies GoLand-like formatting defaults for Go projects without adding language-server diagnostics.

## What This Includes

- Registers a standalone Go document formatter
- Uses `gofmt` by default
- Enables format on save for Go files
- Can be configured to use `goimports` or `gofumpt`

## Why This Is A Profile Extension

This extension intentionally does not depend on the official Go extension. It formats through command-line tools only, so installing it does not add import/package diagnostics to diff views or normal editors.

## Usage

1. Install `GoLand Go Formatter`.
2. Make sure the selected formatter tool is available on `PATH`.
3. Open a Go file and save it.

User or workspace settings can override these defaults when a project needs different formatting behavior.

## Settings

- `golandGoFormatter.tool`: `gofmt`, `goimports`, or `gofumpt`
- `golandGoFormatter.extraArgs`: extra arguments passed to the formatter
- `golandGoFormatter.timeoutMs`: formatter timeout

## Notes

- This extension is GoLand-inspired and is not affiliated with JetBrains.
- `goimports` and `gofumpt` must be installed separately if selected.
