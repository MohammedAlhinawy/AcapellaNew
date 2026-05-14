import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // ── Backgrounds ────────────────────────────────────────────────────────────
  static const Color backgroundDark = Color(0xFF0A0A14);
  static const Color surfaceDeep = Color(0xFF0F0D1E);
  static const Color cardBg = Color(0xFF141226);

  // ── Glassmorphism ──────────────────────────────────────────────────────────
  /// 8% white fill for glass cards
  static const Color surfaceGlass = Color(0x14FFFFFF);
  /// 15% white border for glass cards
  static const Color borderGlass = Color(0x26FFFFFF);

  // ── Accents ────────────────────────────────────────────────────────────────
  static const Color accentGold = Color(0xFFC8A96E);
  static const Color accentGoldLight = Color(0xFFE8C98E);
  static const Color accentPurple = Color(0xFF7B5EA7);
  static const Color accentPurpleLight = Color(0xFF9B7EC7);

  // ── Text ───────────────────────────────────────────────────────────────────
  static const Color textPrimary = Color(0xFFF0EAD6);
  static const Color textSecondary = Color(0xFFB8B2A0);
  static const Color textMuted = Color(0xFF8A8A9A);
  static const Color textDisabled = Color(0xFF4A4A5A);

  // ── Status ─────────────────────────────────────────────────────────────────
  static const Color success = Color(0xFF4CAF82);
  static const Color error = Color(0xFFE05C5C);
  static const Color warning = Color(0xFFF0A832);

  // ── Gradient stops ─────────────────────────────────────────────────────────
  static const Color gradientStart = Color(0xFF0A0A14);
  static const Color gradientMid = Color(0xFF1A0E2E);
  static const Color gradientEnd = Color(0xFF0D0820);
}
