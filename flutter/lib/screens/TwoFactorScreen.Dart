import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../utils/dio_client.dart';
import 'home_company_screen.dart';
import 'home_pro_screen.dart';
import 'home_personal_screen.dart';

class TwoFactorScreen extends StatefulWidget {
  const TwoFactorScreen({super.key});

  @override
  State<TwoFactorScreen> createState() => _TwoFactorScreenState();
}

class _TwoFactorScreenState extends State<TwoFactorScreen> {
  final TextEditingController _otpController = TextEditingController();
  bool _loading = false;
  String? _error;

  Future<void> _verifyOtp() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final dio = DioClient.dio;

      final csrfRes = await dio.get('/api/accounts/csrf/');
      final csrfToken = csrfRes.data['csrfToken'];

      final response = await dio.post(
        '/api/accounts/verify-2fa/',
        data: {'token': _otpController.text},
        options: Options(headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        }),
      );

      final status = await dio.get('/api/accounts/accountstatus/');
      final accountType = status.data['userType'];

      Widget target;
      if (accountType == 'personal') {
        target = const HomePersonalScreen(firstName: 'User');
      } else if (accountType == 'professional') {
        target = const HomeProScreen(firstName: 'User');
      } else {
        target = const HomeCompanyScreen(firstName: 'User');
      }

      Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => target));
    } on DioException catch (e) {
      setState(() {
        _error = e.response?.data['error'] ?? 'Invalid 2FA code.';
      });
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Enter 2FA Code')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _otpController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: '2FA Code'),
            ),
            const SizedBox(height: 30),
            _loading
                ? const CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _verifyOtp,
                    child: const Text('Verify'),
                  ),
            if (_error != null) ...[
              const SizedBox(height: 20),
              Text(_error!, style: const TextStyle(color: Colors.red)),
            ],
          ],
        ),
      ),
    );
  }
}