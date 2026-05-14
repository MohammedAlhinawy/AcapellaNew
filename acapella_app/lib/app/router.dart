import 'package:flutter/material.dart';
import '../features/auth/presentation/splash_screen.dart';
import '../features/auth/presentation/onboarding_screen.dart';
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/register_screen.dart';
import '../features/player/presentation/now_playing_screen.dart';
import 'main_shell.dart';

class AppRouter {
  AppRouter._();

  static Map<String, WidgetBuilder> get routes => {
        '/': (_) => const SplashScreen(),
        '/onboarding': (_) => const OnboardingScreen(),
        '/login': (_) => const LoginScreen(),
        '/register': (_) => const RegisterScreen(),
        '/home': (_) => const MainShell(),
      };

  /// Handles routes that require arguments (e.g. /player).
  static Route<dynamic>? onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/player':
        return PageRouteBuilder(
          pageBuilder: (_, __, ___) => const NowPlayingScreen(),
          transitionsBuilder: (_, anim, __, child) {
            return SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0, 1),
                end: Offset.zero,
              ).animate(CurvedAnimation(parent: anim, curve: Curves.easeOut)),
              child: child,
            );
          },
          transitionDuration: const Duration(milliseconds: 380),
          fullscreenDialog: true,
        );
      default:
        return null;
    }
  }
}
