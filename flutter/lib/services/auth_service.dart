
import 'dart:convert';
import 'dart:async';
import 'package:http/http.dart' as http;

class AuthService {
  static const String baseUrl = "http://172.20.10.2:8000/";

  // Login user
  static Future<bool> loginUser(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/api/accounts/login/"),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email, 'password': password}),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        return true;
      } else {
        final Map<String, dynamic> responseData = json.decode(response.body);
        String errorMessage = "Login failed.";
        if (responseData.isNotEmpty) {
          errorMessage = responseData.values.first[0];
        }
        throw Exception(errorMessage);
      }
    } on TimeoutException {
      throw Exception('Server timeout. Please try again.');
    } catch (e) {
      throw Exception(e.toString().replaceFirst('Exception: ', ''));
    }
  }

  // Register personal or pro user
  static Future<void> registerUser({
    required String firstname,
    required String lastname,
    required String email,
    required String password,
    required String confirmPassword,
    required String type,
  }) async {
    String endpoint = type == 'personal' ? 'registerper' : 'registerpro';

    try {
      final response = await http.post(
        Uri.parse("$baseUrl/api/accounts/$endpoint/"),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'firstname': firstname,
          'lastname': lastname,
          'email': email,
          'password': password,
          'confirm_password': confirmPassword,
          'type': type,
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Registration success
        return;
      } else {
        final Map<String, dynamic> responseData = json.decode(response.body);
        String errorMessage = "Registration failed.";
        if (responseData.isNotEmpty) {
          errorMessage = responseData.values.first[0];
        }
        throw Exception(errorMessage);
      }
    } on TimeoutException {
      throw Exception('Server timeout. Please try again.');
    } catch (e) {
      throw Exception(e.toString().replaceFirst('Exception: ', ''));
    }
  }

  // Register company user
  static Future<void> registerCompanyUser({
    required String firstname,
    required String lastname,
    required String email,
    required String password,
    required String confirmPassword,
    required String companyname,
  }) async {
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/api/accounts/registercomp/"),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'firstname': firstname,
          'lastname': lastname,
          'email': email,
          'password': password,
          'confirm_password': confirmPassword,
          'companyname': companyname,
          'type': 'company',
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Registration success
        return;
      } else {
        final Map<String, dynamic> responseData = json.decode(response.body);
        String errorMessage = "Registration failed.";
        if (responseData.isNotEmpty) {
          errorMessage = responseData.values.first[0];
        }
        throw Exception(errorMessage);
      }
    } on TimeoutException {
      throw Exception('Server timeout. Please try again.');
    } catch (e) {
      throw Exception(e.toString().replaceFirst('Exception: ', ''));
    }
  }
}
