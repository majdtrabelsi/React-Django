import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../utils/fade_transition.dart';
import 'home_personal_screen.dart';
import 'home_pro_screen.dart';
import 'home_company_screen.dart';
import '../utils/dio_client.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _loading = false;
  String? _error;

  late Dio dio;

  @override
  void initState() {
    super.initState();
    dio = DioClient.dio;
    _redirectIfAuthenticated(); // ✅ check login status on screen load
  }

  Future<void> _redirectIfAuthenticated() async {
    try {
      final response = await dio.get('/api/accounts/accountstatus/');
      final data = response.data;

      if (data['isAuthenticated'] == true) {
        final accountType = data['userType'];
        Widget target;

        if (accountType == 'personal') {
          target = const HomePersonalScreen(firstName: 'User');
        } else if (accountType == 'professional') {
          target = const HomeProScreen(firstName: 'User');
        } else {
          target = const HomeCompanyScreen(firstName: 'User');
        }

        WidgetsBinding.instance.addPostFrameCallback((_) {
          Navigator.pushReplacement(context, FadeRoute(page: target));
        });
      }
    } catch (_) {
      // Not logged in or error — stay on login screen
    }
  }

  Future<void> _login() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      // 1. Get CSRF token
      final csrfResponse = await dio.get('/api/accounts/csrf/');
      final csrfToken = csrfResponse.data['csrfToken'];

      // 2. Send login request
      final loginResponse = await dio.post(
        '/api/accounts/login/',
        data: {
          'email': _emailController.text.trim(),
          'password': _passwordController.text.trim(),
        },
        options: Options(headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        }),
      );

      // 3. Verify authentication
      final statusResponse = await dio.get('/api/accounts/accountstatus/');
      final data = statusResponse.data;

      if (data['isAuthenticated'] == true) {
        final accountType = data['userType'];

        if (accountType == 'personal') {
          Navigator.pushReplacement(context, FadeRoute(page: const HomePersonalScreen(firstName: 'User')));
        } else if (accountType == 'professional') {
          Navigator.pushReplacement(context, FadeRoute(page: HomeProScreen(firstName: 'User')));
        } else if (accountType == 'company') {
          Navigator.pushReplacement(context, FadeRoute(page: HomeCompanyScreen(firstName: 'User')));
        } else {
          setState(() {
            _error = 'Unknown account type.';
          });
        }
      } else {
        setState(() {
          _error = 'Login succeeded but user not authenticated.';
        });
      }
    } on DioException catch (e) {
      if (e.response != null) {
        if (e.response?.statusCode == 400) {
          _error = 'Wrong email or password.';
        } else if (e.response?.statusCode == 403) {
          _error = 'Forbidden. CSRF missing.';
        } else {
          _error = 'Server error: ${e.response?.statusCode}';
        }
      } else {
        _error = 'Network error.';
      }
      setState(() {});
    } catch (e) {
      setState(() {
        _error = 'Unexpected error.';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Password'),
            ),
            const SizedBox(height: 30),
            _loading
                ? const CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _login,
                    child: const Text('Login'),
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