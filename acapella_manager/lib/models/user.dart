class User {
  final int id;
  final String name;
  final String email;
  final String role;
  final bool isPremium;
  final DateTime? premiumExpiresAt;
  final String? snippeCustomerId;
  final String language;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.isPremium,
    this.premiumExpiresAt,
    this.snippeCustomerId,
    required this.language,
    this.createdAt,
    this.updatedAt,
  });

  bool get isListener => role == 'listener';
  bool get isChoirManager => role == 'choir_manager';
  bool get isAdmin => role == 'admin';

  bool get isPremiumActive {
    return isPremium && (premiumExpiresAt == null || premiumExpiresAt!.isAfter(DateTime.now()));
  }

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      role: json['role'] ?? 'listener',
      isPremium: json['is_premium'] == 1 || json['is_premium'] == true,
      premiumExpiresAt: json['premium_expires_at'] != null 
          ? DateTime.parse(json['premium_expires_at']) 
          : null,
      snippeCustomerId: json['snippe_customer_id'],
      language: json['language'] ?? 'sw',
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'is_premium': isPremium,
      'premium_expires_at': premiumExpiresAt?.toIso8601String(),
      'snippe_customer_id': snippeCustomerId,
      'language': language,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}
