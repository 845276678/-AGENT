from prometheus_client import Counter

IDEAS_SUBMITTED = Counter('ideas_submitted_total', 'Ideas submitted')
DISCUSSIONS_CREATED = Counter('discussions_created_total', 'Discussions created')
MESSAGES_POSTED = Counter('messages_posted_total', 'Messages posted to discussions')
PURCHASES_TOTAL = Counter('purchases_total', 'Purchases count')
WALLET_DEPOSIT_TOTAL = Counter('wallet_deposit_total', 'Wallet deposit operations')
WALLET_WITHDRAW_TOTAL = Counter('wallet_withdraw_total', 'Wallet withdraw operations')
