class Subscription {
  final int id;
  final int userId;
  final String plan;
  final double amount;
  final String formattedAmount; // Formatted TZS representation from backend
  final String currency;
  final String status;
  final String idempotencyKey;
  final String? snippePaymentId;
  final DateTime? startedAt;
  final DateTime? expiresAt;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Subscription({
    required this.id,
    required this.userId,
    required this.plan,
    required this.amount,
    required this.formattedAmount,
    this.currency = 'TZS',
    required this.status,
    required this.idempotencyKey,
    this.snippePaymentId,
    this.startedAt,
    this.expiresAt,
    this.createdAt,
    this.updatedAt,
  });

  bool get isActive => status == 'active' && (expiresAt == null || expiresAt!.isAfter(DateTime.now()));

  factory Subscription.fromJson(Map<String, dynamic> json) {
    return Subscription(
      id: json['id'],
      userId: json['user_id'],
      plan: json['plan'],
      amount: (json['amount'] ?? 0).toDouble(),
      formattedAmount: json['formatted_amount'] ?? '',
      currency: json['currency'] ?? 'TZS',
      status: json['status'],
      idempotencyKey: json['idempotency_key'],
      snippePaymentId: json['mongike_payment_id'],
      startedAt: json['started_at'] != null ? DateTime.parse(json['started_at']) : null,
      expiresAt: json['expires_at'] != null ? DateTime.parse(json['expires_at']) : null,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'plan': plan,
      'amount': amount,
      'currency': currency,
      'status': status,
      'idempotency_key': idempotencyKey,
      'mongike_payment_id': snippePaymentId,
      'started_at': startedAt?.toIso8601String(),
      'expires_at': expiresAt?.toIso8601String(),
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}
