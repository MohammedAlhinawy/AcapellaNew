import 'package:dio/dio.dart';
import '../models/choir.dart';
import '../models/user.dart';
import 'api_client.dart';

class AdminService {
  final Dio _dio = ApiClient().dio;

  Future<Map<String, dynamic>> getDashboardStats() async {
    final response = await _dio.get('/admin/dashboard');
    if (response.statusCode == 200) {
      return response.data['data'];
    }
    throw Exception('Failed to load dashboard stats.');
  }

  Future<List<User>> getAllUsers({int page = 1}) async {
    final response = await _dio.get('/admin/users', queryParameters: {'page': page});
    if (response.statusCode == 200) {
      final dataList = response.data['data']['data'] as List;
      return dataList.map((j) => User.fromJson(j)).toList();
    }
    throw Exception('Failed to load users.');
  }

  Future<User> updateUserRole(int userId, String role) async {
    final response = await _dio.post('/admin/users/$userId/role', data: {'role': role});
    if (response.statusCode == 200) {
      return User.fromJson(response.data['data']);
    }
    throw Exception('Failed to update user role.');
  }

  Future<Choir> verifyChoir(int choirId) async {
    final response = await _dio.post('/admin/choirs/$choirId/verify');
    if (response.statusCode == 200) {
      return Choir.fromJson(response.data['data']);
    }
    throw Exception('Failed to verify choir.');
  }

  Future<Choir> unverifyChoir(int choirId) async {
    final response = await _dio.post('/admin/choirs/$choirId/unverify');
    if (response.statusCode == 200) {
      return Choir.fromJson(response.data['data']);
    }
    throw Exception('Failed to unverify choir.');
  }
}
