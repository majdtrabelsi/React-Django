import 'package:flutter/material.dart';
import 'package:dio/dio.dart';

class ContactScreen extends StatefulWidget {
  const ContactScreen({super.key});

  @override
  State<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends State<ContactScreen> {
  final _formKey = GlobalKey<FormState>();
  final Dio dio = Dio();
  bool isLoading = false;
  String? successMessage;
  String? errorMessage;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _subjectController = TextEditingController();
  final TextEditingController _messageController = TextEditingController();

  Future<void> _sendContactForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      isLoading = true;
      successMessage = null;
      errorMessage = null;
    });

    try {
      final res = await dio.post(
        'http://172.20.10.2:8000/api/accounts/contact/', // Change IP if needed
        data: {
          'name': _nameController.text,
          'email': _emailController.text,
          'subject': _subjectController.text,
          'message': _messageController.text,
        },
        options: Options(
          headers: {'Content-Type': 'application/json'},
        ),
      );

      if (res.statusCode == 200 || res.statusCode == 201) {
        setState(() {
          successMessage = 'Your message has been received successfully!';
          _nameController.clear();
          _emailController.clear();
          _subjectController.clear();
          _messageController.clear();
        });
      } else {
        setState(() {
          errorMessage = 'There was an error sending your message.';
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'There was an error sending your message.';
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Contact Us')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              const Text(
                'If You Have Any Query, Please Feel Free to Contact Us',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),

              if (successMessage != null)
                Container(
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Colors.green.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(successMessage!, style: const TextStyle(color: Colors.green)),
                ),

              if (errorMessage != null)
                Container(
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Colors.red.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(errorMessage!, style: const TextStyle(color: Colors.red)),
                ),

              _buildTextField(_nameController, 'Your Name'),
              const SizedBox(height: 16),
              _buildTextField(_emailController, 'Your Email', type: TextInputType.emailAddress),
              const SizedBox(height: 16),
              _buildTextField(_subjectController, 'Subject'),
              const SizedBox(height: 16),
              _buildTextField(_messageController, 'Message', maxLines: 5),
              const SizedBox(height: 24),

              ElevatedButton(
                onPressed: isLoading ? null : _sendContactForm,
                child: Text(isLoading ? 'Sending...' : 'Send Message'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String label, {
    TextInputType type = TextInputType.text,
    int maxLines = 1,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: type,
      maxLines: maxLines,
      validator: (value) => value == null || value.isEmpty ? 'Required' : null,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
      ),
    );
  }
}