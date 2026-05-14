import 'package:equatable/equatable.dart';
import '../../../shared/models/track.dart';

abstract class PlayerState extends Equatable {
  const PlayerState();

  @override
  List<Object?> get props => [];
}

/// No track loaded yet.
class PlayerInitial extends PlayerState {
  const PlayerInitial();
}

/// A track is loaded (playing or paused).
class PlayerReady extends PlayerState {
  final Track currentTrack;
  final bool isPlaying;
  final Duration position;
  final List<Track> queue;
  final int currentIndex;
  final bool isShuffle;
  final bool isRepeat;

  const PlayerReady({
    required this.currentTrack,
    required this.isPlaying,
    this.position = Duration.zero,
    required this.queue,
    required this.currentIndex,
    this.isShuffle = false,
    this.isRepeat = false,
  });

  Duration get duration => currentTrack.duration;

  double get progress {
    if (duration.inSeconds == 0) return 0;
    return position.inSeconds / duration.inSeconds;
  }

  PlayerReady copyWith({
    Track? currentTrack,
    bool? isPlaying,
    Duration? position,
    List<Track>? queue,
    int? currentIndex,
    bool? isShuffle,
    bool? isRepeat,
  }) {
    return PlayerReady(
      currentTrack: currentTrack ?? this.currentTrack,
      isPlaying: isPlaying ?? this.isPlaying,
      position: position ?? this.position,
      queue: queue ?? this.queue,
      currentIndex: currentIndex ?? this.currentIndex,
      isShuffle: isShuffle ?? this.isShuffle,
      isRepeat: isRepeat ?? this.isRepeat,
    );
  }

  @override
  List<Object?> get props => [
    currentTrack.id,
    isPlaying,
    position,
    currentIndex,
    isShuffle,
    isRepeat,
  ];
}
