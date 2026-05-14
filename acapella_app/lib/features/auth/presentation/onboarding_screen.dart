import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _page = 0;

  static const _pages = [
    _OBPage(
      icon: Icons.queue_music_rounded,
      iconColor: Color(0xFF9B7EC7),
      gradientColors: [Color(0xFF1E0E3A), Color(0xFF2A1650)],
      title: 'Kwaya Iliyo Bora',
      subtitle: 'Gundua nyimbo bora za kwaya kutoka Tanzania yote',
      body:
          'Sikiliza makabila bora, wimbo wa kwaya, na nyimbo za kiroho zinazokugusa moyo kila siku.',
    ),
    _OBPage(
      icon: Icons.offline_bolt_rounded,
      iconColor: Color(0xFFC8A96E),
      gradientColors: [Color(0xFF0A1A30), Color(0xFF102040)],
      title: 'Sikiliza Bila Kikwazo',
      subtitle: 'Premium: Pakua wimbo na usikie bila mtandao',
      body:
          'Washa muziki nyuma ya skrini, kwenye lock screen, au bila mtandao — kwa watumiaji wa Premium tu.',
    ),
    _OBPage(
      icon: Icons.workspace_premium_rounded,
      iconColor: Color(0xFFC8A96E),
      gradientColors: [Color(0xFF260A26), Color(0xFF3A1240)],
      title: 'Anza Leo',
      subtitle: 'Jiunge bure au pata Premium kwa TZS 5,000/=',
      body:
          'Tafuta, sikiliza, na ushiriki nyimbo za kwaya na ndugu na marafiki kwa urahisi.',
    ),
  ];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _next() {
    if (_page < _pages.length - 1) {
      _controller.nextPage(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    } else {
      Navigator.of(context).pushReplacementNamed('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: Column(
        children: [
          Expanded(
            child: PageView.builder(
              controller: _controller,
              onPageChanged: (i) => setState(() => _page = i),
              itemCount: _pages.length,
              itemBuilder: (_, i) => _buildPage(_pages[i]),
            ),
          ),
          _buildBottom(),
        ],
      ),
    );
  }

  Widget _buildPage(_OBPage p) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [...p.gradientColors, AppColors.backgroundDark],
          stops: const [0, 0.55, 1],
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 36),
          child: Column(
            children: [
              const Spacer(flex: 2),
              // ── Icon orb ──────────────────────────────────────────────
              Container(
                width: 150,
                height: 150,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: p.iconColor.withOpacity(0.12),
                  border: Border.all(
                    color: p.iconColor.withOpacity(0.25),
                    width: 1.5,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: p.iconColor.withOpacity(0.35),
                      blurRadius: 70,
                      spreadRadius: 20,
                    ),
                  ],
                ),
                child: Icon(p.icon, color: p.iconColor, size: 68),
              ),
              const Spacer(flex: 1),
              Text(p.title, style: AppTextStyles.headingLarge, textAlign: TextAlign.center),
              const SizedBox(height: 12),
              Text(
                p.subtitle,
                style: AppTextStyles.bodyLarge.copyWith(color: AppColors.accentGold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                p.body,
                style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textMuted),
                textAlign: TextAlign.center,
              ),
              const Spacer(flex: 3),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottom() {
    final isLast = _page == _pages.length - 1;
    return Padding(
      padding: const EdgeInsets.fromLTRB(32, 16, 32, 48),
      child: Column(
        children: [
          // Dot indicators
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(_pages.length, (i) {
              final active = i == _page;
              return AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.symmetric(horizontal: 4),
                width: active ? 28 : 8,
                height: 8,
                decoration: BoxDecoration(
                  color: active ? AppColors.accentGold : AppColors.borderGlass,
                  borderRadius: BorderRadius.circular(4),
                ),
              );
            }),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _next,
              child: Text(isLast ? 'Anza Sasa' : 'Endelea'),
            ),
          ),
          if (!isLast)
            TextButton(
              onPressed: () =>
                  Navigator.of(context).pushReplacementNamed('/login'),
              child: Text(
                'Ruka',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textMuted,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _OBPage {
  final IconData icon;
  final Color iconColor;
  final List<Color> gradientColors;
  final String title;
  final String subtitle;
  final String body;

  const _OBPage({
    required this.icon,
    required this.iconColor,
    required this.gradientColors,
    required this.title,
    required this.subtitle,
    required this.body,
  });
}
