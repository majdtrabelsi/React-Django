import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../utils/dio_client.dart';

class CompanyOffersScreen extends StatefulWidget {
  const CompanyOffersScreen({super.key});

  @override
  State<CompanyOffersScreen> createState() => _CompanyOffersScreenState();
}

class _CompanyOffersScreenState extends State<CompanyOffersScreen> {
  final Dio dio = DioClient.dio;
  List<dynamic> offers = [];
  bool isLoading = true;
  String? error;

  final _formKey = GlobalKey<FormState>();
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descController = TextEditingController();
  final TextEditingController _priceController = TextEditingController();
  final TextEditingController _hourController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchOffers();
  }

  Future<void> fetchOffers() async {
    setState(() {
      isLoading = true;
    });

    try {
      final res = await dio.get('/api/accounts/accountstatus/');
      final userName = res.data['user'];

      final offersRes = await dio.get(
        '/api/accounts/api/offers/',
        queryParameters: {'user_name': userName},
      );

      setState(() {
        offers = offersRes.data;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        error = "Failed to load offers.";
        isLoading = false;
      });
    }
  }

  Future<void> createOffer(String title, String description, String price, String hours) async {
    try {
      final csrfRes = await dio.get('/api/accounts/csrf/');
      final csrfToken = csrfRes.data['csrfToken'];

      // Get the logged-in username
      final userRes = await dio.get('/api/accounts/accountstatus/');
      final userName = userRes.data['user'];

      await dio.post(
        '/api/accounts/api/offers/',
        data: {
          'title': title,
          'description': description,
          'user_name': userName,
        },
        options: Options(headers: {'X-CSRFToken': csrfToken}),
      );

      Navigator.pop(context);
      fetchOffers();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("❌ Failed to create offer.")),
      );
    }
  }

  void openOfferForm() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom + 20,
          left: 20,
          right: 20,
          top: 20,
        ),
        child: Form(
          key: _formKey,
          child: Wrap(
            runSpacing: 12,
            children: [
              const Text(
                "Create New Offer",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: 'Title'),
                validator: (value) =>
                    value == null || value.isEmpty ? 'Title required' : null,
              ),
              TextFormField(
                controller: _descController,
                decoration: const InputDecoration(labelText: 'Description'),
                validator: (value) =>
                    value == null || value.isEmpty ? 'Description required' : null,
              ),
              TextFormField(
                controller: _priceController,
                decoration: const InputDecoration(labelText: 'Price'),
                validator: (value) =>
                    value == null || value.isEmpty ? 'Price required' : null,
              ),
              TextFormField(
                controller: _hourController,
                decoration: const InputDecoration(labelText: 'Hours'),
                validator: (value) =>
                    value == null || value.isEmpty ? 'Hours required' : null,
              ),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    createOffer(
                      _titleController.text,
                      _descController.text,
                      _priceController.text,
                      _hourController.text,
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                ),
                child: const Text("Submit"),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> deleteOffer(int offerId) async {
    try {
      final csrfRes = await dio.get('/api/accounts/csrf/');
      final csrfToken = csrfRes.data['csrfToken'];

      await dio.delete(
        '/api/accounts/api/offers/$offerId/',
        options: Options(headers: {'X-CSRFToken': csrfToken}),
      );

      setState(() {
        offers.removeWhere((offer) => offer['id'] == offerId);
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("❌ Error deleting offer.")),
      );
    }
  }

  void goToNotification(int offerId) {
    Navigator.pushNamed(
      context,
      '/notifications-company',
      arguments: {'offerId': offerId},
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Company Offers"),
        backgroundColor: Colors.green,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(child: Text(error!))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: offers.length,
                  itemBuilder: (context, index) {
                    final offer = offers[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 3,
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(12),
                        title: Text(
                          offer['title'] ?? 'No title',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle:
                            Text(offer['description'] ?? 'No description'),
                        trailing: PopupMenuButton<String>(
                          onSelected: (value) {
                            if (value == 'delete') {
                              deleteOffer(offer['id']);
                            } else if (value == 'notifications') {
                              goToNotification(offer['id']);
                            }
                          },
                          itemBuilder: (context) => [
                            const PopupMenuItem(
                              value: 'notifications',
                              child: Text('View Requests'),
                            ),
                            const PopupMenuItem(
                              value: 'delete',
                              child: Text('Delete'),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: openOfferForm,
        backgroundColor: Colors.green,
        child: const Icon(Icons.add),
        tooltip: 'Create Offer',
      ),
    );
  }
}