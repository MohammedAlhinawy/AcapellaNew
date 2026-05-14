import 'album.dart';
import 'choir.dart';

class Track {
  final int id;
  final int? albumId;
  final int choirId;
  final String title;
  final String? filePath; // Hidden from non-premium if track is premium!
  final String? coverPath;
  final int durationSec;
  final String? durationLabel; // Accessor from Laravel backend
  final int bitrate;
  final bool isPremium;
  final int? trackNumber;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  // Contextual attributes
  final bool? isLiked;

  // Relationships
  final Album? album;
  final Choir? choir;

  Track({
    required this.id,
    this.albumId,
    required this.choirId,
    required this.title,
    this.filePath,
    this.coverPath,
    this.durationSec = 0,
    this.durationLabel,
    this.bitrate = 128,
    this.isPremium = false,
    this.trackNumber,
    this.createdAt,
    this.updatedAt,
    this.isLiked,
    this.album,
    this.choir,
  });

  factory Track.fromJson(Map<String, dynamic> json) {
    return Track(
      id: json['id'],
      albumId: json['album_id'],
      choirId: json['choir_id'],
      title: json['title'],
      filePath: json['file_path'],
      coverPath: json['cover_path'],
      durationSec: json['duration_sec'] ?? 0,
      durationLabel: json['duration_label'],
      bitrate: json['bitrate'] ?? 128,
      isPremium: json['is_premium'] == 1 || json['is_premium'] == true,
      trackNumber: json['track_number'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
      isLiked: json['is_liked'] == 1 || json['is_liked'] == true,
      album: json['album'] != null ? Album.fromJson(json['album']) : null,
      choir: json['choir'] != null ? Choir.fromJson(json['choir']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'album_id': albumId,
      'choir_id': choirId,
      'title': title,
      'file_path': filePath,
      'cover_path': coverPath,
      'duration_sec': durationSec,
      'bitrate': bitrate,
      'is_premium': isPremium,
      'track_number': trackNumber,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}
