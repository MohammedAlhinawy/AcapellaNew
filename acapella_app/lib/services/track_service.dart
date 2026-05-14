import 'package:dio/dio.dart';
import '../models/track.dart';
import 'api_client.dart';

class TrackService {
  final Dio _dio = ApiClient().dio;

  Future<List<Track>> getAllTracks({int page = 1, int? albumId}) async {
    final query = {'page': page};
    if (albumId != null) query['album_id'] = albumId;

    final response = await _dio.get('/tracks', queryParameters: query);
    if (response.statusCode == 200) {
      final dataList = response.data['data']['data'] as List;
      return dataList.map((j) => Track.fromJson(j)).toList();
    }
    throw Exception('Failed to load tracks.');
  }

  Future<Track> getTrack(int id) async {
    final response = await _dio.get('/tracks/$id');
    if (response.statusCode == 200) {
      return Track.fromJson(response.data['data']);
    }
    throw Exception('Failed to load track.');
  }

  // Interaction feature
  Future<void> likeTrack(int id) async {
    await _dio.post('/tracks/$id/like');
  }

  Future<void> unlikeTrack(int id) async {
    await _dio.delete('/tracks/$id/like');
  }

  // Manager functions
  Future<Track> createTrack(Map<String, dynamic> data) async {
    final response = await _dio.post('/tracks', data: data);
    if (response.statusCode == 201) {
      return Track.fromJson(response.data['data']);
    }
    throw Exception('Failed to create track.');
  }

  Future<Track> updateTrack(int id, Map<String, dynamic> data) async {
    final response = await _dio.put('/tracks/$id', data: data);
    if (response.statusCode == 200) {
      return Track.fromJson(response.data['data']);
    }
    throw Exception('Failed to update track.');
  }

  Future<void> deleteTrack(int id) async {
    final response = await _dio.delete('/tracks/$id');
    if (response.statusCode != 200) {
      throw Exception('Failed to delete track.');
    }
  }
}
