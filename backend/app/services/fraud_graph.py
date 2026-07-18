"""
Fraud Graph Intelligence Agent.

Hackathon-real implementation: an in-memory networkx graph seeded with
synthetic accounts/edges, so the demo runs with zero external dependencies.
The query patterns (shared-device rings, degree-based mule scoring) mirror
the Cypher queries described in the architecture doc — swapping this module
for a real Neo4j-backed service (see PRODUCTION UPGRADE) only requires
re-implementing `get_ring_info` against Cypher instead of networkx.
"""
from __future__ import annotations

import networkx as nx

from app.data.seed_graph import ACCOUNTS, EDGES, FLAGGED_ACCOUNTS, KNOWN_MULE_ACCOUNTS

_graph: nx.Graph | None = None


def _build_graph() -> nx.Graph:
    g = nx.Graph()
    for acc in ACCOUNTS:
        g.add_node(acc, flagged=acc in FLAGGED_ACCOUNTS)
    for a, b, rel in EDGES:
        g.add_edge(a, b, relationship=rel)
    return g


def get_graph() -> nx.Graph:
    global _graph
    if _graph is None:
        _graph = _build_graph()
    return _graph


def get_ring_info(account_id: str) -> dict:
    """
    PRODUCTION UPGRADE: replace with a Cypher query against Neo4j, e.g.

        MATCH (a:Account {id: $account_id})-[:SHARED_DEVICE|SAME_IP*1..2]-(b:Account)
        RETURN b, a.flagged

    plus a Graph Neural Network node-embedding classifier for mule_probability
    instead of the degree-centrality heuristic used below.
    """
    g = get_graph()
    if account_id not in g:
        return {
            "account_id": account_id,
            "is_flagged": False,
            "mule_probability": 0.0,
            "ring_id": None,
            "connected_accounts": [],
            "shared_signals": [],
        }

    neighbors = list(g.neighbors(account_id))
    shared_signals = sorted({g.edges[account_id, n]["relationship"] for n in neighbors})

    # Simple, explainable mule heuristic: degree centrality + adjacency to a
    # flagged account + presence in the known-mule seed set.
    degree = g.degree(account_id)
    flagged_neighbor = any(g.nodes[n]["flagged"] for n in neighbors)
    base = min(0.5, degree * 0.15)
    if flagged_neighbor:
        base += 0.3
    if account_id in KNOWN_MULE_ACCOUNTS:
        base += 0.2
    mule_probability = round(min(1.0, base), 2)

    # Ring id: use the smallest connected-component member as a stable label.
    component = nx.node_connected_component(g, account_id)
    ring_id = f"RING-{sorted(component)[0]}" if len(component) > 1 else None

    return {
        "account_id": account_id,
        "is_flagged": g.nodes[account_id]["flagged"],
        "mule_probability": mule_probability,
        "ring_id": ring_id,
        "connected_accounts": neighbors,
        "shared_signals": shared_signals,
    }
