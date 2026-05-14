import 'package:dio/dio.dart';
import '../models/choir.dart';
import 'api_client.dart';

class ChoirService {
  final Dio _dio = ApiClient().dio;

  Future<List<Choir>> getAllChoirs({int page = 1}) async {
    final response = await _dio.get('/choirs', queryParameters: {'page': page});
    if (response.statusCode == 200) {
      final dataList = response.data['data']['data'] as List; // Pagination nested data
      return dataList.map((j) => Choir.fromJson(j)).toList();
    }
    throw Exception('Failed to load choirs.');
  }

  Future<Choir> getChoir(int id) async {
    final response = await _dio.get('/choirs/$id');
    if (response.statusCode == 200) {
      return Choir.fromJson(response.data['data']);
    }
    throw Exception('Failed to load choir.');
  }

  // Manager functions
  Future<Choir> createChoir(Map<String, dynamic> data) async {
    final response = await _dio.post('/choirs', data: data);
    if (response.statusCode == 201) {
      return Choir.fromJson(response.data['data']);
    }
    throw Exception('Failed to create choir.');
  }

  Future<Choir> updateChoir(int id, Map<String, dynamic> data) async {
    final response = await _dio.put('/choirs/$id', data: data);
    if (response.statusCode == 200) {
      return Choir.fromJson(response.data['data']);
    }
    throw Exception('Failed to update choir.');
  }

  Future<void> deleteChoir(int id) async {
    final response = await _dio.delete('/choirs/$id');
    if (response.statusCode != 200) {
      throw Exception('Failed to delete choir.');
    }
  }
}
