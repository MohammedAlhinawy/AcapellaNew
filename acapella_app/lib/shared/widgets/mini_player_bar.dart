import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../models/track.dart';
import '../../features/player/bloc/player_cubit.dart';

/// Persistent mini player bar pinned above the bottom nav.
/// Tapping opens the full Now Playing screen.
class MiniPlayerBar extends StatelessWidget {
  final Track track;
  final bool isPlaying;

  const MiniPlayerBar({
    super.key,
    required this.track,
    required this.isPlaying,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.of(context).pushNamed('/player'),
      child: ClipRect(
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            height: 72,
            decoration: BoxDecoration(
              color: track.accentColor.withOpacity(0.18),
              border: Border(
                top: BorderSide(
                  color: track.accentColor.withOpacity(0.35),
                  width: 1,
                ),
                bottom: BorderSide(color: AppColors.borderGlass, width: 0.5),
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  // ── Cover art ────────────────────────────────────────────
                  Hero(
                    tag: 'player-cover',
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: CachedNetworkImage(
                        imageUrl: track.coverUrl,
                        width: 48,
                        height: 48,
                        fit: BoxFit.cover,
                        placeholder: (_, __) => Container(
                          width: 48,
                          height: 48,
                          color: track.accentColor.withOpacity(0.3),
                          child: const Icon(
                            Icons.music_note,
                            color: AppColors.textMuted,
                            size: 20,
                          ),
                        ),
                        errorWidget: (_, __, ___) => Container(
                          width: 48,
                          height: 48,
                          color: track.accentColor.withOpacity(0.3),
                          child: Icon(
                            Icons.music_note,
                            color: track.accentColor,
                            size: 20,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  // ── Track info ───────────────────────────────────────────
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          track.title,
                          style: AppTextStyles.labelLarge,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          track.choirName,
                          style: AppTextStyles.bodySmall,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  // ── Controls ─────────────────────────────────────────────
                  IconButton(
                    icon: Icon(
                      isPlaying
                          ? Icons.pause_circle_filled_rounded
                          : Icons.play_circle_filled_rounded,
                      color: AppColors.accentGold,
                      size: 36,
                    ),
                    onPressed: () => context.read<PlayerCubit>().togglePlay(),
                    padding: EdgeInsets.zero,
                  ),
                  IconButton(
                    icon: const Icon(
                      Icons.skip_next_rounded,
                      color: AppColors.textMuted,
                      size: 28,
                    ),
                    onPressed: () => context.read<PlayerCubit>().next(),
                    padding: EdgeInsets.zero,
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
