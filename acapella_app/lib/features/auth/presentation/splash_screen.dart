import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _fade;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    );
    _fade = CurvedAnimation(
      parent: _ctrl,
      curve: const Interval(0, 0.65, curve: Curves.easeOut),
    );
    _scale = Tween(begin: 0.75, end: 1.0).animate(
      CurvedAnimation(
        parent: _ctrl,
        curve: const Interval(0, 0.65, curve: Curves.easeOutBack),
      ),
    );
    _ctrl.forward();
    _navigate();
  }

  Future<void> _navigate() async {
    await Future.delayed(const Duration(seconds: 3));
    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/onboarding');
    }
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.center,
            radius: 1.3,
            colors: [Color(0xFF1E0E3A), AppColors.backgroundDark],
          ),
        ),
        child: Center(
          child: FadeTransition(
            opacity: _fade,
            child: ScaleTransition(
              scale: _scale,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // ── Logo mark ──────────────────────────────────────────
                  Container(
                    width: 110,
                    height: 110,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [AppColors.accentGold, AppColors.accentPurple],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.accentPurple.withOpacity(0.5),
                          blurRadius: 50,
                          spreadRadius: 15,
                        ),
                        BoxShadow(
                          color: AppColors.accentGold.withOpacity(0.2),
                          blurRadius: 30,
                          spreadRadius: 5,
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.music_note_rounded,
                      color: Colors.white,
                      size: 52,
                    ),
                  ),
                  const SizedBox(height: 28),
                  Text(
                    'ACAPELLA',
                    style: AppTextStyles.displayLarge.copyWith(
                      letterSpacing: 10,
                      color: AppColors.accentGold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Kwaya Iliyo Bora',
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textMuted,
                      letterSpacing: 3,
                    ),
                  ),
                  const SizedBox(height: 64),
                  SizedBox(
                    width: 48,
                    child: LinearProgressIndicator(
                      backgroundColor: AppColors.borderGlass,
                      valueColor: const AlwaysStoppedAnimation(
                        AppColors.accentGold,
                      ),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
