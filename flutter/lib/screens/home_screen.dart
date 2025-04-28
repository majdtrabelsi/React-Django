import '../utils/fade_transition.dart';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import '../screens/login_screen.dart'; 
import '../screens/settings_screen.dart'; 
import '../screens/billing_screen.dart'; 
import '../screens/subscription_screen.dart'; 
import '../screens/change_password_screen.dart'; 

class HomeScreen extends StatefulWidget {
  final String accountType;
  final String firstName;

  const HomeScreen({super.key, required this.accountType, required this.firstName});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final Dio dio = Dio(BaseOptions(
    baseUrl: 'http://your-server-ip:8000', // Change IP
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

  Future<void> _logout() async {
    try {
      await dio.post('/api/accounts/logout/');
    } catch (e) {
      print('Logout error: $e');
    } finally {
      Navigator.pushAndRemoveUntil(
        context,
        FadeRoute(page:const LoginScreen()),
        (route) => false,
      );
    }
  }

  Color _getThemeColor() {
    switch (widget.accountType.toLowerCase()) {
      case 'company':
        return Colors.blue.shade600;
      case 'professional':
        return Colors.red.shade600;
      case 'personal':
      default:
        return Colors.green.shade600;
    }
  }

  void _navigateToPage(Widget page) {
  Navigator.push(
    context,
    FadeRoute(page: page),
  );
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _getThemeColor().withOpacity(0.05),
      appBar: AppBar(
        title: Text('Welcome, ${widget.firstName}'),
        backgroundColor: _getThemeColor(),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          _buildCard(
            title: '⚙️ Account Settings',
            subtitle: 'Manage your profile & preferences',
            onTap: () => _navigateToPage(const SettingsScreen()),
          ),
          const SizedBox(height: 16),
          _buildCard(
            title: '💳 Billing',
            subtitle: 'Manage your payment methods',
            onTap: () => _navigateToPage(const BillingScreen()),
          ),
          const SizedBox(height: 16),
          _buildCard(
            title: '🧾 Subscription',
            subtitle: 'View or update your subscription',
            onTap: () => _navigateToPage(const SubscriptionScreen()),
          ),
          const SizedBox(height: 16),
          _buildCard(
            title: '🔐 Change Password',
            subtitle: 'Update your password securely',
            onTap: () => _navigateToPage(const ChangePasswordScreen()),
          ),
        ],
      ),
    );
  }

  Widget _buildCard({required String title, required String subtitle, required VoidCallback onTap}) {
    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: ListTile(
        tileColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        title: Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 6),
          child: Text(subtitle, style: TextStyle(color: Colors.grey.shade600)),
        ),
        trailing: const Icon(Icons.arrow_forward_ios_rounded),
        onTap: onTap,
      ),
    );
  }
}
