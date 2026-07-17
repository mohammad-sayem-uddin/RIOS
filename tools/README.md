# Tools

Repository tooling for documentation generation, migration, and maintenance.

## Structure

| Directory                  | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| [generators/](generators/) | Python scripts for generating architecture documents |
| [migration/](migration/)   | Repository migration and transformation scripts      |

## Generators

| Script                          | Generates                        |
| ------------------------------- | -------------------------------- |
| `generate_atlas.py`             | Architecture Atlas               |
| `generate_atlas_v11.py`         | Architecture Atlas v11           |
| `generate_adr.py`               | Architecture Decision Records    |
| `generate_atm.py`               | Architecture Traceability Matrix |
| `generate_constitution.py`      | Claude Code Constitution         |
| `generate_validation_report.py` | Validation Report                |
| `atlas_v11_helpers.py`          | Atlas v11 helper functions       |

## Migration

| Script              | Purpose                                               |
| ------------------- | ----------------------------------------------------- |
| `transform_repo.py` | Repository structure transformation and normalization |

## Usage

Generator scripts produce Markdown documentation from structured data. Run them
from the repository root:

```bash
python tools/generators/generate_atlas.py
python tools/generators/generate_adr.py
```
