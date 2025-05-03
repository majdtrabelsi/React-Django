import 'dart:io';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:path_provider/path_provider.dart';
import 'change_password_screen.dart';
import 'edit_profile_screen.dart'; // Import your separate profile editor screen

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late Dio dio;
  late PersistCookieJar cookieJar;

  String firstName = '';
  String lastName = '';
  String email = '';
  String accountType = '';
  String joinDate = '';
  String? profilePhotoUrl;
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
      baseUrl: 'http://172.20.10.2:8000',
      headers: {'Content-Type': 'application/json'},
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ));

    dio.interceptors.add(CookieManager(cookieJar));
    await fetchAccountData();
    await fetchProfilePhoto();
  }

  Future<void> fetchAccountData() async {
    try {
      await dio.get('/api/accounts/csrf/');
      final response = await dio.get('/api/accounts/accountdatas/');

      if (response.statusCode == 200) {
        final data = response.data;
        setState(() {
          firstName = data['first_name'] ?? '';
          lastName = data['last_name'] ?? '';
          email = data['username'] ?? '';
          accountType = data['account_type'] ?? '';
          joinDate = data['date_joined']?.split('T')[0] ?? '';
        });
      }
    } catch (e) {
      setState(() {
        error = 'Error loading account.';
      });
    }
  }

  Future<void> fetchProfilePhoto() async {
    try {
      final res = await dio.get('/api/accounts/profiledata/');
      if (res.statusCode == 200) {
        setState(() {
          profilePhotoUrl = res.data['photo'];
        });
      }
    } catch (e) {
      // silent fail is okay for photo
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (error != null) {
      return Scaffold(body: Center(child: Text(error!, style: TextStyle(color: Colors.red))));
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            _buildProfileCard(),
            const SizedBox(height: 30),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const EditProfileScreen()));
              },
              icon: const Icon(Icons.edit),
              label: const Text('Edit Profile'),
              style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
            ),
            const SizedBox(height: 10),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const ChangePasswordScreen()));
              },
              icon: const Icon(Icons.lock),
              label: const Text('Change Password'),
              style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
            ),
          ],
        ),
      ),
    );
  }
  

  Widget _buildProfileCard() {
    return Card(
      elevation: 6,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            CircleAvatar(
              radius: 40,
              backgroundImage: profilePhotoUrl != null
                  ? NetworkImage('http://172.20.10.2:8000$profilePhotoUrl')
                  : const AssetImage('assets/images.jpeg') as ImageProvider,
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('$firstName $lastName',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 5),
                  Text(email, style: const TextStyle(color: Colors.grey)),
                  const SizedBox(height: 5),
                  Text('Type: ${accountType.toUpperCase()}'),
                  Text('Joined: $joinDate'),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
