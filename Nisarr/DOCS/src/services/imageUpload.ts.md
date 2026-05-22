# src/services/imageUpload.ts

Documentation for `src/services/imageUpload.ts`.

## Overview
A micro-service exclusively responsible for taking a base image/file and POSTing it directly to `https://api.imgbb.com` to achieve free, permanent image hosting. Bypasses the backend node server entirely, uploading directly from the browser client via `FormData`.

## Dart Implementation

The equivalent logic utilizes the Dart native `http` or `dio` package, combined with the `image_picker` package to get the local image `XFile`.

```dart
// Flutter implementation using http and FormData
import 'package:http/http.dart' as http;

Future<String> uploadImage(File file) async {
  final apiKey = const String.fromEnvironment('VITE_IMGBB_API_KEY');
  final request = http.MultipartRequest(
     'POST', 
     Uri.parse('https://api.imgbb.com/1/upload?key=$apiKey')
  );
  
  request.files.add(
     await http.MultipartFile.fromPath('image', file.path)
  );
  
  final response = await request.send();
  final resBody = await response.stream.bytesToString();
  final data = jsonDecode(resBody);
  
  return data['data']['url'];
}
```
