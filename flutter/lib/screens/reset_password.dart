import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../utils/dio_client.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final TextEditingController _emailController = TextEditingController();
  bool _loading = false;
  String? _message;
  String? _error;

  Future<void> _sendResetLink() async {
    setState(() {
      _loading = true;
      _message = null;
      _error = null;
    });

    try {
      final dio = DioClient.dio;

      final res = await dio.post(
        '/api/accounts/password-reset/',
        data: {'email': _emailController.text.trim()},
        options: Options(headers: {'Content-Type': 'application/json'}),
      );

      if (res.statusCode == 200) {
        setState(() {
          _message = '✅ Check your email for the reset link.';
        });
      } else {
        setState(() {
          _error = res.data['error'] ?? 'Unable to send reset link.';
        });
      }
    } on DioException catch (e) {
      setState(() {
        _error = e.response?.data['error'] ?? 'Something went wrong.';
      });
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Forgot Password')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Enter your email to receive a password reset link.'),
            const SizedBox(height: 20),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            const SizedBox(height: 30),
            _loading
                ? const CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _sendResetLink,
                    child: const Text('Send Reset Link'),
                  ),
            if (_message != null) ...[
              const SizedBox(height: 20),
              Text(_message!, style: const TextStyle(color: Colors.green)),
            ],
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