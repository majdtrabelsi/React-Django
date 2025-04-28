import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../widgets/custom_button.dart';
import '../widgets/error_dialog.dart';

class RegisterCompanyScreen extends StatefulWidget {
  const RegisterCompanyScreen({super.key});

  @override
  State<RegisterCompanyScreen> createState() => _RegisterCompanyScreenState();
}

class _RegisterCompanyScreenState extends State<RegisterCompanyScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _firstnameController = TextEditingController();
  final TextEditingController _lastnameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();
  final TextEditingController _companynameController = TextEditingController();
  bool _loading = false;

  void _register() async {
    if (!_formKey.currentState!.validate()) return;
    if (_passwordController.text != _confirmPasswordController.text) {
      showErrorDialog(context, "Passwords do not match.");
      return;
    }

    setState(() => _loading = true);

    try {
      await AuthService.registerCompanyUser(
        firstname: _firstnameController.text,
        lastname: _lastnameController.text,
        email: _emailController.text,
        password: _passwordController.text,
        confirmPassword: _confirmPasswordController.text,
        companyname: _companynameController.text,
      );

      // ✅ After successful registration, navigate to login
      Navigator.pushReplacementNamed(context, '/login');

    } catch (e) {
      showErrorDialog(context, e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Register - Company")),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                const Text(
                  "Create Company Account",
                  style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 30),
                _buildTextField(_firstnameController, "First Name"),
                const SizedBox(height: 20),
                _buildTextField(_lastnameController, "Last Name"),
                const SizedBox(height: 20),
                _buildTextField(_companynameController, "Company Name"),
                const SizedBox(height: 20),
                _buildTextField(_emailController, "Email"),
                const SizedBox(height: 20),
                _buildPasswordField(_passwordController, "Password"),
                const SizedBox(height: 20),
                _buildPasswordField(_confirmPasswordController, "Confirm Password"),
                const SizedBox(height: 30),
                _loading
                    ? const CircularProgressIndicator()
                    : CustomButton(text: "Register", onPressed: _register),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(labelText: label, border: const OutlineInputBorder()),
      validator: (value) => value == null || value.isEmpty ? 'Please enter your $label' : null,
    );
  }

  Widget _buildPasswordField(TextEditingController controller, String label) {
    return TextFormField(
      controller: controller,
      obscureText: true,
      decoration: InputDecoration(labelText: label, border: const OutlineInputBorder()),
      validator: (value) => value == null || value.isEmpty ? 'Please enter your $label' : null,
    );
  }
}