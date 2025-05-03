import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

class DioClient {
  static late Dio dio;
  static late PersistCookieJar cookieJar;

  static Future<void> initialize() async {
    final Directory appDocDir = await getApplicationDocumentsDirectory();

    cookieJar = PersistCookieJar(
      storage: FileStorage('${appDocDir.path}/.cookies/'),
    );

    dio = Dio(BaseOptions(
      baseUrl: 'http://172.20.10.2:8000', // ⚡ Change IP if needed
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    dio.interceptors.add(CookieManager(cookieJar));
  }
}
