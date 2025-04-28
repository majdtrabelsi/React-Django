import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'home_personal_screen.dart';
import 'home_pro_screen.dart';
import 'home_company_screen.dart';
import '../utils/fade_transition.dart';

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

  final Dio dio = Dio(BaseOptions(
    baseUrl: 'http://172.20.10.2:8000', // <<< CHANGE YOUR SERVER IP!!
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
    headers: {'Content-Type': 'application/json'},
  ));

  late CookieJar cookieJar;

  @override
  void initState() {
    super.initState();
    cookieJar = CookieJar();
    dio.interceptors.add(CookieManager(cookieJar));
  }

  Future<void> _login() async {
  setState(() {
    _loading = true;
    _error = null;
  });

  try {
    // 1. LOGIN
    final response = await dio.post(
      '/api/accounts/login/',
      data: {
        'email': _emailController.text,
        'password': _passwordController.text,
      },
    );

    if (response.statusCode == 200) {
      // 2. FETCH CSRF
      final csrfResponse = await dio.get('/api/accounts/csrf/');
      final csrfToken = csrfResponse.data['csrfToken'];

      // 3. FETCH ACCOUNT STATUS
      final statusResponse = await dio.get(
        '/api/accounts/accountstatus/',
        options: Options(
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
        ),
      );

      if (statusResponse.statusCode == 200) {
        final statusData = statusResponse.data;
        final bool isAuthenticated = statusData['isAuthenticated'];
        final String? accountType = statusData['userType'];

        if (isAuthenticated && accountType != null) {
          if (accountType == 'personal') {
            Navigator.pushReplacement(
              context,
              FadeRoute(page: const HomePersonalScreen(firstName: 'User')),
            );
          } else if (accountType == 'professional') {
            Navigator.pushReplacement(
              context,
              FadeRoute(page: HomeProScreen(firstName: 'User')),
            );
          } else if (accountType == 'company') {
            Navigator.pushReplacement(
              context,
              FadeRoute(page: HomeCompanyScreen(firstName: 'User')),
            );
          } else {
            setState(() {
              _error = 'Unknown account type received.';
            });
          }
        } else {
          setState(() {
            _error = 'Login succeeded but session invalid. Try again.';
          });
        }
      } else {
        setState(() {
          _error = 'Could not verify account status.';
        });
      }
    } else {
      setState(() {
        _error = 'Incorrect email or password.';
      });
    }
  } on DioException catch (e) {
    if (e.response != null) {
      // ❗ Specific handling for 400/401 errors
      if (e.response?.statusCode == 400) {
        setState(() {
          _error = 'Wrong email or password. Please retry.';
        });
      } else if (e.response?.statusCode == 401) {
        setState(() {
          _error = 'Unauthorized. Please login again.';
        });
      } else {
        setState(() {
          _error = 'Server error: ${e.response?.statusCode}';
        });
      }
    } else {
      setState(() {
        _error = 'Network error. Please check your connection.';
      });
    }
  } catch (e) {
    setState(() {
      _error = 'Unexpected error. Try again.';
    });
    print('Login Error: $e');
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