import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../shared/models/track.dart';
import '../../../shared/mock_data.dart';
import 'player_state.dart';

/// Manages playback state — stub for now, wire up just_audio later.
class PlayerCubit extends Cubit<PlayerState> {
  PlayerCubit() : super(const PlayerInitial());

  // ── Playback controls ──────────────────────────────────────────────────────

  void playTrack(Track track, {List<Track>? queue}) {
    final q = queue ?? MockData.tracks;
    final idx = q.indexWhere((t) => t.id == track.id);
    emit(PlayerReady(
      currentTrack: track,
      isPlaying: true,
      queue: q,
      currentIndex: idx >= 0 ? idx : 0,
    ));
  }

  void togglePlay() {
    if (state is PlayerReady) {
      final s = state as PlayerReady;
      emit(s.copyWith(isPlaying: !s.isPlaying));
    }
  }

  void next() {
    if (state is! PlayerReady) return;
    final s = state as PlayerReady;
    if (s.currentIndex < s.queue.length - 1) {
      final next = s.queue[s.currentIndex + 1];
      emit(s.copyWith(
        currentTrack: next,
        currentIndex: s.currentIndex + 1,
        position: Duration.zero,
        isPlaying: true,
      ));
    }
  }

  void previous() {
    if (state is! PlayerReady) return;
    final s = state as PlayerReady;
    if (s.currentIndex > 0) {
      final prev = s.queue[s.currentIndex - 1];
      emit(s.copyWith(
        currentTrack: prev,
        currentIndex: s.currentIndex - 1,
        position: Duration.zero,
        isPlaying: true,
      ));
    }
  }

  void seek(Duration position) {
    if (state is PlayerReady) {
      emit((state as PlayerReady).copyWith(position: position));
    }
  }

  void toggleShuffle() {
    if (state is PlayerReady) {
      final s = state as PlayerReady;
      emit(s.copyWith(isShuffle: !s.isShuffle));
    }
  }

  void toggleRepeat() {
    if (state is PlayerReady) {
      final s = state as PlayerReady;
      emit(s.copyWith(isRepeat: !s.isRepeat));
    }
  }
}
