import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../utils/dio_client.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final Dio dio = DioClient.dio;
  List<dynamic> notifications = [];
  bool isLoading = true;
  String? userName;

  @override
  void initState() {
    super.initState();
    fetchNotifications();
  }

  Future<void> fetchNotifications() async {
    try {
      final userRes = await dio.get('/api/accounts/accountstatus/');
      if (!userRes.data['isAuthenticated']) {
        Navigator.pushReplacementNamed(context, '/login');
        return;
      }

      userName = userRes.data['user'];
      final offerRes = await dio.get('/api/accounts/api/rqoffers/',
          queryParameters: {'name_person': userName});
      setState(() {
        notifications = offerRes.data;
        isLoading = false;
      });
    } catch (_) {
      setState(() => isLoading = false);
    }
  }

  Widget _buildNotificationItem(dynamic item, int index) {
  return Card(
    elevation: 3,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
    child: ListTile(
      leading: CircleAvatar(
        backgroundColor: Colors.blue.shade100,
        child: Text('${index + 1}', style: const TextStyle(color: Colors.blue)),
      ),
      title: Text('${item['name_company']}'),
      subtitle: Text('Status: ${item['rp_offer'] ?? 'pending'}'),
      trailing: item['rp_offer'] == 'accept'
          ? ElevatedButton.icon(
              onPressed: () {
                Navigator.pushNamed(
                  context,
                  '/chat',
                  arguments: {'chatId': item['id']},
                );
              },
              icon: const Icon(Icons.chat),
              label: const Text("Chat"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green.shade600,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
            )
          : null,
    ),
  );
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Notifications")),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : notifications.isEmpty
              ? const Center(child: Text("No requests for now."))
              : ListView.builder(
                  itemCount: notifications.length,
                  itemBuilder: (context, index) =>
                      _buildNotificationItem(notifications[index], index),
                ),
    );
  }
}