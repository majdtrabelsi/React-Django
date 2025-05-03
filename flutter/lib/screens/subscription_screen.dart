import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../utils/dio_client.dart'; // ✅ Use shared Dio

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  late Dio dio;

  bool isLoading = true;
  Map<String, dynamic>? subscriptionInfo;
  String? error;

  @override
  void initState() {
    super.initState();
    dio = DioClient.dio; // ✅ Use session-aware Dio
    fetchSubscriptionInfo();
  }

  Future<void> fetchSubscriptionInfo() async {
    setState(() {
      isLoading = true;
    });

    try {
      // ✅ Get CSRF token
      final csrfResponse = await dio.get('/api/accounts/csrf/');
      final csrfToken = csrfResponse.data['csrfToken'];

      // ✅ Authenticated request with CSRF
      final response = await dio.get(
        '/api/accounts/subscription/status/',
        options: Options(
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
        ),
      );

      if (response.statusCode == 200) {
        setState(() {
          subscriptionInfo = response.data;
          isLoading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch subscription info.';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Error loading subscription info.';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Subscription Info'),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(child: Text(error!))
              : subscriptionInfo == null
                  ? const Center(child: Text('No subscription info found.'))
                  : Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          Card(
                            elevation: 6,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16)),
                            child: ListTile(
                              leading: const Icon(Icons.subscriptions),
                              title: Text('Plan: ${subscriptionInfo!['plan'] ?? 'Unknown'}'),
                              subtitle: Text('Renewal Date: ${subscriptionInfo!['renewal_date'] ?? 'N/A'}'),
                            ),
                          ),
                          const SizedBox(height: 20),
                          if ((subscriptionInfo!['plan'] ?? '').toLowerCase() != 'free')
                            ElevatedButton(
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Cancel Subscription (coming soon!)')));
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.redAccent,
                              ),
                              child: const Text('Cancel Subscription'),
                            ),
                        ],
                      ),
                    ),
    );
  }
}