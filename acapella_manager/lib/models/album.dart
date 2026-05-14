import 'choir.dart';
import 'track.dart';

class Album {
  final int id;
  final int choirId;
  final String title;
  final String? coverPath;
  final int? year;
  final bool isPremium;
  final String? genre;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  // Aggregate / Relationships
  final Choir? choir;
  final int? tracksCount;
  final List<Track>? tracks;

  Album({
    required this.id,
    required this.choirId,
    required this.title,
    this.coverPath,
    this.year,
    this.isPremium = false,
    this.genre,
    this.createdAt,
    this.updatedAt,
    this.choir,
    this.tracksCount,
    this.tracks,
  });

  factory Album.fromJson(Map<String, dynamic> json) {
    return Album(
      id: json['id'],
      choirId: json['choir_id'],
      title: json['title'],
      coverPath: json['cover_path'],
      year: json['year'],
      isPremium: json['is_premium'] == 1 || json['is_premium'] == true,
      genre: json['genre'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
      choir: json['choir'] != null ? Choir.fromJson(json['choir']) : null,
      tracksCount: json['tracks_count'],
      tracks: json['tracks'] != null 
          ? (json['tracks'] as List).map((i) => Track.fromJson(i)).toList() 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'choir_id': choirId,
      'title': title,
      'cover_path': coverPath,
      'year': year,
      'is_premium': isPremium,
      'genre': genre,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}
