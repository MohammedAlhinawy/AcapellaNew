import 'dart:math';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/theme/app_colors.dart';

/// Spinning vinyl disc widget.
/// Rotates when [isPlaying] is true, pauses when false.
class VinylDisc extends StatefulWidget {
  final String imageUrl;
  final bool isPlaying;
  final Color accentColor;
  final double size;

  const VinylDisc({
    super.key,
    required this.imageUrl,
    required this.isPlaying,
    required this.accentColor,
    this.size = 280,
  });

  @override
  State<VinylDisc> createState() => _VinylDiscState();
}

class _VinylDiscState extends State<VinylDisc>
    with SingleTickerProviderStateMixin {
  late final AnimationController _spin;

  @override
  void initState() {
    super.initState();
    _spin = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    );
    if (widget.isPlaying) _spin.repeat();
  }

  @override
  void didUpdateWidget(VinylDisc old) {
    super.didUpdateWidget(old);
    if (widget.isPlaying && !_spin.isAnimating) {
      _spin.repeat();
    } else if (!widget.isPlaying && _spin.isAnimating) {
      _spin.stop();
    }
  }

  @override
  void dispose() {
    _spin.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = widget.size;
    return AnimatedBuilder(
      animation: _spin,
      builder: (_, child) =>
          Transform.rotate(angle: _spin.value * 2 * pi, child: child),
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: widget.accentColor.withOpacity(0.55),
              blurRadius: 60,
              spreadRadius: 8,
            ),
            BoxShadow(
              color: Colors.black.withOpacity(0.5),
              blurRadius: 30,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            // ── Vinyl grooves ring ──────────────────────────────────────
            Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.black,
                border: Border.all(
                  color: Colors.white.withOpacity(0.08),
                  width: 2,
                ),
              ),
            ),
            // ── Cover art (inner circle) ────────────────────────────────
            ClipOval(
              child: CachedNetworkImage(
                imageUrl: widget.imageUrl,
                width: size * 0.6,
                height: size * 0.6,
                fit: BoxFit.cover,
                errorWidget: (_, __, ___) => Container(
                  width: size * 0.6,
                  height: size * 0.6,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: widget.accentColor.withOpacity(0.4),
                  ),
                  child: Icon(
                    Icons.music_note_rounded,
                    color: Colors.white,
                    size: size * 0.22,
                  ),
                ),
              ),
            ),
            // ── Vinyl grooves (decorative rings) ───────────────────────
            for (final scale in [0.72, 0.80, 0.88, 0.96])
              Container(
                width: size * scale,
                height: size * scale,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Colors.white.withOpacity(0.04),
                    width: 1.5,
                  ),
                ),
              ),
            // ── Center spindle hole ─────────────────────────────────────
            Container(
              width: size * 0.1,
              height: size * 0.1,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.backgroundDark,
                border: Border.all(
                  color: Colors.white.withOpacity(0.15),
                  width: 2,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
