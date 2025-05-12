import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:path_provider/path_provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:io';

class BillingScreen extends StatefulWidget {
  const BillingScreen({super.key});

  @override
  State<BillingScreen> createState() => _BillingScreenState();
}

class _BillingScreenState extends State<BillingScreen> with WidgetsBindingObserver {
  late Dio dio;
  late PersistCookieJar cookieJar;

  bool isLoading = true;
  bool showCardForm = false;
  Map<String, dynamic>? cardInfo;
  List<dynamic> billingHistory = [];
  String? csrfToken;

  final cardNumberController = TextEditingController();
  final expiryController = TextEditingController();
  final cvvController = TextEditingController();

  final currentYear = DateTime.now().year % 100;
  final currentMonth = DateTime.now().month;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _setupDio();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _fetchBillingStatus();
      _fetchBillingHistory();
    }
  }

  Future<void> _setupDio() async {
    final dir = await getApplicationDocumentsDirectory();
    cookieJar = PersistCookieJar(storage: FileStorage('${dir.path}/.cookies/'));
    dio = Dio(BaseOptions(
      baseUrl: 'http://172.20.10.4:8000',
      headers: {'Content-Type': 'application/json'},
    ));
    dio.interceptors.add(CookieManager(cookieJar));
    await _loadCSRF();
    await _fetchBillingStatus();
    await _fetchBillingHistory();
  }

  Future<void> _loadCSRF() async {
    final res = await dio.get('/api/accounts/csrf/');
    csrfToken = res.data['csrfToken'];
  }

  Future<void> _fetchBillingStatus() async {
    try {
      final res = await dio.get('/api/accounts/billing/status/');
      setState(() => cardInfo = res.data);
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> _fetchBillingHistory() async {
    try {
      final res = await dio.get('/api/accounts/billing/history/');
      setState(() => billingHistory = res.data);
    } catch (_) {}
  }

  bool isValidLuhn(String number) {
    int sum = 0;
    bool alt = false;
    for (int i = number.length - 1; i >= 0; i--) {
      int n = int.parse(number[i]);
      if (alt) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alt = !alt;
    }
    return sum % 10 == 0;
  }

  String _getCardType(String number) {
    if (number.startsWith('34') || number.startsWith('37')) return 'amex';
    return 'other';
  }

  bool validateFields() {
    final cardNumber = cardNumberController.text.replaceAll(' ', '');
    final expiry = expiryController.text.trim();
    final cvv = cvvController.text.trim();

    if (cardNumber.length < 13 || cardNumber.length > 16 || !isValidLuhn(cardNumber)) {
      showMessage("Invalid card number");
      return false;
    }

    if (!RegExp(r'^(0[1-9]|1[0-2])/\d{2}$').hasMatch(expiry)) {
      showMessage("Invalid expiry format");
      return false;
    }

    final parts = expiry.split('/');
    final int mm = int.parse(parts[0]);
    final int yy = int.parse(parts[1]);
    if (yy < currentYear || (yy == currentYear && mm < currentMonth)) {
      showMessage("Card has expired");
      return false;
    }

    final type = _getCardType(cardNumber);
    final expectedCVV = type == 'amex' ? 4 : 3;
    if (cvv.length != expectedCVV) {
      showMessage("CVV must be $expectedCVV digits for ${type.toUpperCase()}");
      return false;
    }

    return true;
  }

  void showMessage(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<void> _updateCard() async {
    if (!validateFields()) return;

    try {
      final data = {
        'cardNumber': cardNumberController.text.replaceAll(' ', ''),
        'expiry': expiryController.text,
        'cvv': cvvController.text,
      };
      await dio.post('/api/accounts/billing/update/',
          data: data,
          options: Options(headers: {'X-CSRFToken': csrfToken}));
      await _fetchBillingStatus();
      setState(() => showCardForm = false);
      showMessage("✅ Card updated!");
    } catch (_) {
      showMessage("❌ Update failed.");
    }
  }

  Future<void> _deleteCard() async {
    try {
      await dio.post('/api/accounts/billing/delete/',
          options: Options(headers: {'X-CSRFToken': csrfToken}));
      await _fetchBillingStatus();
      showMessage("🗑️ Card deleted.");
    } catch (_) {}
  }

  Widget _buildCardInfo() {
    return Card(
      elevation: 5,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: [Colors.blue.shade300, Colors.blue.shade700]),
          borderRadius: BorderRadius.circular(16),
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("Saved Card", style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                IconButton(
                  onPressed: _deleteCard,
                  icon: const Icon(Icons.delete, color: Colors.white),
                )
              ],
            ),
            const SizedBox(height: 20),
            Text("**** **** **** ${cardInfo?['card_last4'] ?? '----'}",
                style: const TextStyle(color: Colors.white, fontSize: 22, letterSpacing: 2)),
            const SizedBox(height: 10),
            Text("Expiry: ${cardInfo?['expiry'] ?? '--/--'}",
                style: const TextStyle(color: Colors.white70)),
          ],
        ),
      ),
    );
  }

  Widget _buildCardForm() => Column(
        children: [
          TextField(
            controller: cardNumberController,
            decoration: const InputDecoration(labelText: 'Card Number', counterText: ''),
            keyboardType: TextInputType.number,
            maxLength: 19,
            onChanged: (val) {
              final sanitized = val.replaceAll(' ', '');
              final spaced = sanitized.replaceAllMapped(RegExp(r'.{1,4}'), (match) => '${match.group(0)} ').trim();
              if (val != spaced) {
                cardNumberController.value = TextEditingValue(
                  text: spaced,
                  selection: TextSelection.collapsed(offset: spaced.length),
                );
              }
            },
          ),
          const SizedBox(height: 10),
          TextField(
            controller: expiryController,
            decoration: const InputDecoration(labelText: 'Expiry MM/YY', counterText: ''),
            keyboardType: TextInputType.number,
            maxLength: 5,
            onChanged: (val) {
              if (val.length == 2 && !val.contains('/')) {
                expiryController.text = '$val/';
                expiryController.selection = TextSelection.fromPosition(
                  TextPosition(offset: expiryController.text.length),
                );
              }
            },
          ),
          const SizedBox(height: 10),
          TextField(
            controller: cvvController,
            decoration: const InputDecoration(labelText: 'CVV', counterText: ''),
            keyboardType: TextInputType.number,
            maxLength: _getCardType(cardNumberController.text) == 'amex' ? 4 : 3,
            onChanged: (val) {
              final type = _getCardType(cardNumberController.text);
              final maxLen = type == 'amex' ? 4 : 3;
              if (val.length > maxLen) {
                cvvController.text = val.substring(0, maxLen);
                cvvController.selection = TextSelection.fromPosition(
                  TextPosition(offset: cvvController.text.length),
                );
              }
            },
          ),
          const SizedBox(height: 20),
          ElevatedButton(onPressed: _updateCard, child: const Text('Save Card')),
        ],
      );

  Widget _buildBillingHistory() {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("📜 Billing History", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            if (billingHistory.isEmpty)
              const Text("No billing history found."),
            ...billingHistory.map((item) => ListTile(
              leading: const Icon(Icons.receipt, color: Colors.blue),
              title: Text(item['description']),
              subtitle: Text(item['created_at']),
              trailing: item['stripe_invoice_url'] != null
                  ? InkWell(
                      onTap: () async {
                        final url = item['stripe_invoice_url'];
                        if (await canLaunchUrl(Uri.parse(url))) {
                          await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
                        }
                      },
                      child: Text(
                        '\$${item['amount']}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    )
                  : Text('\$${item['amount']}', style: const TextStyle(fontWeight: FontWeight.bold)),
            )),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Billing")),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                child: Column(
                  children: [
                    if (cardInfo != null && cardInfo!['has_credit_card'])
                      _buildCardInfo()
                    else
                      ElevatedButton(
                        onPressed: () => setState(() => showCardForm = !showCardForm),
                        child: const Text('Add Credit Card'),
                      ),
                    if (showCardForm) ...[
                      const SizedBox(height: 20),
                      _buildCardForm()
                    ],
                    const SizedBox(height: 30),
                    _buildBillingHistory(),
                  ],
                ),
              ),
      ),
    );
  }
}
