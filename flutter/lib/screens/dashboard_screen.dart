import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

import 'change_password_screen.dart';
import 'support_contact_screen.dart';
import 'billing_screen.dart';
import 'subscription_screen.dart';
import 'login_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late Dio dio;
  late PersistCookieJar cookieJar;

  String firstName = '';
  String email = '';
  String accountType = '';
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _setupDio();
  }

  Future<void> _setupDio() async {
    final Directory appDocDir = await getApplicationDocumentsDirectory();
    cookieJar = PersistCookieJar(storage: FileStorage('${appDocDir.path}/.cookies/'));

    dio = Dio(BaseOptions(
      baseUrl: 'http://172.20.10.2:8000', // ⚡ Your backend IP
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {'Content-Type': 'application/json'},
    ));

    dio.interceptors.add(CookieManager(cookieJar));
    fetchAccountData();
  }

  Future<void> fetchAccountData() async {
    try {
      await dio.get('/api/accounts/csrf/');

      final response = await dio.get(
        '/api/accounts/accountdatas/',
        options: Options(
          extra: {'withCredentials': true},
        ),
      );

      if (response.statusCode == 200) {
        setState(() {
          firstName = response.data['first_name'] ?? '';
          email = response.data['username'] ?? '';
          accountType = response.data['account_type'] ?? '';
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch account data.';
          loading = false;
        });
      }
    } catch (e) {
      print('Error fetching account data: $e');
      setState(() {
        error = 'Error fetching account data.';
        loading = false;
      });
    }
  }

  Future<void> _logout() async {
    try {
      await dio.post('/api/accounts/logout/');
    } catch (e) {
      print('Logout error: $e');
    }

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (error != null) {
      return Scaffold(
        body: Center(
          child: Text(error!, style: const TextStyle(color: Colors.red)),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            _buildProfileCard(),
            const SizedBox(height: 30),
            _buildDashboardOptions(),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileCard() {
    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            const CircleAvatar(
              radius: 30,
              backgroundImage: AssetImage('assets/profile_placeholder.png'),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('👋 Welcome, $firstName', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(email, style: const TextStyle(color: Colors.grey)),
                  const SizedBox(height: 2),
                  Text(accountType.toUpperCase(), style: const TextStyle(color: Colors.blueAccent)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDashboardOptions() {
    return GridView.count(
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      shrinkWrap: true,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      children: [
        _buildOption(Icons.lock, 'Change Password', () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const ChangePasswordScreen()));
        }),
        _buildOption(Icons.payment, 'Billing', () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const BillingScreen()));
        }),
        _buildOption(Icons.subscriptions, 'Subscription', () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const SubscriptionScreen()));
        }),
        _buildOption(Icons.support_agent, 'Support', () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const ContactScreen()));
        }),
        _buildOption(Icons.logout, 'Logout', _logout),
      ],
    );
  }

  Widget _buildOption(IconData icon, String title, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 40, color: Colors.blueAccent),
              const SizedBox(height: 10),
              Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
            ],
          ),
        ),
      ),
    );
  }
}
