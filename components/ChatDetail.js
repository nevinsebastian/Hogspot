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
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image as ExpoImage } from 'expo-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { jwtDecode } from 'jwt-decode';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ChatDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  const { conversationId, otherUserId, otherUserName, otherUserImage } = route.params || {};
  
  // Calculate responsive dimensions
  const headerPaddingTop = Platform.OS === 'ios' ? 50 : Math.max(insets.top + 8, 20);
  
  // Responsive font sizes
  const headerNameFontSize = width < 375 ? 16 : (width < 414 ? 18 : 18);
  const headerPhoneFontSize = width < 375 ? 11 : (width < 414 ? 12 : 12);
  const messageTextFontSize = width < 375 ? 14 : (width < 414 ? 15 : 15);
  const messageTimeFontSize = width < 375 ? 10 : (width < 414 ? 11 : 11);
  const inputFontSize = width < 375 ? 14 : (width < 414 ? 15 : 15);
  
  // Responsive line heights (proportional to font size)
  const messageTextLineHeight = messageTextFontSize * 1.33;
  
  // Responsive message bubble and profile image sizes
  const messageProfileImageSize = width < 375 ? 32 : (width < 414 ? 36 : 36);
  const messageBubbleMaxWidth = width < 375 ? '75%' : '70%';
  const messageBubblePadding = width < 375 ? 10 : (width < 414 ? 12 : 12);
  const messageWrapperMargin = width < 375 ? 8 : (width < 414 ? 10 : 12);
  
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
  const pollingIntervalRef = useRef(null);
  const lastMessageIdRef = useRef(null);

  const fetchMessages = async (reset = false, checkForNewOnly = false) => {
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
      const newMessages = data.messages || [];
      
      if (checkForNewOnly) {
        // Only add messages that we don't already have
        setMessages(prev => {
          const existingIds = new Set(prev.map(msg => msg.id));
          const newMessagesOnly = newMessages.filter(msg => !existingIds.has(msg.id));
          
          if (newMessagesOnly.length > 0) {
            // Auto-scroll to bottom when new message arrives
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
            // Update last message ID reference
            const lastNewMessage = newMessagesOnly[newMessagesOnly.length - 1];
            if (lastNewMessage && lastNewMessage.id) {
              lastMessageIdRef.current = lastNewMessage.id;
            }
            return [...prev, ...newMessagesOnly];
          }
          return prev;
        });
      } else {
        if (reset) {
          setMessages(newMessages);
          // Update last message ID reference
          if (newMessages.length > 0) {
            lastMessageIdRef.current = newMessages[newMessages.length - 1].id;
          }
        } else {
          setMessages(prev => [...(newMessages), ...prev]);
          // Update last message ID reference for pagination
          if (newMessages.length > 0) {
            lastMessageIdRef.current = newMessages[newMessages.length - 1].id;
          }
        }
      }
      
      setHasMore(data.has_more || false);
      setOffset(currentOffset + (newMessages.length || 0));
      
      // Mark conversation as read
      if (conversationId) {
        await markConversationAsRead(conversationId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (!checkForNewOnly) {
        Alert.alert('Error', 'Failed to load messages. Please try again.');
      }
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
      setMessages(prev => {
        const updated = [...prev, sentMessage];
        // Update last message ID reference
        lastMessageIdRef.current = sentMessage.id;
        return updated;
      });
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
      
      // Start polling for new messages when screen is focused
      if (otherUserId) {
        pollingIntervalRef.current = setInterval(() => {
          fetchMessages(false, true); // Check for new messages only
        }, 2000); // Poll every 2 seconds
        
        return () => {
          // Cleanup: stop polling when screen loses focus
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        };
      }
    }, [otherUserId, loading])
  );

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []);

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
      <View style={[styles.header, { paddingTop: headerPaddingTop }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: headerNameFontSize }]}>Loading...</Text>
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
      <View style={[styles.header, { paddingTop: headerPaddingTop }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerName, { fontSize: headerNameFontSize }]}>
            {otherUserName
              ? otherUserName.charAt(0).toUpperCase() + otherUserName.slice(1).toLowerCase()
              : 'Chat'}
          </Text>
          {otherUserPhone && (
            <Text style={[styles.headerPhone, { fontSize: headerPhoneFontSize }]}>{otherUserPhone}</Text>
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
            <View key={message.id} style={[styles.messageWrapper, { marginBottom: messageWrapperMargin }]}>
              <View
                style={[
                  styles.messageContainer,
                  isMyMessage ? styles.myMessage : styles.otherMessage,
                ]}
              >
                {!isMyMessage && (
                  <ExpoImage
                    source={otherUserImage ? { uri: otherUserImage } : require('../assets/profileava.jpg')}
                    style={[styles.messageProfileImage, { 
                      width: messageProfileImageSize, 
                      height: messageProfileImageSize,
                      borderRadius: messageProfileImageSize / 2,
                    }]}
                    contentFit="cover"
                  />
                )}
                <View
                  style={[
                    styles.messageBubble,
                    isMyMessage ? styles.myBubble : styles.otherBubble,
                    { 
                      maxWidth: messageBubbleMaxWidth,
                      padding: messageBubblePadding,
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isMyMessage ? styles.myMessageText : styles.otherMessageText,
                      { 
                        fontSize: messageTextFontSize,
                        lineHeight: messageTextLineHeight,
                      }
                    ]}
                  >
                    {message.content}
                  </Text>
                </View>
                {isMyMessage && (
                  <ExpoImage
                    source={currentUserImage ? { uri: currentUserImage } : require('../assets/profileava.jpg')}
                    style={[styles.messageProfileImage, { 
                      width: messageProfileImageSize, 
                      height: messageProfileImageSize,
                      borderRadius: messageProfileImageSize / 2,
                    }]}
                    contentFit="cover"
                  />
                )}
              </View>
              <View style={[
                styles.messageTimeContainer,
                isMyMessage ? styles.myMessageTimeContainer : styles.otherMessageTimeContainer
              ]}>
                <Text style={[styles.messageTimeText, { fontSize: messageTimeFontSize }]}>
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
          style={[styles.input, { fontSize: inputFontSize }]}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
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
    marginHorizontal: 8,
  },
  messageBubble: {
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
    color: '#666666',
  },
  messageText: {
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

