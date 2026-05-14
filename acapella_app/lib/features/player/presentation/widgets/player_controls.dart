import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_colors.dart';
import '../../bloc/player_cubit.dart';
import '../../bloc/player_state.dart';

/// Playback control row: shuffle · prev · play/pause · next · repeat.
class PlayerControls extends StatelessWidget {
  final PlayerReady state;

  const PlayerControls({super.key, required this.state});

  @override
  Widget build(BuildContext context) {
    final cubit = context.read<PlayerCubit>();

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        // Shuffle
        _ControlBtn(
          icon: Icons.shuffle_rounded,
          size: 22,
          color: state.isShuffle
              ? AppColors.accentGold
              : AppColors.textMuted,
          onTap: cubit.toggleShuffle,
        ),
        // Previous
        _ControlBtn(
          icon: Icons.skip_previous_rounded,
          size: 36,
          color: AppColors.textPrimary,
          onTap: cubit.previous,
        ),
        // Play / Pause (large)
        GestureDetector(
          onTap: cubit.togglePlay,
          child: Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [AppColors.accentGoldLight, AppColors.accentGold],
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.accentGold.withOpacity(0.4),
                  blurRadius: 24,
                  spreadRadius: 4,
                ),
              ],
            ),
            child: Icon(
              state.isPlaying
                  ? Icons.pause_rounded
                  : Icons.play_arrow_rounded,
              color: AppColors.backgroundDark,
              size: 38,
            ),
          ),
        ),
        // Next
        _ControlBtn(
          icon: Icons.skip_next_rounded,
          size: 36,
          color: AppColors.textPrimary,
          onTap: cubit.next,
        ),
        // Repeat
        _ControlBtn(
          icon: Icons.repeat_rounded,
          size: 22,
          color: state.isRepeat
              ? AppColors.accentGold
              : AppColors.textMuted,
          onTap: cubit.toggleRepeat,
        ),
      ],
    );
  }
}

class _ControlBtn extends StatelessWidget {
  final IconData icon;
  final double size;
  final Color color;
  final VoidCallback onTap;

  const _ControlBtn({
    required this.icon,
    required this.size,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return IconButton(
      onPressed: onTap,
      icon: Icon(icon, color: color, size: size),
      splashRadius: 28,
    );
  }
}
