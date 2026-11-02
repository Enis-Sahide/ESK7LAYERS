import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SacredBackground from '@/components/SacredBackground';
import { apiFetch, getMe } from '@/src/core/api/client';
import { COLORS } from '@/src/theme';

interface ChatNotificationItem {
  id: string;
  roomId: string;
  roomTitle: string;
  roomIcon: string;
  senderName: string;
  messageId: string;
  messagePreview: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatRoom {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  colorHex: string;
  sortOrder: number;
  messageCount: number;
}

interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  senderName: string;
  senderRole: string;
  senderRoleTitle: string;
  content: string;
  replyToId: string | null;
  replyPreviewName: string | null;
  replyPreviewText: string | null;
  createdAt: string;
  isOwn: boolean;
}

interface MyChatProfile {
  userId: string;
  nickname: string | null;
  maskedDefaultName: string;
  effectiveDisplayName: string;
  role: string;
  roleTitle: string;
  isAdmin: boolean;
}

const ROLE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  free: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.18)', text: '#D1D5DB' },
  apprentice: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.45)', text: '#FCD34D' },
  journeyman: { bg: 'rgba(14,165,233,0.15)', border: 'rgba(14,165,233,0.45)', text: '#7DD3FC' },
  master: { bg: 'rgba(168,85,247,0.18)', border: 'rgba(168,85,247,0.50)', text: '#E9D5FF' },
  admin: { bg: 'rgba(212,175,55,0.22)', border: '#D4AF37', text: '#FDE68A' },
};

export default function MobileEsotericCouncilScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ room?: string }>();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>(params.room || 'genel-meydan');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [myProfile, setMyProfile] = useState<MyChatProfile | null>(null);

  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const [inputText, setInputText] = useState('');
  const [replyTarget, setReplyTarget] = useState<ChatMessage | null>(null);

  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [isSavingNickname, setIsSavingNickname] = useState(false);

  const [notifications, setNotifications] = useState<ChatNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifModal, setShowNotifModal] = useState(false);

  useEffect(() => {
    if (params.room && typeof params.room === 'string') {
      setActiveRoomId(params.room);
    }
  }, [params.room]);

  const scrollRef = useRef<ScrollView>(null);
  const prevCountRef = useRef<number>(0);

  const scrollToEnd = (animated = true) => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated });
    }, 80);
  };

  useEffect(() => {
    (async () => {
      try {
        const me: any = await getMe();
        if (me?.user) {
          setIsLoggedIn(true);
          setIsAdmin(me.role === 'admin');
        }
      } catch {
        setIsLoggedIn(false);
      }
    })();
  }, []);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await apiFetch('/api/chat/rooms');
      const data = await res.json();
      if (data?.success && Array.isArray(data.rooms)) {
        setRooms(data.rooms);
        if (data.myProfile) {
          setMyProfile(data.myProfile);
          setNicknameInput(data.myProfile.nickname || '');
          setIsLoggedIn(true);
          setIsAdmin(!!data.myProfile.isAdmin);
        }
      }
    } catch (e) {
      // silent
    } finally {
      setIsLoadingRooms(false);
    }
  }, []);

  const fetchMessages = useCallback(async (roomId: string, silent = false) => {
    if (!silent) setIsLoadingMessages(true);
    try {
      const res = await apiFetch(`/api/chat/messages?roomId=${encodeURIComponent(roomId)}`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
        if (!silent || data.messages.length > prevCountRef.current) {
          scrollToEnd(silent);
        }
        prevCountRef.current = data.messages.length;
      }
    } catch (e) {
      // silent
    } finally {
      if (!silent) setIsLoadingMessages(false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await apiFetch('/api/chat/notifications');
      const data = await res.json();
      if (data?.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // silent
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 8000);
    return () => clearInterval(timer);
  }, [isLoggedIn, fetchNotifications]);

  useEffect(() => {
    prevCountRef.current = 0;
    setReplyTarget(null);
    fetchMessages(activeRoomId, false);

    if (isLoggedIn && activeRoomId) {
      apiFetch('/api/chat/notifications', {
        method: 'POST',
        body: JSON.stringify({ action: 'mark_read', roomId: activeRoomId }),
      })
        .then(() => fetchNotifications())
        .catch(() => {});
    }

    const timer = setInterval(() => {
      fetchMessages(activeRoomId, true);
    }, 4500);

    return () => clearInterval(timer);
  }, [activeRoomId, fetchMessages, isLoggedIn, fetchNotifications]);

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    try {
      const res = await apiFetch('/api/chat/messages', {
        method: 'POST',
        body: JSON.stringify({
          roomId: activeRoomId,
          content: trimmed,
          replyToId: replyTarget?.id || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        Alert.alert('Meclis Uyarısı', data?.error || 'Mesaj gönderilemedi.');
        return;
      }

      setInputText('');
      setReplyTarget(null);
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        prevCountRef.current += 1;
        setRooms((prev) =>
          prev.map((r) =>
            r.id === activeRoomId ? { ...r, messageCount: (r.messageCount || 0) + 1 } : r
          )
        );
        scrollToEnd(true);
      }
    } catch {
      Alert.alert('Bağlantı Hatası', 'Mesaj gönderilirken sunucuya ulaşılamadı.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = (msgId: string) => {
    Alert.alert('Mesajı Sil', 'Bu mesajı meclis odasından silmek istediğinize emin misiniz?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await apiFetch(`/api/chat/messages?id=${encodeURIComponent(msgId)}`, {
              method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok && data?.success) {
              setMessages((prev) => prev.filter((m) => m.id !== msgId));
            }
          } catch {
            // silent
          }
        },
      },
    ]);
  };

  const handleSaveNickname = async () => {
    if (isSavingNickname) return;
    setIsSavingNickname(true);
    try {
      const res = await apiFetch('/api/chat/nickname', {
        method: 'POST',
        body: JSON.stringify({ nickname: nicknameInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        Alert.alert('Uyarı', data?.error || 'Rumuz kaydedilemedi.');
        return;
      }

      setMyProfile((prev) =>
        prev
          ? {
              ...prev,
              nickname: data.nickname,
              effectiveDisplayName: data.effectiveDisplayName,
            }
          : prev
      );
      setShowNicknameModal(false);
      fetchMessages(activeRoomId, true);
    } catch {
      Alert.alert('Hata', 'Rumuz güncellenirken bir sorun oluştu.');
    } finally {
      setIsSavingNickname(false);
    }
  };

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <SacredBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.headerTitle}>Ezoterik Meclis</Text>
            <Text style={styles.headerSub}>Kadim İlimler & Sohbet Odaları</Text>
          </View>
          {isLoggedIn && (
            <TouchableOpacity
              onPress={() => setShowNotifModal(true)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                backgroundColor: 'rgba(212,175,55,0.12)',
                borderWidth: 1,
                borderColor: 'rgba(212,175,55,0.35)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}
            >
              <Ionicons name="notifications-outline" size={18} color="#FDE68A" />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    minWidth: 17,
                    height: 17,
                    borderRadius: 9,
                    backgroundColor: '#F59E0B',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 3,
                  }}
                >
                  <Text style={{ color: '#000', fontSize: 9.5, fontWeight: '900' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {isLoggedIn && myProfile && (
            <TouchableOpacity
              style={styles.nicknameBtn}
              onPress={() => {
                setNicknameInput(myProfile.nickname || '');
                setShowNicknameModal(true);
              }}
            >
              <Ionicons name="create-outline" size={14} color="#D4AF37" />
              <Text style={styles.nicknameBtnText} numberOfLines={1}>
                {myProfile.effectiveDisplayName}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Horizontal Room Selector */}
        <View style={{ paddingVertical: 6 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 14, gap: 8 }}
          >
            {isLoadingRooms ? (
              <ActivityIndicator size="small" color="#D4AF37" style={{ marginVertical: 10 }} />
            ) : (
              rooms.map((room) => {
                const isActive = room.id === activeRoomId;
                return (
                  <TouchableOpacity
                    key={room.id}
                    onPress={() => setActiveRoomId(room.id)}
                    activeOpacity={0.8}
                    style={[
                      styles.roomTab,
                      isActive && {
                        backgroundColor: 'rgba(212,175,55,0.22)',
                        borderColor: '#D4AF37',
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 16, marginRight: 6 }}>{room.icon}</Text>
                    <View>
                      <Text
                        style={[
                          styles.roomTabTitle,
                          isActive && { color: '#FDE68A', fontWeight: '800' },
                        ]}
                      >
                        {room.title}
                      </Text>
                      <Text style={styles.roomTabCount}>{room.messageCount || 0} mesaj</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>

        {/* Active Room Info Strip */}
        {activeRoom && (
          <View style={styles.roomBanner}>
            <Text style={{ fontSize: 20, marginRight: 10 }}>{activeRoom.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.roomBannerTitle}>{activeRoom.title}</Text>
              <Text style={styles.roomBannerDesc} numberOfLines={2}>
                {activeRoom.description}
              </Text>
            </View>
          </View>
        )}

        {/* Messages Feed */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messagesContainer}
          keyboardShouldPersistTaps="handled"
        >
          {isLoadingMessages ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#D4AF37" />
              <Text style={styles.emptySubText}>Meclis mesajları yükleniyor...</Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={{ fontSize: 34, marginBottom: 8 }}>{activeRoom?.icon || '💬'}</Text>
              <Text style={styles.emptyTitle}>
                {activeRoom?.title} Odasında İlk Sözü Siz Söyleyin
              </Text>
              <Text style={styles.emptySubText}>
                Bu odada henüz mesaj paylaşılmamış. Düşüncelerinizi veya sorunuzu yazarak sohbeti başlatabilirsiniz.
              </Text>
            </View>
          ) : (
            messages.map((msg) => {
              const rolePalette = ROLE_COLORS[msg.senderRole] || ROLE_COLORS.free;
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.msgRow,
                    msg.isOwn ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' },
                  ]}
                >
                  <View
                    style={[
                      styles.msgBubble,
                      msg.isOwn ? styles.msgBubbleOwn : styles.msgBubbleOther,
                    ]}
                  >
                    {/* Sender Header */}
                    <View style={styles.msgHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, flex: 1 }}>
                        <Text
                          style={[
                            styles.senderName,
                            msg.senderRole === 'admin'
                              ? { color: '#FDE68A' }
                              : msg.isOwn
                              ? { color: '#FCD34D' }
                              : { color: '#7DD3FC' },
                          ]}
                        >
                          {msg.senderName}
                        </Text>
                        <View
                          style={[
                            styles.roleBadge,
                            {
                              backgroundColor: rolePalette.bg,
                              borderColor: rolePalette.border,
                            },
                          ]}
                        >
                          <Text style={[styles.roleBadgeText, { color: rolePalette.text }]}>
                            {msg.senderRoleTitle}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.msgTime}>{formatTime(msg.createdAt)}</Text>
                    </View>

                    {/* Reply Preview */}
                    {msg.replyPreviewText ? (
                      <View style={styles.replyQuoteBox}>
                        <Text style={styles.replyQuoteAuthor}>
                          @{msg.replyPreviewName || 'Yolcu'}
                        </Text>
                        <Text style={styles.replyQuoteText} numberOfLines={2}>
                          {msg.replyPreviewText}
                        </Text>
                      </View>
                    ) : null}

                    {/* Message Body */}
                    <Text style={styles.msgContent}>{msg.content}</Text>

                    {/* Actions */}
                    <View style={styles.msgFooterActions}>
                      {isLoggedIn && (
                        <TouchableOpacity
                          onPress={() => setReplyTarget(msg)}
                          style={styles.actionBtn}
                        >
                          <Ionicons name="arrow-undo-outline" size={12} color="#9CA3AF" />
                          <Text style={styles.actionBtnText}>Yanıtla</Text>
                        </TouchableOpacity>
                      )}
                      {(msg.isOwn || isAdmin) && (
                        <TouchableOpacity
                          onPress={() => handleDelete(msg.id)}
                          style={styles.actionBtn}
                        >
                          <Ionicons name="trash-outline" size={12} color="#F87171" />
                          <Text style={[styles.actionBtnText, { color: '#F87171' }]}>Sil</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Composer Bar */}
        <View style={styles.composerWrapper}>
          {replyTarget && (
            <View style={styles.replyBanner}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 11, color: '#FCD34D', fontWeight: 'bold' }}>
                  @{replyTarget.senderName} mesajına yanıt:
                </Text>
                <Text style={{ fontSize: 11, color: '#D1D5DB' }} numberOfLines={1}>
                  {replyTarget.content}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setReplyTarget(null)}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          )}

          {isLoggedIn ? (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder={`${activeRoom?.title || 'Meclis'} odasına yazın...`}
                placeholderTextColor="#6B7280"
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={isSending || !inputText.trim()}
                style={[
                  styles.sendBtn,
                  (isSending || !inputText.trim()) && { opacity: 0.45 },
                ]}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Ionicons name="send" size={17} color="#000" />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.guestBar}>
              <Text style={styles.guestBarText}>
                Sohbete katılmak ve mesaj yazmak için giriş yapın.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                style={styles.guestLoginBtn}
              >
                <Text style={styles.guestLoginBtnText}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Nickname Modal */}
        <Modal
          visible={showNicknameModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowNicknameModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={styles.modalTitle}>Meclis Rumuzu Belirle</Text>
                <TouchableOpacity onPress={() => setShowNicknameModal(false)}>
                  <Ionicons name="close" size={22} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalDesc}>
                Gizliliğiniz için e-posta adresiniz ve tam soyadınız sohbette asla gösterilmez. İsterseniz kendinize özel bir rumuz (mahlas) belirleyebilirsiniz.
              </Text>
              <TextInput
                style={styles.modalInput}
                value={nicknameInput}
                onChangeText={setNicknameInput}
                maxLength={22}
                placeholder={`Varsayılan: ${myProfile?.maskedDefaultName || 'Yolcu'}`}
                placeholderTextColor="#6B7280"
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <TouchableOpacity
                  onPress={() => setShowNicknameModal(false)}
                  style={styles.modalCancelBtn}
                >
                  <Text style={{ color: '#D1D5DB', fontSize: 13, fontWeight: 'bold' }}>Vazgeç</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveNickname}
                  disabled={isSavingNickname}
                  style={styles.modalSaveBtn}
                >
                  <Text style={{ color: '#000', fontSize: 13, fontWeight: '900' }}>
                    {isSavingNickname ? 'Kaydediliyor...' : 'Kaydet'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Notifications Modal */}
        <Modal
          visible={showNotifModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowNotifModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { maxHeight: '75%' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="notifications" size={18} color="#FDE68A" />
                  <Text style={styles.modalTitle}>Meclis Yanıt Bildirimleri</Text>
                </View>
                <TouchableOpacity onPress={() => setShowNotifModal(false)}>
                  <Ionicons name="close" size={22} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 360 }}>
                {notifications.length === 0 ? (
                  <Text style={[styles.modalDesc, { textAlign: 'center', paddingVertical: 24 }]}>
                    Henüz mesajlarınıza gelen bir yanıt bildirimi bulunmuyor.
                  </Text>
                ) : (
                  notifications.map((n) => (
                    <TouchableOpacity
                      key={n.id}
                      onPress={async () => {
                        setShowNotifModal(false);
                        setActiveRoomId(n.roomId);
                        try {
                          await apiFetch('/api/chat/notifications', {
                            method: 'POST',
                            body: JSON.stringify({ action: 'mark_read', notificationId: n.id }),
                          });
                          fetchNotifications();
                        } catch {
                          // ignore
                        }
                      }}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderRadius: 12,
                        marginBottom: 8,
                        backgroundColor: !n.isRead ? 'rgba(245,158,11,0.14)' : 'rgba(255,255,255,0.04)',
                        borderWidth: 1,
                        borderColor: !n.isRead ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: '#FDE68A', fontSize: 12, fontWeight: '800' }}>
                          {n.roomIcon} @{n.senderName} yanıtladı
                        </Text>
                        {!n.isRead && (
                          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B' }} />
                        )}
                      </View>
                      <Text style={{ color: '#E5E7EB', fontSize: 12, marginTop: 4 }} numberOfLines={2}>
                        &ldquo;{n.messagePreview}&rdquo;
                      </Text>
                      <Text style={{ color: '#9CA3AF', fontSize: 10, marginTop: 4 }}>
                        {n.roomTitle} Odasına Git →
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 54 : 44,
    paddingBottom: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212,175,55,0.2)',
    backgroundColor: 'rgba(5,5,10,0.85)',
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  nicknameBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(212,175,55,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.45)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: 140,
  },
  nicknameBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FDE68A',
  },
  roomTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,18,28,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  roomTabTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#E5E7EB',
  },
  roomTabCount: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  roomBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 4,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)',
  },
  roomBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FDE68A',
  },
  roomBannerDesc: {
    fontSize: 11,
    color: '#D1D5DB',
    marginTop: 1,
  },
  messagesContainer: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  centerBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  msgRow: {
    width: '100%',
    marginBottom: 6,
  },
  msgBubble: {
    maxWidth: '86%',
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderWidth: 1,
  },
  msgBubbleOwn: {
    backgroundColor: 'rgba(212,175,55,0.16)',
    borderColor: 'rgba(212,175,55,0.45)',
  },
  msgBubbleOther: {
    backgroundColor: 'rgba(20,24,36,0.9)',
    borderColor: 'rgba(255,255,255,0.12)',
  },
  msgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    gap: 8,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '800',
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  msgTime: {
    fontSize: 10,
    color: '#6B7280',
  },
  replyQuoteBox: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderLeftWidth: 2,
    borderLeftColor: '#D4AF37',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
  },
  replyQuoteAuthor: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FCD34D',
  },
  replyQuoteText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  msgContent: {
    fontSize: 13.5,
    color: '#F3F4F6',
    lineHeight: 19,
  },
  msgFooterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  actionBtnText: {
    fontSize: 10.5,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  composerWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(8,10,16,0.95)',
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13.5,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  guestBarText: {
    flex: 1,
    fontSize: 12,
    color: '#E5E7EB',
    marginRight: 10,
  },
  guestLoginBtn: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  guestLoginBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#0F1420',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.45)',
    padding: 18,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  modalSaveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#D4AF37',
  },
});

