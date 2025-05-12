import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../utils/dio_client.dart';

class NotificationCompanyScreen extends StatefulWidget {
  final int offerId;

  const NotificationCompanyScreen({super.key, required this.offerId});

  @override
  State<NotificationCompanyScreen> createState() => _NotificationCompanyScreenState();
}

class _NotificationCompanyScreenState extends State<NotificationCompanyScreen> {
  final Dio dio = DioClient.dio;
  List<dynamic> offers = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchOffers();
  }

  Future<void> fetchOffers() async {
    try {
      final res = await dio.get('/api/accounts/api/rqoffers/',
          queryParameters: {'id_offer': widget.offerId});
      setState(() {
        offers = res.data;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
    }
  }

  Future<void> handleResponse(int offerId, String action) async {
    try {
      final csrfRes = await dio.get('/api/accounts/csrf/');
      final csrfToken = csrfRes.data['csrfToken'];

      await dio.patch(
        '/api/accounts/api/rqoffers/$offerId/',
        data: {'rp_offer': action},
        options: Options(headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        }),
      );

      setState(() {
        offers = offers.map((offer) {
          if (offer['id'] == offerId) {
            return {...offer, 'rp_offer': action};
          }
          return offer;
        }).toList();
      });
    } catch (e) {
      debugPrint("Error updating offer response: $e");
    }
  }

  Widget buildStatus(String? status) {
    if (status == 'accept') {
      return Text('Acceptée', style: const TextStyle(color: Colors.green));
    } else if (status == 'refuse') {
      return Text('Refusée', style: const TextStyle(color: Colors.red));
    } else {
      return Text('En attente', style: TextStyle(color: Colors.grey.shade600));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Request Offers"),
        backgroundColor: Colors.teal.shade700,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16),
              child: offers.isEmpty
                  ? const Center(child: Text('No requests for this offer yet.'))
                  : ListView.separated(
                      separatorBuilder: (_, __) => const Divider(),
                      itemCount: offers.length,
                      itemBuilder: (context, index) {
                        final offer = offers[index];
                        final rpOffer = offer['rp_offer'];

                        return Card(
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          elevation: 4,
                          child: ListTile(
                            contentPadding: const EdgeInsets.all(16),
                            title: Text(offer['name_person'] ?? '-',
                                style: const TextStyle(fontWeight: FontWeight.bold)),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const SizedBox(height: 4),
                                buildStatus(rpOffer),
                              ],
                            ),
                            trailing: rpOffer == 'accept'
                                ? ElevatedButton.icon(
                                    icon: const Icon(Icons.chat_bubble_outline),
                                    label: const Text("Chat"),
                                    onPressed: () {
                                        Navigator.pushNamed(
                                            context,
                                            '/chat',
                                            arguments: {'chatId': offer['id']},
                                        );
                                        },
                                  )
                                : (rpOffer == null || rpOffer.isEmpty)
                                    ? Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          IconButton(
                                            icon: const Icon(Icons.close, color: Colors.red),
                                            onPressed: () => handleResponse(offer['id'], 'refuse'),
                                          ),
                                          IconButton(
                                            icon: const Icon(Icons.check, color: Colors.green),
                                            onPressed: () => handleResponse(offer['id'], 'accept'),
                                          ),
                                        ],
                                      )
                                    : null,
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
