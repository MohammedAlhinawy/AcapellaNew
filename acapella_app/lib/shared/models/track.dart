import 'package:flutter/material.dart';

class Track {
  final String id;
  final String title;
  final String choirName;
  final String albumTitle;
  final String coverUrl;
  final Duration duration;
  final bool isPremium;
  final Color accentColor;
  final String genre;

  const Track({
    required this.id,
    required this.title,
    required this.choirName,
    required this.albumTitle,
    required this.coverUrl,
    required this.duration,
    this.isPremium = false,
    this.accentColor = const Color(0xFF7B5EA7),
    this.genre = 'Kwaya',
  });

  String get durationLabel {
    final m = duration.inMinutes;
    final s = duration.inSeconds % 60;
    return '$m:${s.toString().padLeft(2, '0')}';
  }
}
