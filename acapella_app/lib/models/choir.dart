import 'album.dart';
import 'track.dart';
import 'user.dart';

class Choir {
  final int id;
  final String name;
  final String location;
  final String? bio;
  final String? imagePath;
  final bool isVerified;
  final int? userId;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  // Aggregate / Relationships
  final int? albumsCount;
  final int? tracksCount;
  final User? user;
  final List<Album>? albums;
  final List<Track>? tracks;

  Choir({
    required this.id,
    required this.name,
    required this.location,
    this.bio,
    this.imagePath,
    this.isVerified = false,
    this.userId,
    this.createdAt,
    this.updatedAt,
    this.albumsCount,
    this.tracksCount,
    this.user,
    this.albums,
    this.tracks,
  });

  factory Choir.fromJson(Map<String, dynamic> json) {
    return Choir(
      id: json['id'],
      name: json['name'],
      location: json['location'],
      bio: json['bio'],
      imagePath: json['image_path'],
      isVerified: json['is_verified'] == 1 || json['is_verified'] == true,
      userId: json['user_id'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
      albumsCount: json['albums_count'],
      tracksCount: json['tracks_count'],
      user: json['user'] != null ? User.fromJson(json['user']) : null,
      albums: json['albums'] != null 
          ? (json['albums'] as List).map((i) => Album.fromJson(i)).toList() 
          : null,
      tracks: json['tracks'] != null 
          ? (json['tracks'] as List).map((i) => Track.fromJson(i)).toList() 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'location': location,
      'bio': bio,
      'image_path': imagePath,
      'is_verified': isVerified,
      'user_id': userId,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}
