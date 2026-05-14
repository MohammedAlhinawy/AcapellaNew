import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../core/theme/app_colors.dart';
import '../../shared/widgets/bottom_nav_bar.dart';
import '../../shared/widgets/mini_player_bar.dart';
import '../../features/home/presentation/home_screen.dart';
import '../../features/explore/presentation/explore_screen.dart';
import '../../features/library/presentation/library_screen.dart';
import '../../features/premium/presentation/premium_screen.dart';
import '../../features/player/bloc/player_cubit.dart';
import '../../features/player/bloc/player_state.dart';

/// Main shell that wraps the 4 primary tabs with the persistent
/// MiniPlayerBar above the bottom navigation.
class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _index = 0;

  static const _screens = [
    HomeScreen(),
    ExploreScreen(),
    LibraryScreen(),
    PremiumScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      extendBody: true,
      body: IndexedStack(
        index: _index,
        children: _screens,
      ),
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // ── Mini player (shown when a track is loaded) ──────────────
          BlocBuilder<PlayerCubit, PlayerState>(
            builder: (ctx, state) {
              if (state is PlayerReady) {
                return MiniPlayerBar(
                  track: state.currentTrack,
                  isPlaying: state.isPlaying,
                );
              }
              return const SizedBox.shrink();
            },
          ),
          // ── Bottom navigation ────────────────────────────────────────
          AcapellaBottomNavBar(
            currentIndex: _index,
            onTap: (i) => setState(() => _index = i),
          ),
        ],
      ),
    );
  }
}
