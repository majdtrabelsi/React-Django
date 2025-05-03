import 'package:flutter/material.dart';
import '../utils/dio_client.dart';
import 'login_screen.dart';
import 'home_personal_screen.dart';
import 'home_pro_screen.dart';
import 'home_company_screen.dart';

class SessionCheckerScreen extends StatefulWidget {
  const SessionCheckerScreen({super.key});

  @override
  State<SessionCheckerScreen> createState() => _SessionCheckerScreenState();
}

class _SessionCheckerScreenState extends State<SessionCheckerScreen> {
  @override
  void initState() {
    super.initState();
    checkSession();
  }

  Future<void> checkSession() async {
    try {
      final res = await DioClient.dio.get('/api/accounts/accountstatus/');
      if (res.statusCode == 200 && res.data['isAuthenticated'] == true) {
        final userType = res.data['userType'];
        Widget next;

        if (userType == 'personal') {
          next = const HomePersonalScreen(firstName: 'User');
        } else if (userType == 'professional') {
          next = const HomeProScreen(firstName: 'User');
        } else {
          next = const HomeCompanyScreen(firstName: 'User');
        }

        Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => next));
      } else {
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
      }
    } catch (e) {
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
  }
}