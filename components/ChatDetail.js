import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image as ExpoImage } from 'expo-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { jwtDecode } from 'jwt-decode';

const ChatDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { conversationId, otherUserId, otherUserName, otherUserImage } = route.params || {};
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserImage, setCurrentUserImage] = useState(null);
  const [otherUserPhone, setOtherUserPhone] = useState(null);
  const scrollViewRef = useRef(null);

  const fetchMessages = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
      }

      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const currentOffset = reset ? 0 : offset;
      const response = await fetch(
        `http://18.207.241.126/chat/messages/${otherUserId}?limit=50&offset=${currentOffset}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      
      if (reset) {
        setMessages(data.messages || []);
      } else {
        setMessages(prev => [...(data.messages || []), ...prev]);
      }
      
      setHasMore(data.has_more || false);
      setOffset(currentOffset + (data.messages?.length || 0));
      
      // Mark conversation as read
      if (conversationId) {
        await markConversationAsRead(conversationId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markConversationAsRead = async (convId) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      await fetch(`http://18.207.241.126/chat/conversations/${convId}/mark-all-read`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://18.207.241.126/chat/send', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiver_id: otherUserId,
          content: newMessage.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send message');
      }

      const sentMessage = await response.json();
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      
      // Scroll to bottom after sending
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', error.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (otherUserId) {
      fetchMessages(true);
    }
  }, [otherUserId]);

  useFocusEffect(
    useCallback(() => {
      if (otherUserId && !loading) {
        fetchMessages(true);
      }
    }, [otherUserId])
  );

  const formatMessageTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          // Decode JWT to get user ID
          const decodedToken = jwtDecode(token);
          setCurrentUserId(decodedToken.user_id);
          
          // Fetch current user info to get profile image
          try {
            const response = await fetch('http://18.207.241.126/users/user-info', {
              method: 'GET',
              headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });
            if (response.ok) {
              const userInfo = await response.json();
              if (userInfo.images && userInfo.images.length > 0) {
                const priorityOneImage = userInfo.images.find(img => img.priority === 1);
                setCurrentUserImage(priorityOneImage?.image_url || userInfo.images[0]?.image_url);
              }
            }
          } catch (error) {
            console.error('Error fetching user info:', error);
          }
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
      }
    };
    getCurrentUserInfo();
  }, []);

  if (loading && messages.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4B164C" />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerName}>
            {otherUserName
              ? otherUserName.charAt(0).toUpperCase() + otherUserName.slice(1).toLowerCase()
              : 'Chat'}
          </Text>
          {otherUserPhone && (
            <Text style={styles.headerPhone}>{otherUserPhone}</Text>
          )}
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Icon name="bell-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton}>
            <Icon name="dots-vertical" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => {
          const isMyMessage = currentUserId && message.sender_id === currentUserId;
          
          return (
            <View key={message.id} style={styles.messageWrapper}>
              <View
                style={[
                  styles.messageContainer,
                  isMyMessage ? styles.myMessage : styles.otherMessage,
                ]}
              >
                {!isMyMessage && (
                  <ExpoImage
                    source={otherUserImage ? { uri: otherUserImage } : require('../assets/profileava.jpg')}
                    style={styles.messageProfileImage}
                    contentFit="cover"
                  />
                )}
                <View
                  style={[
                    styles.messageBubble,
                    isMyMessage ? styles.myBubble : styles.otherBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isMyMessage ? styles.myMessageText : styles.otherMessageText,
                    ]}
                  >
                    {message.content}
                  </Text>
                </View>
                {isMyMessage && (
                  <ExpoImage
                    source={currentUserImage ? { uri: currentUserImage } : require('../assets/profileava.jpg')}
                    style={styles.messageProfileImage}
                    contentFit="cover"
                  />
                )}
              </View>
              <View style={[
                styles.messageTimeContainer,
                isMyMessage ? styles.myMessageTimeContainer : styles.otherMessageTimeContainer
              ]}>
                <Text style={styles.messageTimeText}>
                  {formatMessageTime(message.created_at)}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.emojiButton}>
          <Icon name="emoticon-happy-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type message here..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!newMessage.trim() || sending) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Icon name="send" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B164C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    backgroundColor: '#4B164C',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 12,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerPhone: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
    opacity: 0.9,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messagesContent: {
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageProfileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: '#DD88CF',
  },
  otherBubble: {
    backgroundColor: '#8B5A9F',
  },
  messageTimeContainer: {
    marginTop: 4,
    paddingHorizontal: 8,
  },
  myMessageTimeContainer: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  otherMessageTimeContainer: {
    alignItems: 'flex-start',
    marginLeft: 8,
  },
  messageTimeText: {
    fontSize: 11,
    color: '#666666',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  emojiButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DD88CF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatDetail;

