import 'package:dio/dio.dart';
import '../models/subscription.dart';
import 'api_client.dart';

class SubscriptionService {
  final Dio _dio = ApiClient().dio;

  Future<Subscription> initiate() async {
    final response = await _dio.post('/subscriptions/initiate');
    if (response.statusCode == 201) {
      return Subscription.fromJson(response.data['data']['subscription']);
    }
    throw Exception('Failed to initiate subscription.');
  }

  Future<Subscription?> getStatus() async {
    final response = await _dio.get('/subscriptions/status');
    if (response.statusCode == 200) {
      final data = response.data['data'];
      if (data == null) return null;
      return Subscription.fromJson(data);
    }
    throw Exception('Failed to check subscription status.');
  }
}
