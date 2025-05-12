import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../utils/dio_client.dart';

class OffersScreen extends StatefulWidget {
  const OffersScreen({super.key});

  @override
  State<OffersScreen> createState() => _OffersScreenState();
}

class _OffersScreenState extends State<OffersScreen> {
  final Dio dio = DioClient.dio;
  List<dynamic> offers = [];
  String? userName;
  String? message;
  bool isLoading = true;
  Set<int> disabledButtons = {};

  @override
  void initState() {
    super.initState();
    fetchUserAndOffers();
  }

  Future<void> fetchUserAndOffers() async {
    try {
      final userRes = await dio.get('/api/accounts/accountstatus/');
      if (userRes.data['isAuthenticated']) {
        userName = userRes.data['user'];
      }

      final offersRes = await dio.get('/api/accounts/api/offers/');
      setState(() {
        offers = offersRes.data;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        message = '⚠️ Failed to load offers.';
        isLoading = false;
      });
    }
  }

  Future<void> handleAddPerson(int offerId, String companyName) async {
    setState(() => disabledButtons.add(offerId));

    try {
      final csrfRes = await dio.get('/api/accounts/csrf/');
      final csrfToken = csrfRes.data['csrfToken'];

      final data = {
        'name_person': userName,
        'name_company': companyName,
        'id_offer': offerId,
        'rp_offer': '',
      };

      await dio.post(
        '/api/accounts/api/rqoffers/',
        data: data,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
        ),
      );

      setState(() => message = '✅ Offer submitted successfully!');
    } catch (e) {
      if (e is DioException &&
          e.response?.statusCode == 400 &&
          e.response?.data['detail']?.toString().contains('unique') == true) {
        setState(() => message = '⚠️ Something went wrong.');
      } else {
        setState(() => message = '⚠️ You have already submitted this offer.');
      }
    } finally {
      Future.delayed(const Duration(seconds: 4), () {
        if (mounted) setState(() => message = null);
      });
      setState(() => disabledButtons.remove(offerId));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Offers")),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  if (message != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: Colors.blue.shade100,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.info_outline, color: Colors.blue),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              message!,
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                  Expanded(
                    child: ListView.separated(
                      itemCount: offers.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final offer = offers[index];
                        final offerId = offer['id'];
                        return Card(
                          elevation: 3,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    const CircleAvatar(
                                      backgroundColor: Colors.blue,
                                      child: Icon(Icons.work, color: Colors.white),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Text(
                                        offer['user_name'] ?? 'Unknown',
                                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                    IconButton(
                                      onPressed: disabledButtons.contains(offerId)
                                          ? null
                                          : () => handleAddPerson(offerId, offer['user_name']),
                                      icon: const Icon(Icons.send),
                                      tooltip: 'Submit Offer',
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  offer['description'] ?? '',
                                  style: const TextStyle(fontSize: 14),
                                  maxLines: 3,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}