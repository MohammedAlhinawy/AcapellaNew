class Choir {
  final String id;
  final String name;
  final String location;
  final String bio;
  final String imageUrl;
  final int albumCount;
  final int trackCount;
  final bool isVerified;

  const Choir({
    required this.id,
    required this.name,
    required this.location,
    required this.bio,
    required this.imageUrl,
    required this.albumCount,
    required this.trackCount,
    this.isVerified = false,
  });
}
