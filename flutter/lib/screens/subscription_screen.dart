import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../utils/dio_client.dart';

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  late Dio dio;
  bool isLoading = true;
  Map<String, dynamic>? subscriptionInfo;
  String? csrfToken;
  String? message;
  String? error;

  @override
  void initState() {
    super.initState();
    dio = DioClient.dio;
    _init();
  }

  Future<void> _init() async {
    await _loadCSRF();
    await fetchSubscriptionInfo();
  }

  Future<void> _loadCSRF() async {
    try {
      final res = await dio.get('/api/accounts/csrf/');
      csrfToken = res.data['csrfToken'];
    } catch (_) {
      error = 'Failed to load CSRF token.';
    }
  }

  Future<void> fetchSubscriptionInfo() async {
    setState(() => isLoading = true);

    try {
      final res = await dio.get('/api/accounts/subscription/status/');
      setState(() {
        subscriptionInfo = res.data;
        isLoading = false;
      });

      // Auto downgrade logic
      final now = DateTime.now();
      final renewalDate = DateTime.tryParse(subscriptionInfo?['renewal_date'] ?? '') ?? now;
      final isFree = (subscriptionInfo?['plan'] ?? '').toLowerCase() == 'free';

      if (subscriptionInfo?['status'] == 'active' &&
          renewalDate.isBefore(now) &&
          !(subscriptionInfo?['auto_renewal'] ?? false) &&
          !isFree) {
        await dio.post('/api/accounts/force-downgrade/');
        await fetchSubscriptionInfo();
      }
    } catch (e) {
      setState(() {
        error = 'Error loading subscription info.';
        isLoading = false;
      });
    }
  }

  Future<void> handleCancelSubscription() async {
    try {
      final res = await dio.post('/api/accounts/cancel-subscription/',
          options: Options(headers: {'X-CSRFToken': csrfToken}));

      final data = res.data;
      if (res.statusCode == 200) {
        setState(() {
          subscriptionInfo?['cancel_at_period_end'] = true;
          message = data['detail'] ?? 'Subscription cancelled.';
        });
      } else {
        message = data['detail'] ?? 'Failed to cancel subscription.';
      }
    } catch (_) {
      message = 'Error cancelling subscription.';
    }
  }

  Future<void> handleToggleAutoRenew() async {
    try {
      final cardRes = await dio.get('/api/accounts/billing/status/');
      if (!(cardRes.data['has_credit_card'] ?? false)) {
        setState(() => message = '⚠️ Add a credit card before enabling auto-renew.');
        return;
      }

      final res = await dio.post(
        '/api/accounts/subscription/toggle-auto-renew/',
        options: Options(headers: {'X-CSRFToken': csrfToken}),
      );

      final data = res.data;
      if (res.statusCode == 200) {
        setState(() {
          subscriptionInfo?['auto_renewal'] = data['auto_renewal'];
          subscriptionInfo?['cancel_at_period_end'] = !data['auto_renewal'];
          message = data['message'] ?? 'Auto-renewal updated.';
        });
      } else {
        setState(() => message = data['error'] ?? 'Failed to toggle auto-renew.');
      }
    } catch (_) {
      setState(() => message = 'Error toggling auto-renew.');
    }
  }

  @override
  Widget build(BuildContext context) {
    final isFree = (subscriptionInfo?['plan'] ?? '').toLowerCase() == 'free';

    return Scaffold(
      appBar: AppBar(title: const Text('Subscription Management')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : error != null
                ? Center(child: Text(error!))
                : subscriptionInfo == null
                    ? const Center(child: Text('No subscription info found.'))
                    : Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Card(
                            elevation: 4,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            child: ListTile(
                              leading: const Icon(Icons.subscriptions),
                              title: Text('Plan: ${subscriptionInfo!['plan'] ?? 'N/A'}'),
                              subtitle: Text('Renewal: ${subscriptionInfo!['renewal_date'] ?? 'N/A'}'),
                            ),
                          ),
                          const SizedBox(height: 20),
                          if (!isFree && subscriptionInfo?['cancel_at_period_end'] == true) ...[
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.orange.shade100,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '⏳ Subscription will cancel at period end (${subscriptionInfo?['renewal_date']}).',
                                style: const TextStyle(fontWeight: FontWeight.w500),
                              ),
                            ),
                            const SizedBox(height: 10),
                            const Text(
                              '🚨 You will lose access to premium features after this date unless you renew.',
                              style: TextStyle(color: Colors.redAccent),
                            ),
                          ]
                          else if (!isFree) ...[
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: subscriptionInfo?['auto_renewal'] == true
                                    ? Colors.green.shade100
                                    : Colors.yellow.shade100,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                subscriptionInfo?['auto_renewal'] == true
                                    ? '🌟 Auto-renew is enabled.'
                                    : '⚠️ Auto-renew is disabled. Enable it for uninterrupted access.',
                              ),
                            ),
                          ],
                          const SizedBox(height: 20),
                          Row(
                            children: [
                              if (!isFree && subscriptionInfo?['cancel_at_period_end'] == false) ...[
                                ElevatedButton(
                                  onPressed: handleToggleAutoRenew,
                                  child: Text(subscriptionInfo?['auto_renewal'] == true
                                      ? 'Disable Auto-Renew'
                                      : 'Enable Auto-Renew'),
                                ),
                                const SizedBox(width: 10),
                                ElevatedButton(
                                  onPressed: handleCancelSubscription,
                                  style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
                                  child: const Text('Cancel Subscription'),
                                ),
                              ]
                            ],
                          ),
                          if (message != null) ...[
                            const SizedBox(height: 20),
                            Text(message!, style: const TextStyle(color: Colors.blue)),
                          ]
                        ],
                      ),
      ),
    );
  }
}