import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

import 'dashboard_screen.dart';

class PaymentSuccessScreen extends StatefulWidget {
  final String sessionId;
  const PaymentSuccessScreen({super.key, required this.sessionId});

  @override
  State<PaymentSuccessScreen> createState() => _PaymentSuccessScreenState();
}

class _PaymentSuccessScreenState extends State<PaymentSuccessScreen> {
  late Dio dio;
  late PersistCookieJar cookieJar;
  bool isLoading = true;
  bool success = false;

  @override
  void initState() {
    super.initState();
    _verifyPayment();
  }

  Future<void> _verifyPayment() async {
    final dir = await getApplicationDocumentsDirectory();
    cookieJar = PersistCookieJar(storage: FileStorage('${dir.path}/.cookies/'));
    dio = Dio(BaseOptions(
      baseUrl: 'http://172.20.10.2:8000',
      headers: {'Content-Type': 'application/json'},
    ));
    dio.interceptors.add(CookieManager(cookieJar));

    try {
      final csrf = await dio.get('/api/accounts/csrf/');
      final token = csrf.data['csrfToken'];

      final res = await dio.get(
        '/api/accounts/payment-success/',
        queryParameters: {'session_id': widget.sessionId},
        options: Options(headers: {'X-CSRFToken': token}),
      );

      if (res.statusCode == 200) {
        setState(() => success = true);
        await Future.delayed(const Duration(seconds: 3));
        if (context.mounted) {
          Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (_) => const DashboardScreen()),
              (route) => false);
        }
      }
    } catch (_) {
      setState(() => success = false);
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Payment Confirmation")),
      body: Center(
        child: isLoading
            ? const CircularProgressIndicator()
            : success
                ? const Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.check_circle, color: Colors.green, size: 80),
                      SizedBox(height: 12),
                      Text("✅ Payment verified. Redirecting..."),
                    ],
                  )
                : const Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.error_outline, color: Colors.red, size: 80),
                      SizedBox(height: 12),
                      Text("❌ Payment could not be verified."),
                    ],
                  ),
      ),
    );
  }
}