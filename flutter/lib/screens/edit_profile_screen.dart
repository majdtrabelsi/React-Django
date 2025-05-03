import 'dart:io';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late Dio dio;
  late PersistCookieJar cookieJar;

  final TextEditingController _nameController = TextEditingController();
  String? profilePhotoUrl;
  File? selectedImage;
  bool loading = true;
  String? error;
  String? success;

  @override
  void initState() {
    super.initState();
    _setupDio();
  }

  Future<void> _setupDio() async {
    final dir = await getApplicationDocumentsDirectory();
    cookieJar = PersistCookieJar(storage: FileStorage('${dir.path}/.cookies/'));
    dio = Dio(BaseOptions(
      baseUrl: 'http://172.20.10.2:8000',
      headers: {'Content-Type': 'application/json'},
    ));
    dio.interceptors.add(CookieManager(cookieJar));
    await fetchProfile();
  }

  Future<void> fetchProfile() async {
    try {
      final res = await dio.get('/api/accounts/profiledata/');
      if (res.statusCode == 200) {
        setState(() {
          _nameController.text = res.data['name'] ?? '';
          profilePhotoUrl = res.data['photo'];
        });
      }
    } catch (e) {
      setState(() => error = 'Failed to load profile');
    } finally {
      setState(() => loading = false);
    }
  }

  Future<void> pickImage() async {
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (picked != null) {
      setState(() {
        selectedImage = File(picked.path);
      });
    }
  }

  Future<void> saveProfile() async {
    setState(() {
      success = null;
      error = null;
    });

    try {
      final csrfRes = await dio.get('/api/accounts/csrf/');
      final csrfToken = csrfRes.data['csrfToken'];

      final formData = FormData.fromMap({
        'name': _nameController.text.trim(),
        if (selectedImage != null)
          'photo': await MultipartFile.fromFile(selectedImage!.path, filename: 'photo.jpg'),
      });

      final res = await dio.post(
        '/api/accounts/profiledata/',
        data: formData,
        options: Options(headers: {'X-CSRFToken': csrfToken}),
      );

      if (res.statusCode == 200) {
        setState(() {
          success = '✅ Profile updated!';
          profilePhotoUrl = res.data['photo'];
          selectedImage = null;
        });
      } else {
        setState(() => error = 'Failed to update profile');
      }
    } catch (e) {
      setState(() => error = 'Error saving profile');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Profile')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundImage: selectedImage != null
                        ? FileImage(selectedImage!)
                        : (profilePhotoUrl != null
                            ? NetworkImage('http://172.20.10.2:8000$profilePhotoUrl') as ImageProvider
                            : const AssetImage('assets/images.jpeg')),
                  ),
                  const SizedBox(height: 20),
                  TextField(
                    controller: _nameController,
                    decoration: const InputDecoration(labelText: 'Display Name'),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton.icon(
                    onPressed: pickImage,
                    icon: const Icon(Icons.photo),
                    label: const Text('Pick Image'),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    onPressed: saveProfile,
                    child: const Text('Save'),
                  ),
                  if (success != null) ...[
                    const SizedBox(height: 10),
                    Text(success!, style: const TextStyle(color: Colors.green)),
                  ],
                  if (error != null) ...[
                    const SizedBox(height: 10),
                    Text(error!, style: const TextStyle(color: Colors.red)),
                  ],
                ],
              ),
            ),
    );
  }
}
