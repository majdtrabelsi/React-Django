import 'package:flutter/material.dart';
import '../widgets/custom_button.dart';
import 'package:url_launcher/url_launcher.dart';
import '../widgets/error_dialog.dart';

class PaymentScreen extends StatelessWidget {
  const PaymentScreen({super.key});

  void _launchPayment(BuildContext context, String method) async {
    final String url = "https://example.com/pay-$method"; // Replace with your Django payment session URL
    try {
      if (!await launchUrl(Uri.parse(url))) {
        showErrorDialog(context, "Could not open payment link.");
      }
    } catch (e) {
      showErrorDialog(context, "Payment error. Try again later.");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Payment")),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("Select Payment Method", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 30),
            CustomButton(text: 'Pay with Card (Stripe)', onPressed: () => _launchPayment(context, 'stripe')),
            const SizedBox(height: 20),
            CustomButton(text: 'Pay with PayPal', onPressed: () => _launchPayment(context, 'paypal')),
            const SizedBox(height: 20),
            CustomButton(text: 'Pay with Crypto', onPressed: () => _launchPayment(context, 'crypto')),
          ],
        ),
      ),
    );
  }
}
