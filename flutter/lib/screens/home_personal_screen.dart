import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:path_provider/path_provider.dart';

import '../utils/fade_transition.dart';
import 'dashboard_screen.dart';
import 'billing_screen.dart';
import 'subscription_screen.dart';
import 'login_screen.dart';
import 'support_contact_screen.dart';
import '../services/auth_service.dart';
import 'offer_screen.dart';

class HomePersonalScreen extends StatefulWidget {
  final String firstName;

  const HomePersonalScreen({super.key, required this.firstName});

  @override
  State<HomePersonalScreen> createState() => _HomePersonalScreenState();
}

class _HomePersonalScreenState extends State<HomePersonalScreen> {
  late Dio dio;
  late PersistCookieJar cookieJar;

  String displayName = '';

  @override
  void initState() {
    super.initState();
    _setupDio();
  }

  Future<void> _setupDio() async {
    final dir = await getApplicationDocumentsDirectory();
    cookieJar = PersistCookieJar(storage: FileStorage('${dir.path}/.cookies/'));

    dio = Dio(BaseOptions(
      baseUrl: 'http://172.20.10.2:8000',
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {'Content-Type': 'application/json'},
    ));

    dio.interceptors.add(CookieManager(cookieJar));

    await fetchDisplayName();
  }

  Future<void> fetchDisplayName() async {
    try {
      final res = await dio.get('/api/accounts/profiledata/');
      final name = res.data['name'];

      setState(() {
        displayName = (name != null && name.toString().trim().isNotEmpty)
            ? name
            : widget.firstName;
      });
    } catch (e) {
      setState(() {
        displayName = widget.firstName;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        SystemNavigator.pop();
        return false;
      },
      child: Scaffold(
        backgroundColor: Colors.green.shade50,
        appBar: AppBar(
          backgroundColor: Colors.green,
          title: const Text("Personal Account"),
          automaticallyImplyLeading: false,
          actions: [
            IconButton(
              icon: const Icon(Icons.notifications_none),
              tooltip: 'Notifications',
              onPressed: () {
                Navigator.pushNamed(context, '/notifications');
              },
            ),
          ],
        ),

        body: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "👋 Welcome, $displayName",
                style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 30),
              Expanded(
                child: GridView.count(
                  crossAxisCount: 2,
                  crossAxisSpacing: 20,
                  mainAxisSpacing: 20,
                  children: [
                    _buildCard(context, icon: Icons.settings, label: "Dashboard", onTap: () {
                      Navigator.push(context, FadeRoute(page: const DashboardScreen()))
                          .then((_) => fetchDisplayName());
                    }),
                    _buildCard(context, icon: Icons.payment, label: "Billing", onTap: () {
                      Navigator.push(context, FadeRoute(page: const BillingScreen()));
                    }),
                    _buildCard(context, icon: Icons.subscriptions, label: "Subscription", onTap: () {
                      Navigator.push(context, FadeRoute(page: const SubscriptionScreen()));
                    }),
                    _buildCard(context, icon: Icons.support_agent, label: "Support", onTap: () {
                      Navigator.push(context, FadeRoute(page: const ContactScreen()));
                    }),
                    _buildCard(context, icon: Icons.work_outline, label: "Offers", onTap: () {
                      Navigator.push(context, FadeRoute(page: const OffersScreen()));
                    }),
                    _buildCard(context, icon: Icons.logout, label: "Logout", onTap: () => logoutUser(context)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCard(BuildContext context, {
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        elevation: 6,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 50, color: Colors.green),
              const SizedBox(height: 10),
              Text(label, style: const TextStyle(fontSize: 16)),
            ],
          ),
        ),
      ),
    );
  }
}