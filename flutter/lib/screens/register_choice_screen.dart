import 'package:flutter/material.dart';
import 'register_person_screen.dart';
import 'register_pro_screen.dart';
import 'register_company_screen.dart';
import '../utils/fade_transition.dart';
class RegisterChoiceScreen extends StatelessWidget {
  const RegisterChoiceScreen({super.key});

  void _navigateToRegister(BuildContext context, String accountType) {
  Widget screen;

  if (accountType == 'personal') {
    screen = const RegisterPersonScreen();
  } else if (accountType == 'pro') {
    screen = const RegisterProScreen();
  } else if (accountType == 'company') {
    screen = const RegisterCompanyScreen();
  } else {
    screen = const Scaffold(
      body: Center(child: Text('Invalid account type')),
    );
  }

  Navigator.push(
    context,
    FadeRoute(page: screen),
  );
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Choose Account Type'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            _buildAccountCard(
              context,
              title: 'Personal Account',
              features: [
                'Access basic features',
                'Ideal for individual users',
              ],
              accountType: 'personal',
            ),
            const SizedBox(height: 16),
            _buildAccountCard(
              context,
              title: 'Pro Account',
              features: [
                'All Personal features included',
                'No usage limitations',
                'Private space & customization',
              ],
              accountType: 'pro',
            ),
            const SizedBox(height: 16),
            _buildAccountCard(
              context,
              title: 'Company Account',
              features: [
                'Recruit workers easily',
                'Create communities',
                'Advanced collaboration tools',
              ],
              accountType: 'company',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAccountCard(BuildContext context,
      {required String title, required List<String> features, required String accountType}) {
    return Card(
      elevation: 6,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            ...features.map((feature) => Row(
                  children: [
                    const Icon(Icons.check, size: 18),
                    const SizedBox(width: 8),
                    Expanded(child: Text(feature)),
                  ],
                )),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => _navigateToRegister(context, accountType),
                child: const Text('Register Now'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}