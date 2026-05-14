import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../shared/mock_data.dart';
import '../../../shared/models/album.dart';
import '../../../shared/models/choir.dart';
import '../../../shared/models/track.dart';
import '../../player/bloc/player_cubit.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF14082A), AppColors.backgroundDark],
          stops: [0, 0.45],
        ),
      ),
      child: CustomScrollView(
        slivers: [
          _buildAppBar(),
          SliverToBoxAdapter(child: _FeaturedSection()),
          SliverToBoxAdapter(child: _RecentSection()),
          SliverToBoxAdapter(child: _TrendingSection()),
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }

  SliverAppBar _buildAppBar() {
    return SliverAppBar(
      expandedHeight: 110,
      floating: true,
      snap: true,
      backgroundColor: Colors.transparent,
      flexibleSpace: FlexibleSpaceBar(
        background: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Habari za leo 👋',
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.textMuted,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text('Karibu, Msikilizaji', style: AppTextStyles.headingMedium),
                  ],
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.search_rounded,
                      color: AppColors.textPrimary, size: 26),
                  onPressed: () {},
                ),
                const SizedBox(width: 4),
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppColors.accentPurple,
                  child: Text(
                    'K',
                    style: AppTextStyles.labelLarge
                        .copyWith(color: Colors.white),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ── Featured Albums ──────────────────────────────────────────────────────────
class _FeaturedSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionHeader(title: 'Inayopendelewa', onMore: () {}),
        SizedBox(
          height: 230,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            itemCount: MockData.albums.length,
            itemBuilder: (ctx, i) {
              final album = MockData.albums[i];
              return _AlbumCard(
                album: album,
                onTap: () {
                  final t = MockData.tracks[i % MockData.tracks.length];
                  ctx.read<PlayerCubit>().playTrack(t);
                },
              );
            },
          ),
        ),
      ],
    );
  }
}

class _AlbumCard extends StatelessWidget {
  final Album album;
  final VoidCallback onTap;

  const _AlbumCard({required this.album, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 156,
        margin: const EdgeInsets.only(right: 16, bottom: 4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cover
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(14),
                  child: CachedNetworkImage(
                    imageUrl: album.coverUrl,
                    width: 156,
                    height: 156,
                    fit: BoxFit.cover,
                    placeholder: (_, __) => Container(
                      width: 156,
                      height: 156,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(14),
                        color: album.accentColor.withOpacity(0.3),
                      ),
                    ),
                    errorWidget: (_, __, ___) => Container(
                      width: 156,
                      height: 156,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(14),
                        color: album.accentColor.withOpacity(0.3),
                      ),
                      child: Icon(Icons.album_rounded,
                          color: album.accentColor, size: 56),
                    ),
                  ),
                ),
                // Premium badge
                if (album.isPremium)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.accentGold,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'PREMIUM',
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.backgroundDark,
                          fontWeight: FontWeight.w800,
                          fontSize: 8,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                  ),
                // Play overlay on hover (always slightly visible)
                Positioned(
                  bottom: 8,
                  right: 8,
                  child: Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.backgroundDark.withOpacity(0.6),
                    ),
                    child: Icon(Icons.play_arrow_rounded,
                        color: album.accentColor, size: 32),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(album.title,
                style: AppTextStyles.labelMedium,
                maxLines: 1,
                overflow: TextOverflow.ellipsis),
            const SizedBox(height: 2),
            Text(album.choirName,
                style: AppTextStyles.bodySmall,
                maxLines: 1,
                overflow: TextOverflow.ellipsis),
          ],
        ),
      ),
    );
  }
}

// ── Recent Tracks ────────────────────────────────────────────────────────────
class _RecentSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionHeader(title: 'Imechezwa Hivi Karibuni', onMore: () {}),
        SizedBox(
          height: 88,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            itemCount: MockData.tracks.length,
            itemBuilder: (ctx, i) {
              final track = MockData.tracks[i];
              return _RecentTile(
                track: track,
                onTap: () => ctx.read<PlayerCubit>().playTrack(track),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _RecentTile extends StatelessWidget {
  final Track track;
  final VoidCallback onTap;

  const _RecentTile({required this.track, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        margin: const EdgeInsets.only(right: 12),
        padding: const EdgeInsets.all(10),
        width: 250,
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: CachedNetworkImage(
                imageUrl: track.coverUrl,
                width: 52,
                height: 52,
                fit: BoxFit.cover,
                errorWidget: (_, __, ___) => Container(
                  width: 52,
                  height: 52,
                  color: track.accentColor.withOpacity(0.3),
                  child: Icon(Icons.music_note, color: track.accentColor),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(track.title,
                      style: AppTextStyles.labelMedium,
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
            Icon(Icons.play_circle_rounded, color: track.accentColor, size: 30),
          ],
        ),
      ),
    );
  }
}

// ── Trending Choirs ──────────────────────────────────────────────────────────
class _TrendingSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 28, 20, 16),
          child: Row(
            children: [
              Text('Trending Kwaya', style: AppTextStyles.headingSmall),
              const SizedBox(width: 10),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.accentGold.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppColors.accentGold.withOpacity(0.4),
                  ),
                ),
                child: Text(
                  'LIVE',
                  style: AppTextStyles.labelSmall.copyWith(
                    color: AppColors.accentGold,
                    letterSpacing: 1.5,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ],
          ),
        ),
        ...MockData.choirs.map((c) => _ChoirTile(choir: c)),
      ],
    );
  }
}

class _ChoirTile extends StatelessWidget {
  final Choir choir;

  const _ChoirTile({required this.choir});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      margin: const EdgeInsets.fromLTRB(20, 0, 20, 12),
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          ClipOval(
            child: CachedNetworkImage(
              imageUrl: choir.imageUrl,
              width: 52,
              height: 52,
              fit: BoxFit.cover,
              errorWidget: (_, __, ___) => CircleAvatar(
                radius: 26,
                backgroundColor: AppColors.accentPurple,
                child: Text(choir.name[0],
                    style: AppTextStyles.headingSmall),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(choir.name,
                          style: AppTextStyles.labelLarge,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis),
                    ),
                    if (choir.isVerified) ...[
                      const SizedBox(width: 4),
                      const Icon(Icons.verified_rounded,
                          color: AppColors.accentGold, size: 16),
                    ],
                  ],
                ),
                const SizedBox(height: 2),
                Text(choir.location, style: AppTextStyles.bodySmall),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${choir.albumCount} album',
                style: AppTextStyles.caption,
              ),
              Text(
                '${choir.trackCount} wimbo',
                style: AppTextStyles.caption,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ── Section Header ───────────────────────────────────────────────────────────
class _SectionHeader extends StatelessWidget {
  final String title;
  final VoidCallback? onMore;

  const _SectionHeader({required this.title, this.onMore});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 28, 12, 16),
      child: Row(
        children: [
          Text(title, style: AppTextStyles.headingSmall),
          const Spacer(),
          if (onMore != null)
            TextButton(
              onPressed: onMore,
              child: Text(
                'Zaidi →',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.accentGold,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
