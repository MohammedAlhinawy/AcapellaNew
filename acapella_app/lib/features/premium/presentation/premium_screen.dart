import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/glass_card.dart';

class PremiumScreen extends StatelessWidget {
  const PremiumScreen({super.key});

  static const _features = [
    _Feature(
      icon: Icons.offline_bolt_rounded,
      title: 'Sikiliza Bila Mtandao',
      free: false,
      premium: true,
    ),
    _Feature(
      icon: Icons.phonelink_lock_rounded,
      title: 'Cheza Nyuma ya Skrini',
      free: false,
      premium: true,
    ),
    _Feature(
      icon: Icons.lock_open_rounded,
      title: 'Funga Skrini na Usikie',
      free: false,
      premium: true,
    ),
    _Feature(
      icon: Icons.high_quality_rounded,
      title: 'Ubora wa Sauti wa Juu',
      free: false,
      premium: true,
    ),
    _Feature(
      icon: Icons.play_circle_filled_rounded,
      title: 'Streaming ya Bure',
      free: true,
      premium: true,
    ),
    _Feature(
      icon: Icons.explore_rounded,
      title: 'Gundua Kwaya Mpya',
      free: true,
      premium: true,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF1E1206),
            Color(0xFF0E0A1E),
            AppColors.backgroundDark,
          ],
          stops: [0, 0.5, 1],
        ),
      ),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 32),
              // ── Crown icon ───────────────────────────────────────────────
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFFE8C98E), AppColors.accentGold],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.accentGold.withOpacity(0.5),
                      blurRadius: 50,
                      spreadRadius: 10,
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.workspace_premium_rounded,
                  color: AppColors.backgroundDark,
                  size: 52,
                ),
              ),
              const SizedBox(height: 24),
              Text('Acapella Premium', style: AppTextStyles.headingLarge),
              const SizedBox(height: 8),
              Text(
                'Sikiliza kasoro ya wimbo, popote na wakati wowote.',
                style: AppTextStyles.bodyMedium
                    .copyWith(color: AppColors.textMuted),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              // ── Price card ───────────────────────────────────────────────
              GlassCard(
                padding: const EdgeInsets.all(24),
                borderColor: AppColors.accentGold.withOpacity(0.4),
                fillColor: AppColors.accentGold.withOpacity(0.06),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      'TZS 5,000',
                      style: AppTextStyles.headingLarge.copyWith(
                        color: AppColors.accentGold,
                        fontSize: 32,
                      ),
                    ),
                    Text(
                      '/=',
                      style: AppTextStyles.headingSmall.copyWith(
                        color: AppColors.accentGold,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Text(
                        '/ mwezi',
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textMuted,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),
              // ── Features table ───────────────────────────────────────────
              GlassCard(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    // Header
                    Row(
                      children: [
                        const Expanded(flex: 4, child: SizedBox()),
                        Expanded(
                          flex: 2,
                          child: Center(
                            child: Text('Bure',
                                style: AppTextStyles.labelMedium.copyWith(
                                    color: AppColors.textMuted)),
                          ),
                        ),
                        Expanded(
                          flex: 2,
                          child: Center(
                            child: Text(
                              'Premium',
                              style: AppTextStyles.labelMedium.copyWith(
                                color: AppColors.accentGold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 20),
                    ..._features.map((f) => _FeatureRow(feature: f)),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              // ── CTA ──────────────────────────────────────────────────────
              SizedBox(
                width: double.infinity,
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(14),
                    gradient: const LinearGradient(
                      colors: [
                        AppColors.accentGoldLight,
                        AppColors.accentGold,
                        Color(0xFFA8894E),
                      ],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.accentGold.withOpacity(0.4),
                        blurRadius: 20,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      foregroundColor: AppColors.backgroundDark,
                      shadowColor: Colors.transparent,
                      padding: const EdgeInsets.symmetric(vertical: 18),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    onPressed: () {},
                    icon: const Icon(Icons.workspace_premium_rounded, size: 22),
                    label: Text(
                      'Pata Premium Sasa',
                      style: AppTextStyles.buttonText.copyWith(fontSize: 17),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              // ── Payment methods ──────────────────────────────────────────
              Text(
                'Lipa kwa Mongike — M-Pesa · Airtel · Tigo · Card',
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.textMuted,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Ghairi wakati wowote. Bei ni TZS na kodi.\nHakuna ada ya siri.',
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.textDisabled,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

class _FeatureRow extends StatelessWidget {
  final _Feature feature;

  const _FeatureRow({required this.feature});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(feature.icon, color: AppColors.textMuted, size: 18),
          const SizedBox(width: 10),
          Expanded(
            flex: 4,
            child: Text(feature.title, style: AppTextStyles.bodyMedium),
          ),
          Expanded(
            flex: 2,
            child: Center(
              child: Icon(
                feature.free ? Icons.check_rounded : Icons.close_rounded,
                color: feature.free ? AppColors.success : AppColors.textDisabled,
                size: 18,
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Center(
              child: Icon(
                feature.premium ? Icons.check_rounded : Icons.close_rounded,
                color: feature.premium
                    ? AppColors.accentGold
                    : AppColors.textDisabled,
                size: 18,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Feature {
  final IconData icon;
  final String title;
  final bool free;
  final bool premium;

  const _Feature({
    required this.icon,
    required this.title,
    required this.free,
    required this.premium,
  });
}
