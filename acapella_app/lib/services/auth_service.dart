import 'package:dio/dio.dart';
import '../models/user.dart';
import 'api_client.dart';

class AuthService {
  final Dio _dio = ApiClient().dio;

  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    required String passwordConfirmation,
    String? role,
  }) async {
    final response = await _dio.post('/auth/register', data: {
      'name': name,
      'email': email,
      'password': password,
      'password_confirmation': passwordConfirmation,
      if (role != null) 'role': role,
    });
    
    if (response.statusCode == 201) {
      final data = response.data['data'];
      ApiClient().setToken(data['token']);
      return {
        'user': User.fromJson(data['user']),
        'token': data['token'],
      };
    }
    throw Exception('Registration failed.');
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });

    if (response.statusCode == 200) {
      final data = response.data['data'];
      ApiClient().setToken(data['token']);
      return {
        'user': User.fromJson(data['user']),
        'token': data['token'],
      };
    }
    throw Exception('Login failed.');
  }

  Future<void> logout() async {
    await _dio.post('/auth/logout');
    ApiClient().clearToken();
  }

  Future<User> getMe() async {
    final response = await _dio.get('/auth/me');
    if (response.statusCode == 200) {
      return User.fromJson(response.data['data']);
    }
    throw Exception('Failed to load profile.');
  }
}
