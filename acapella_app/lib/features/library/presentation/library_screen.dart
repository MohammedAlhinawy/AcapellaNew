import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../shared/mock_data.dart';
import '../../../shared/models/track.dart';
import '../../player/bloc/player_cubit.dart';

class LibraryScreen extends StatefulWidget {
  const LibraryScreen({super.key});

  @override
  State<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends State<LibraryScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;

  static const _tabs = [
    _TabItem(icon: Icons.download_rounded, label: 'Imepakiwa'),
    _TabItem(icon: Icons.favorite_rounded, label: 'Zipendwazo'),
    _TabItem(icon: Icons.history_rounded, label: 'Historia'),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    _tabController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF0A1820), AppColors.backgroundDark],
          stops: [0, 0.4],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: Text('Maktaba Yangu', style: AppTextStyles.headingLarge),
            ),
          ),
          const SizedBox(height: 20),

          // ── Custom animated pill tab bar ──────────────────────────────
          _PillTabBar(tabs: _tabs, controller: _tabController),

          const SizedBox(height: 16),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _DownloadsTab(),
                _TrackListTab(tracks: MockData.tracks.reversed.toList()),
                _TrackListTab(tracks: MockData.tracks),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Custom Pill Tab Bar ───────────────────────────────────────────────────────
class _PillTabBar extends StatelessWidget {
  final List<_TabItem> tabs;
  final TabController controller;

  const _PillTabBar({required this.tabs, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            height: 56,
            decoration: BoxDecoration(
              color: AppColors.surfaceGlass,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.borderGlass),
            ),
            child: LayoutBuilder(
              builder: (context, constraints) {
                final tabWidth = constraints.maxWidth / tabs.length;
                final selectedIndex = controller.index;

                return Stack(
                  children: [
                    // ── Sliding gold pill indicator ────────────────────
                    AnimatedPositioned(
                      duration: const Duration(milliseconds: 280),
                      curve: Curves.easeInOut,
                      left: tabWidth * selectedIndex + 4,
                      top: 4,
                      bottom: 4,
                      width: tabWidth - 8,
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              AppColors.accentGold.withOpacity(0.22),
                              AppColors.accentGold.withOpacity(0.10),
                            ],
                          ),
                          border: Border.all(
                            color: AppColors.accentGold.withOpacity(0.5),
                            width: 1,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.accentGold.withOpacity(0.25),
                              blurRadius: 16,
                              spreadRadius: 1,
                            ),
                          ],
                        ),
                      ),
                    ),

                    // ── Tab buttons ────────────────────────────────────
                    Row(
                      children: List.generate(tabs.length, (i) {
                        final isActive = i == selectedIndex;
                        return GestureDetector(
                          behavior: HitTestBehavior.opaque,
                          onTap: () => controller.animateTo(i),
                          child: SizedBox(
                            width: tabWidth,
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                AnimatedScale(
                                  scale: isActive ? 1.2 : 1.0,
                                  duration: const Duration(milliseconds: 250),
                                  child: Icon(
                                    tabs[i].icon,
                                    size: 16,
                                    color: isActive
                                        ? AppColors.accentGold
                                        : AppColors.textMuted,
                                  ),
                                ),
                                const SizedBox(height: 3),
                                AnimatedDefaultTextStyle(
                                  duration: const Duration(milliseconds: 250),
                                  style: isActive
                                      ? AppTextStyles.labelSmall.copyWith(
                                          color: AppColors.accentGold,
                                          fontWeight: FontWeight.w700,
                                          letterSpacing: 0.3,
                                        )
                                      : AppTextStyles.labelSmall.copyWith(
                                          color: AppColors.textMuted,
                                          fontWeight: FontWeight.w500,
                                        ),
                                  child: Text(tabs[i].label),
                                ),
                              ],
                            ),
                          ),
                        );
                      }),
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}

class _TabItem {
  final IconData icon;
  final String label;
  const _TabItem({required this.icon, required this.label});
}

// ── Downloads Tab ─────────────────────────────────────────────────────────────
class _DownloadsTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 96,
            height: 96,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.accentGold.withOpacity(0.08),
              border: Border.all(
                color: AppColors.accentGold.withOpacity(0.3),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.accentGold.withOpacity(0.2),
                  blurRadius: 30,
                  spreadRadius: 4,
                ),
              ],
            ),
            child: const Icon(
              Icons.lock_rounded,
              color: AppColors.accentGold,
              size: 42,
            ),
          ),
          const SizedBox(height: 22),
          Text('Kipengele cha Premium', style: AppTextStyles.headingSmall),
          const SizedBox(height: 10),
          Text(
            'Pata Premium ili upakue wimbo\nna usikie bila mtandao.',
            style:
                AppTextStyles.bodyMedium.copyWith(color: AppColors.textMuted),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 28),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.workspace_premium_rounded, size: 18),
            label: const Text('Pata Premium'),
          ),
        ],
      ),
    );
  }
}

// ── Generic Track List Tab ───────────────────────────────────────────────────
class _TrackListTab extends StatelessWidget {
  final List<Track> tracks;

  const _TrackListTab({required this.tracks});

  @override
  Widget build(BuildContext context) {
    if (tracks.isEmpty) {
      return Center(
        child: Text(
          'Hakuna wimbo bado.',
          style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textMuted),
        ),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
      itemCount: tracks.length,
      itemBuilder: (ctx, i) => _LibraryTrackTile(
        track: tracks[i],
        index: i + 1,
        onTap: () => ctx.read<PlayerCubit>().playTrack(tracks[i]),
      ),
    );
  }
}

class _LibraryTrackTile extends StatelessWidget {
  final Track track;
  final int index;
  final VoidCallback onTap;

  const _LibraryTrackTile({
    required this.track,
    required this.index,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      onTap: onTap,
      child: Row(
        children: [
          SizedBox(
            width: 24,
            child: Text(
              '$index',
              style: AppTextStyles.caption.copyWith(color: AppColors.textMuted),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(width: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: CachedNetworkImage(
              imageUrl: track.coverUrl,
              width: 48,
              height: 48,
              fit: BoxFit.cover,
              errorWidget: (_, __, ___) => Container(
                width: 48,
                height: 48,
                color: track.accentColor.withOpacity(0.3),
                child: Icon(Icons.music_note, color: track.accentColor),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(track.title,
                    style: AppTextStyles.labelLarge,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis),
                const SizedBox(height: 2),
                Text(track.choirName,
                    style: AppTextStyles.bodySmall,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
          if (track.isPremium)
            const Icon(Icons.workspace_premium_rounded,
                color: AppColors.accentGold, size: 16),
          const SizedBox(width: 8),
          Text(track.durationLabel, style: AppTextStyles.caption),
          const SizedBox(width: 4),
          const Icon(Icons.more_vert_rounded,
              color: AppColors.textMuted, size: 20),
        ],
      ),
    );
  }
}
