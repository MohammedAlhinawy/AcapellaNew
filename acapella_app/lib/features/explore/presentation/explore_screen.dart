import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../shared/mock_data.dart';
import '../../../shared/models/album.dart';
import '../../player/bloc/player_cubit.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final _searchCtrl = TextEditingController();
  int _selectedGenre = 0;

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  List<Album> get _filtered {
    final genre = MockData.genres[_selectedGenre];
    final query = _searchCtrl.text.toLowerCase();
    return MockData.albums.where((a) {
      final matchGenre = genre == 'Zote' || a.genre == genre;
      final matchQuery = query.isEmpty ||
          a.title.toLowerCase().contains(query) ||
          a.choirName.toLowerCase().contains(query);
      return matchGenre && matchQuery;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF0A1428), AppColors.backgroundDark],
          stops: [0, 0.4],
        ),
      ),
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Header ──────────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: Text('Gundua', style: AppTextStyles.headingLarge),
            ),
            const SizedBox(height: 16),
            // ── Search bar ───────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: GlassCard(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                borderRadius: 14,
                child: TextField(
                  controller: _searchCtrl,
                  style: AppTextStyles.bodyMedium,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Tafuta kwaya au wimbo...',
                    hintStyle: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textMuted,
                    ),
                    prefixIcon: const Icon(Icons.search_rounded,
                        color: AppColors.textMuted),
                    border: InputBorder.none,
                    enabledBorder: InputBorder.none,
                    focusedBorder: InputBorder.none,
                    filled: false,
                    contentPadding:
                        const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            // ── Genre chips ──────────────────────────────────────────────
            SizedBox(
              height: 40,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: MockData.genres.length,
                itemBuilder: (_, i) {
                  final active = i == _selectedGenre;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedGenre = i),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 250),
                      margin: const EdgeInsets.only(right: 10),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: active
                            ? AppColors.accentGold
                            : AppColors.surfaceGlass,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: active
                              ? AppColors.accentGold
                              : AppColors.borderGlass,
                        ),
                      ),
                      child: Text(
                        MockData.genres[i],
                        style: AppTextStyles.labelMedium.copyWith(
                          color: active
                              ? AppColors.backgroundDark
                              : AppColors.textMuted,
                          fontWeight: active
                              ? FontWeight.w700
                              : FontWeight.w500,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 20),
            // ── Grid ─────────────────────────────────────────────────────
            Expanded(
              child: _filtered.isEmpty
                  ? Center(
                      child: Text(
                        'Hakuna matokeo',
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textMuted,
                        ),
                      ),
                    )
                  : GridView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 14,
                        mainAxisSpacing: 14,
                        childAspectRatio: 0.78,
                      ),
                      itemCount: _filtered.length,
                      itemBuilder: (ctx, i) {
                        final album = _filtered[i];
                        return _ExploreAlbumCard(
                          album: album,
                          onTap: () {
                            final track = MockData.tracks[
                                i % MockData.tracks.length];
                            ctx.read<PlayerCubit>().playTrack(track);
                          },
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ExploreAlbumCard extends StatelessWidget {
  final Album album;
  final VoidCallback onTap;

  const _ExploreAlbumCard({required this.album, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Stack(
                fit: StackFit.expand,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: CachedNetworkImage(
                      imageUrl: album.coverUrl,
                      fit: BoxFit.cover,
                      errorWidget: (_, __, ___) => Container(
                        decoration: BoxDecoration(
                          color: album.accentColor.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(Icons.album_rounded,
                            color: album.accentColor, size: 48),
                      ),
                    ),
                  ),
                  if (album.isPremium)
                    Positioned(
                      top: 6,
                      right: 6,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.accentGold,
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: Text(
                          '★',
                          style: AppTextStyles.caption.copyWith(
                              color: AppColors.backgroundDark,
                              fontSize: 9),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Text(album.title,
                style: AppTextStyles.labelMedium,
                maxLines: 1,
                overflow: TextOverflow.ellipsis),
            const SizedBox(height: 2),
            Text(album.choirName,
                style: AppTextStyles.bodySmall,
                maxLines: 1,
                overflow: TextOverflow.ellipsis),
            const SizedBox(height: 2),
            Text(
              album.genre,
              style: AppTextStyles.caption.copyWith(
                color: album.accentColor,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
