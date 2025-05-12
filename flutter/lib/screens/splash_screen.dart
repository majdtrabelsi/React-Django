import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../utils/dio_client.dart';
import 'welcome_screen.dart';
import 'SessionCheckerScreen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final Dio dio = DioClient.dio;

  @override
  void initState() {
    super.initState();
    _decideNext();
  }

  Future<void> _decideNext() async {
    await Future.delayed(const Duration(seconds: 2)); // Splash delay

    try {
      final res = await dio.get('/api/accounts/accountstatus/');
      final isAuthenticated = res.data['isAuthenticated'] ?? false;

      Widget target = isAuthenticated
          ? const SessionCheckerScreen()
          : const WelcomeScreen();

      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => target),
        );
      }
    } catch (_) {
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const WelcomeScreen()),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Text(
          '🚀 PFE App',
          style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
