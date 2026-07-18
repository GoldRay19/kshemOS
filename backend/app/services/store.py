"""
In-memory store standing in for PostgreSQL `reports` / `cases` tables for the
hackathon demo. Swap for real Postgres (see docs/architecture.md schema) when
moving beyond a single-process demo.
"""
from __future__ import annotations

import itertools
from typing import Any

_report_id_counter = itertools.count(1)
_reports: dict[str, dict[str, Any]] = {}


def save_report(report: dict[str, Any]) -> str:
    report_id = f"RPT-{next(_report_id_counter):04d}"
    _reports[report_id] = report
    return report_id


def get_report(report_id: str) -> dict[str, Any] | None:
    return _reports.get(report_id)


def all_reports() -> list[dict[str, Any]]:
    return list(_reports.values())
