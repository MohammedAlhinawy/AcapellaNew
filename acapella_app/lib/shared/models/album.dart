import 'package:flutter/material.dart';

class Album {
  final String id;
  final String title;
  final String choirName;
  final String coverUrl;
  final int year;
  final int trackCount;
  final bool isPremium;
  final Color accentColor;
  final String genre;

  const Album({
    required this.id,
    required this.title,
    required this.choirName,
    required this.coverUrl,
    required this.year,
    required this.trackCount,
    this.isPremium = false,
    this.accentColor = const Color(0xFFC8A96E),
    this.genre = 'Kwaya',
  });
}
