import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:pfe_app/utils/dio_client.dart';
import 'package:intl/intl.dart';

class ChatScreen extends StatefulWidget {
  final int chatId;

  const ChatScreen({super.key, required this.chatId});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final Dio dio = DioClient.dio;
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  List<dynamic> messages = [];
  bool isTyping = false;
  bool isOtherTyping = false;
  bool chatClosed = false;
  String? csrfToken;
  String? userType;
  int? userId;

  @override
  void initState() {
    super.initState();
    _loadInitialData();
    _startPolling();
  }

  Future<void> _loadInitialData() async {
    await _fetchCsrfToken();
    await _fetchUserStatus();
    await _checkChatStatus();
    await _fetchMessages();
  }

  Future<void> _fetchCsrfToken() async {
    final res = await dio.get('/api/accounts/csrf/');
    csrfToken = res.data['csrfToken'];
  }

  Future<void> _fetchUserStatus() async {
    final res = await dio.get('/api/accounts/accountstatus/');
    userType = res.data['userType'];
    userId = res.data['user_id'];
  }

  Future<void> _checkChatStatus() async {
    try {
      final res = await dio.get('/api/accounts/chat-status/${widget.chatId}/');
      setState(() {
        chatClosed = res.data['chat_closed'] == true;
      });
    } on DioException catch (e) {
      if (e.response?.statusCode == 403) {
        if (mounted) {
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Access denied to this chat.')),
          );
        }
      }
    }
  }

  void _startPolling() {
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 5));
      if (!mounted) return false;
      _fetchMessages();
      return true;
    });
  }

  Future<void> _fetchMessages() async {
    try {
      final res = await dio.get('/api/accounts/chat/${widget.chatId}/');
      setState(() {
        messages = res.data['messages'];
        isOtherTyping = res.data['typing'];
      });
      
    } catch (_) {}
  }

  void _scrollToBottom({bool smooth = true}) {
  WidgetsBinding.instance.addPostFrameCallback((_) {
    if (_scrollController.hasClients) {
      final pos = _scrollController.position.maxScrollExtent + 50;
      if (smooth) {
        _scrollController.animateTo(
          pos,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      } else {
        _scrollController.jumpTo(pos);
      }
    }
  });
}


  Future<void> _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    final newMsg = {
      'text': text,
      'sender': userId,
      'sender_name': 'You',
      'timestamp': DateTime.now().toIso8601String(),
      'is_read': false,
    };

    setState(() {
      messages.add(newMsg);
      _controller.clear();
    });

    _scrollToBottom(smooth: false); // during fetch
    _scrollToBottom(smooth: true);  // during send


    try {
      await dio.post(
        '/api/accounts/chat/${widget.chatId}/send/',
        data: {'text': text},
        options: Options(headers: {'X-CSRFToken': csrfToken}),
      );
    } catch (_) {}
  }

  Future<void> _notifyTyping() async {
    try {
      await dio.post(
        '/api/accounts/chat/${widget.chatId}/typing/',
        options: Options(headers: {'X-CSRFToken': csrfToken}),
      );
    } catch (_) {}
  }

  Future<void> _closeChat() async {
    try {
      await dio.post(
        '/api/accounts/chat/${widget.chatId}/close/',
        options: Options(headers: {'X-CSRFToken': csrfToken}),
      );
      setState(() => chatClosed = true);
    } catch (_) {}
  }

  String _formatTime(String iso) {
    final time = DateTime.parse(iso).toLocal();
    return DateFormat('h:mm a').format(time);
  }

  Widget _buildMessageBubble(Map<String, dynamic> msg, bool isMe) {
    final time = _formatTime(msg['timestamp']);
    final initials = (msg['sender_name'] ?? "U").toString().substring(0, 1).toUpperCase();
    final isRead = msg['is_read'] == true;

    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.symmetric(horizontal: 10),
        child: Row(
          mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            if (!isMe)
              CircleAvatar(radius: 12, child: Text(initials, style: const TextStyle(fontSize: 12))),
            const SizedBox(width: 6),
            Flexible(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isMe ? Colors.green.shade600 : Colors.grey.shade300,
                  borderRadius: BorderRadius.only(
                    topLeft: const Radius.circular(12),
                    topRight: const Radius.circular(12),
                    bottomLeft: Radius.circular(isMe ? 12 : 0),
                    bottomRight: Radius.circular(isMe ? 0 : 12),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      msg['text'],
                      style: TextStyle(
                        color: isMe ? Colors.white : Colors.black87,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          "$time · ${msg['sender_name']}",
                          style: TextStyle(
                            fontSize: 11,
                            color: isMe ? Colors.white70 : Colors.black54,
                          ),
                        ),
                        if (isMe) ...[
                          const SizedBox(width: 6),
                          Icon(
                            isRead ? Icons.done_all : Icons.done,
                            size: 16,
                            color: isRead ? Colors.white70 : Colors.white54,
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('💬 Chat'),
        actions: [
          if (userType == 'company' && !chatClosed)
            IconButton(
              icon: const Icon(Icons.close),
              tooltip: 'Close Chat',
              onPressed: _closeChat,
            ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(vertical: 12),
              itemCount: messages.length,
              itemBuilder: (context, index) {
                final msg = messages[index];
                final isMe = msg['sender'] == userId;
                return _buildMessageBubble(msg, isMe);
              },
            ),
          ),
          if (isOtherTyping)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: Text("✍️ Other person is typing...",
                  style: TextStyle(fontStyle: FontStyle.italic)),
            ),
          const SizedBox(height: 4),
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 20),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    onChanged: (_) => _notifyTyping(),
                    onSubmitted: (_) => _sendMessage(),
                    enabled: !chatClosed,
                    decoration: InputDecoration(
                      hintText:
                          chatClosed ? "Chat is closed" : "Type a message...",
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25),
                        borderSide: const BorderSide(color: Colors.grey),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor:
                      chatClosed ? Colors.grey : Theme.of(context).primaryColor,
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white),
                    onPressed: chatClosed ? null : _sendMessage,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}