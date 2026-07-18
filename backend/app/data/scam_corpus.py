"""
A small, self-authored corpus of *synthetic* digital-arrest / impersonation
scam scripts, written to reflect publicly known scam advisories (RBI/police
awareness bulletins) — not scraped from real victims or real case data.

Used for lightweight text-similarity matching in the demo. In production this
corpus would be replaced/expanded with data science partners and refreshed via
the "scam evolution prediction" pipeline described in the architecture doc.
"""

KNOWN_SCAM_SCRIPTS: list[str] = [
    "This is the CBI. A parcel with your Aadhaar number has been seized containing "
    "illegal items. You are under digital arrest and must not disconnect this call.",
    "We are calling from the customs department. Your courier contains banned "
    "substances. Do not hang up or you will be arrested immediately.",
    "This is an official notice from the cyber cell. Your bank account is linked "
    "to a money laundering case. Transfer your funds to a verification account "
    "to prove your innocence.",
    "Your Aadhaar card has been used in a criminal case in Mumbai. Stay on this "
    "video call with our officer or a warrant will be issued for your arrest.",
    "This call is being recorded for legal purposes. You must remain on this "
    "call and follow instructions or face immediate arrest under the IT Act.",
    "We are from TRAI. Your mobile number will be disconnected in two hours due "
    "to illegal activity unless you verify your identity by sharing your OTP.",
    "This is the income tax department. There is a pending case against you. "
    "Pay the settlement amount now through this UPI ID to avoid arrest.",
    "Do not tell any family member about this call. This is a confidential "
    "investigation and disclosure will lead to your immediate arrest.",
]

# Threat / urgency / authority keyword buckets used for rule-based scoring.
THREAT_KEYWORDS = [
    "arrest", "warrant", "police", "cbi", "customs", "cyber cell", "criminal case",
    "jail", "court", "fir", "income tax", "trai", "seized", "illegal",
]

URGENCY_KEYWORDS = [
    "immediately", "right now", "do not disconnect", "do not hang up",
    "within", "hours", "urgent", "last chance", "before it's too late",
]

SECRECY_KEYWORDS = [
    "do not tell", "confidential", "don't share this", "keep this between us",
    "do not disclose", "secret",
]

PAYMENT_KEYWORDS = [
    "transfer", "upi", "otp", "account number", "verification amount",
    "pay now", "settlement amount", "bank details",
]
