import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/glass_card.dart';
import '../../player/bloc/player_cubit.dart';
import '../../player/bloc/player_state.dart';
import 'widgets/vinyl_disc.dart';
import 'widgets/player_controls.dart';

class NowPlayingScreen extends StatefulWidget {
  const NowPlayingScreen({super.key});

  @override
  State<NowPlayingScreen> createState() => _NowPlayingScreenState();
}

class _NowPlayingScreenState extends State<NowPlayingScreen> {
  // UI-only scrubber position (0.0 – 1.0)
  double _scrubPosition = 0.0;
  bool _isLiked = false;

  String _formatDuration(Duration d) {
    final m = d.inMinutes;
    final s = d.inSeconds % 60;
    return '$m:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<PlayerCubit, PlayerState>(
      listener: (_, state) {
        if (state is PlayerReady) {
          setState(() => _scrubPosition = state.progress);
        }
      },
      builder: (context, state) {
        if (state is! PlayerReady) {
          return Scaffold(
            backgroundColor: AppColors.backgroundDark,
            body: const Center(
              child: CircularProgressIndicator(color: AppColors.accentGold),
            ),
          );
        }

        final track = state.currentTrack;

        return Scaffold(
          backgroundColor: Colors.transparent,
          body: AnimatedContainer(
            duration: const Duration(milliseconds: 600),
            curve: Curves.easeInOut,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  track.accentColor.withOpacity(0.8),
                  track.accentColor.withOpacity(0.3),
                  AppColors.backgroundDark,
                ],
                stops: const [0, 0.35, 0.75],
              ),
            ),
            child: SafeArea(
              child: Column(
                children: [
                  // ── Top bar ──────────────────────────────────────────
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 8),
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.keyboard_arrow_down_rounded,
                              color: AppColors.textPrimary, size: 32),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                        Expanded(
                          child: Column(
                            children: [
                              Text(
                                'INACHEZWA SASA',
                                style: AppTextStyles.labelSmall.copyWith(
                                  letterSpacing: 2,
                                  color: AppColors.textMuted,
                                ),
                              ),
                              Text(
                                track.albumTitle,
                                style: AppTextStyles.bodySmall,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.more_vert_rounded,
                              color: AppColors.textPrimary),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  // ── Vinyl disc ───────────────────────────────────────
                  Hero(
                    tag: 'player-cover',
                    child: VinylDisc(
                      imageUrl: track.coverUrl,
                      isPlaying: state.isPlaying,
                      accentColor: track.accentColor,
                      size: 280,
                    ),
                  ),
                  const SizedBox(height: 36),
                  // ── Track info ───────────────────────────────────────
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (track.isPremium)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 2),
                                  margin: const EdgeInsets.only(bottom: 6),
                                  decoration: BoxDecoration(
                                    color: AppColors.accentGold.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(
                                      color:
                                          AppColors.accentGold.withOpacity(0.5),
                                    ),
                                  ),
                                  child: Text(
                                    '★ PREMIUM',
                                    style: AppTextStyles.caption.copyWith(
                                      color: AppColors.accentGold,
                                      fontWeight: FontWeight.w700,
                                      fontSize: 9,
                                      letterSpacing: 1.5,
                                    ),
                                  ),
                                ),
                              Text(
                                track.title,
                                style: AppTextStyles.headingMedium,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                track.choirName,
                                style: AppTextStyles.bodyMedium.copyWith(
                                  color: AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: Icon(
                            _isLiked
                                ? Icons.favorite_rounded
                                : Icons.favorite_border_rounded,
                            color: _isLiked
                                ? Colors.red.shade300
                                : AppColors.textMuted,
                            size: 28,
                          ),
                          onPressed: () =>
                              setState(() => _isLiked = !_isLiked),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 28),
                  // ── Progress scrubber ────────────────────────────────
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      children: [
                        SliderTheme(
                          data: SliderTheme.of(context).copyWith(
                            trackHeight: 3,
                            thumbShape: const RoundSliderThumbShape(
                                enabledThumbRadius: 7),
                            overlayShape: const RoundSliderOverlayShape(
                                overlayRadius: 16),
                          ),
                          child: Slider(
                            value: _scrubPosition.clamp(0.0, 1.0),
                            onChanged: (v) =>
                                setState(() => _scrubPosition = v),
                            onChangeEnd: (v) {
                              final pos = Duration(
                                seconds: (v *
                                        track.duration.inSeconds)
                                    .round(),
                              );
                              context.read<PlayerCubit>().seek(pos);
                            },
                            activeColor: AppColors.accentGold,
                            inactiveColor:
                                AppColors.borderGlass,
                          ),
                        ),
                        Padding(
                          padding:
                              const EdgeInsets.symmetric(horizontal: 12),
                          child: Row(
                            mainAxisAlignment:
                                MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                _formatDuration(Duration(
                                  seconds: (_scrubPosition *
                                          track.duration.inSeconds)
                                      .round(),
                                )),
                                style: AppTextStyles.caption,
                              ),
                              Text(
                                _formatDuration(track.duration),
                                style: AppTextStyles.caption,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  // ── Controls ─────────────────────────────────────────
                  Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16),
                    child: PlayerControls(state: state),
                  ),
                  const SizedBox(height: 24),
                  // ── Bottom action bar ────────────────────────────────
                  Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 32),
                    child: GlassCard(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 24, vertical: 12),
                      child: Row(
                        mainAxisAlignment:
                            MainAxisAlignment.spaceAround,
                        children: [
                          _ActionBtn(
                              icon: Icons.playlist_add_rounded,
                              label: 'Orodha',
                              onTap: () {}),
                          _ActionBtn(
                              icon: Icons.share_rounded,
                              label: 'Shiriki',
                              onTap: () {}),
                          _ActionBtn(
                              icon: Icons.lyrics_rounded,
                              label: 'Maneno',
                              onTap: () {}),
                          _ActionBtn(
                              icon: Icons.download_rounded,
                              label: 'Pakua',
                              onTap: () {}),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class _ActionBtn extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ActionBtn({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: AppColors.textMuted, size: 22),
            const SizedBox(height: 4),
            Text(label, style: AppTextStyles.caption),
          ],
        ),
      ),
    );
  }
}
