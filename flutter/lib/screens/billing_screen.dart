import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../utils/dio_client.dart'; // import your shared DioClient

class BillingScreen extends StatefulWidget {
  const BillingScreen({super.key});

  @override
  State<BillingScreen> createState() => _BillingScreenState();
}

class _BillingScreenState extends State<BillingScreen> {
  late Dio dio;
  bool isLoading = true;
  Map<String, dynamic>? billingInfo;
  String? error;

  @override
  void initState() {
    super.initState();
    dio = DioClient.dio; // ✅ Use shared Dio instance
    fetchBillingStatus();
  }

  Future<void> fetchBillingStatus() async {
    setState(() {
      isLoading = true;
    });

    try {
      // ✅ Step 1: Get CSRF token
      final csrfResponse = await dio.get('/api/accounts/csrf/');
      final csrfToken = csrfResponse.data['csrfToken'];

      // ✅ Step 2: Call the protected endpoint with CSRF token in header
      final response = await dio.get(
        '/api/accounts/billing/status/',
        options: Options(headers: {
          'X-CSRFToken': csrfToken,
          'Accept': 'application/json',
        }),
      );

      if (response.statusCode == 200) {
        setState(() {
          billingInfo = response.data;
          isLoading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch billing info.';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Error loading billing info.';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Billing Info')),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(child: Text(error!))
              : billingInfo == null || billingInfo!.isEmpty
                  ? const Center(child: Text('No billing information available.'))
                  : Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          Card(
                            elevation: 6,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            child: ListTile(
                              leading: const Icon(Icons.credit_card),
                              title: Text('Card ending with ****${billingInfo!['card_last4'] ?? '----'}'),
                              subtitle: Text('Expiry: ${billingInfo!['expiry'] ?? '--/--'}'),
                            ),
                          ),
                          const SizedBox(height: 20),
                          ElevatedButton(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Update Card (coming soon!)')),
                              );
                            },
                            child: const Text('Update Card'),
                          ),
                          const SizedBox(height: 10),
                          ElevatedButton(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Delete Card (coming soon!)')),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.redAccent,
                            ),
                            child: const Text('Delete Card'),
                          ),
                        ],
                      ),
                    ),
    );
  }
}