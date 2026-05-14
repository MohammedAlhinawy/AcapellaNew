import 'package:dio/dio.dart';
import '../models/album.dart';
import 'api_client.dart';

class AlbumService {
  final Dio _dio = ApiClient().dio;

  Future<List<Album>> getAllAlbums({int page = 1, int? choirId}) async {
    final query = {'page': page};
    if (choirId != null) query['choir_id'] = choirId;

    final response = await _dio.get('/albums', queryParameters: query);
    if (response.statusCode == 200) {
      final dataList = response.data['data']['data'] as List;
      return dataList.map((j) => Album.fromJson(j)).toList();
    }
    throw Exception('Failed to load albums.');
  }

  Future<Album> getAlbum(int id) async {
    final response = await _dio.get('/albums/$id');
    if (response.statusCode == 200) {
      return Album.fromJson(response.data['data']);
    }
    throw Exception('Failed to load album.');
  }

  // Manager functions
  Future<Album> createAlbum(Map<String, dynamic> data) async {
    final response = await _dio.post('/albums', data: data);
    if (response.statusCode == 201) {
      return Album.fromJson(response.data['data']);
    }
    throw Exception('Failed to create album.');
  }

  Future<Album> updateAlbum(int id, Map<String, dynamic> data) async {
    final response = await _dio.put('/albums/$id', data: data);
    if (response.statusCode == 200) {
      return Album.fromJson(response.data['data']);
    }
    throw Exception('Failed to update album.');
  }

  Future<void> deleteAlbum(int id) async {
    final response = await _dio.delete('/albums/$id');
    if (response.statusCode != 200) {
      throw Exception('Failed to delete album.');
    }
  }
}
