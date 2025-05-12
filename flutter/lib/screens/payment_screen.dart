import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:dio/dio.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../utils/dio_client.dart';

class PaymentScreen extends StatefulWidget {
  final String selectedPlan;

  const PaymentScreen({super.key, required this.selectedPlan});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  late Dio dio;
  String? error;
  bool loading = false;

  @override
  void initState() {
    super.initState();
    dio = DioClient.dio;
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    try {
      final res = await dio.get('/api/accounts/accountstatus/');
      final isAuthenticated = res.data['isAuthenticated'];
      if (!isAuthenticated) {
        Navigator.pushReplacementNamed(context, '/login');
      }
    } catch (_) {}
  }

  Future<void> _handlePayment() async {
    setState(() {
      loading = true;
      error = null;
    });

    try {
      final res = await dio.get('/api/accounts/accountstatus/');
      final acctype = (res.data['userType'] ?? '').toString().toLowerCase();

      final csrfRes = await dio.get('/api/accounts/csrf/');
      final csrfToken = csrfRes.data['csrfToken'];

      final plan = acctype == 'company' ? 'company' : 'professional';

      final sessionRes = await dio.post(
        '/api/accounts/payment/',
        data: {'plan': plan},
        options: Options(headers: {'X-CSRFToken': csrfToken}),
      );

      final url = sessionRes.data['url'];
      if (url != null && await canLaunchUrl(Uri.parse(url))) {
        await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
      } else {
        setState(() => error = 'Could not open payment link.');
      }
    } catch (e) {
      setState(() => error = 'Something went wrong.');
    } finally {
      setState(() => loading = false);
    }
  }

  void _showComingSoon(String method) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('$method payment coming soon!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Complete Your Payment')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Center(
          child: Card(
            elevation: 5,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Selected Plan: ${widget.selectedPlan.toUpperCase()}',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 30),
                  ElevatedButton.icon(
                    onPressed: loading ? null : _handlePayment,
                    icon: const Icon(Icons.credit_card),
                    label: const Text('Pay with Card (Stripe)'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo,
                      minimumSize: const Size.fromHeight(45),
                    ),
                  ),
                  const SizedBox(height: 15),
                  ElevatedButton.icon(
                    onPressed: () => _showComingSoon('PayPal'),
                    icon: const Icon(FontAwesomeIcons.paypal),
                    label: const Text('Pay with PayPal'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blueAccent,
                      minimumSize: const Size.fromHeight(45),
                    ),
                  ),
                  const SizedBox(height: 15),
                  ElevatedButton.icon(
                    onPressed: () => _showComingSoon('Crypto'),
                    icon: const Icon(FontAwesomeIcons.bitcoin),
                    label: const Text('Pay with Crypto'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      minimumSize: const Size.fromHeight(45),
                    ),
                  ),
                  if (loading)
                    const Padding(
                      padding: EdgeInsets.only(top: 20),
                      child: CircularProgressIndicator(),
                    ),
                  if (error != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 20),
                      child: Text(
                        error!,
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
