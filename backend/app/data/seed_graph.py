"""
Synthetic seed data for the Fraud Graph Intelligence Agent demo.

All account IDs, phone numbers, devices, and UPI IDs below are fabricated for
demonstration purposes only and do not correspond to real people or cases.
"""

ACCOUNTS = [
    "ACC-1001", "ACC-1002", "ACC-1003", "ACC-1004", "ACC-1005",
    "ACC-1006", "ACC-1007", "ACC-1008", "ACC-1009", "ACC-1010",
]

# Each edge: (account_a, account_b, relationship_type)
EDGES = [
    ("ACC-1001", "ACC-1002", "SHARED_DEVICE"),
    ("ACC-1002", "ACC-1003", "TRANSACTED_WITH"),
    ("ACC-1003", "ACC-1004", "SHARED_DEVICE"),
    ("ACC-1004", "ACC-1005", "TRANSACTED_WITH"),
    ("ACC-1002", "ACC-1006", "SAME_IP"),
    ("ACC-1006", "ACC-1007", "TRANSACTED_WITH"),
    ("ACC-1008", "ACC-1009", "TRANSACTED_WITH"),
    ("ACC-1009", "ACC-1010", "SHARED_DEVICE"),
]

# Accounts already flagged by prior reports (e.g. from the Scam Agent or Citizen reports).
FLAGGED_ACCOUNTS = {"ACC-1001", "ACC-1008"}

# Accounts identified (via high degree + shared-device links to flagged accounts)
# as likely money-mule accounts for the demo narrative.
KNOWN_MULE_ACCOUNTS = {"ACC-1002", "ACC-1009"}
