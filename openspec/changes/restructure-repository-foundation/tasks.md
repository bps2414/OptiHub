## 1. Repository Audit

- [x] 1.1 Inventory the current root-level files and folders, classifying each as active source, active planning, historical material, generated artifact, or removable clutter
- [x] 1.2 Define the target repository layout and archival boundary for historical planning based on the audit findings

## 2. Structure Cleanup

- [x] 2.1 Remove generated and disposable artifacts that do not belong in the committed workspace
- [x] 2.2 Reorganize root-level folders and files so active application sources, OpenSpec surfaces, and historical materials are clearly separated
- [x] 2.3 Preserve or move historical planning artifacts into the chosen boundary without losing traceability to current work

## 3. Hygiene Rules And Guidance

- [x] 3.1 Update ignore coverage and repository hygiene rules so generated artifacts remain out of version control after cleanup
- [x] 3.2 Refresh repository-facing documentation to identify canonical entry points for active code, active planning, historical references, and continuity
- [x] 3.3 Update any OpenSpec or contributor guidance that still implies legacy planning is an active workflow

## 4. Verification

- [x] 4.1 Verify the cleaned repository still contains the expected active entry points and historical references described by the documentation
- [x] 4.2 Run the project's standard validation commands appropriate to the touched files and record any intentional follow-ups before push
