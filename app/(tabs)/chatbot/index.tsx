import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

// Receives the user message string, calls chatbot API, and returns the bot reply string.
async function sendMessageToBackend(userMessage: string): Promise<string> {
  const response = await fetch(
    "https://snappy-orville-leathern.ngrok-free.dev/chat",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: userMessage }),
    },
  );

  const data = await response.json();
  return data.response;
}

type Message = {
  id: string;
  from: "user" | "bot";
  text: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "0",
    from: "bot",
    text: "Hi, I'm Energi! I'm here to help you with any questions you have!",
  },
];

// Typing indicator bubble
function TypingBubble() {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounce = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -5,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.delay(540 - delay),
        ]),
      ).start();

    bounce(anim1, 0);
    bounce(anim2, 160);
    bounce(anim3, 320);
  }, []);

  return (
    <View style={styles.botRow}>
      <View style={[styles.bubble, styles.botBubble, { paddingVertical: 14 }]}>
        <View style={styles.dotsRow}>
          {[anim1, anim2, anim3].map((anim, i) => (
            <Animated.View
              key={i}
              style={[styles.dot, { transform: [{ translateY: anim }] }]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// Single message bubble
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.from === "user";
  return (
    <View style={isUser ? styles.userRow : styles.botRow}>
      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
      >
        <Text
          allowFontScaling={false}
          style={isUser ? styles.userText : styles.botText}
        >
          {msg.text}
        </Text>
      </View>
    </View>
  );
}

// Send icon
function SendIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 2L11 13"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Main screen
export default function QAChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const tabBarHeight = useBottomTabBarHeight();

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await sendMessageToBackend(text);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), from: "bot", text: reply },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          from: "bot",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const canSend = input.trim().length > 0 && !isTyping;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={"padding"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text allowFontScaling={false} style={styles.headerTitle}>
            Q&A
          </Text>
        </View>

        {/* Messages list */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messageList,
            { paddingBottom: tabBarHeight },
          ]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          renderItem={({ item }) => <MessageBubble msg={item} />}
          ListFooterComponent={isTyping ? <TypingBubble /> : null}
        />

        {/* Input bar */}
        <View style={[styles.inputBar]}>
          <TextInput
            style={styles.input}
            placeholder="Message Energi…"
            placeholderTextColor="#9aaabb"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, { opacity: canSend ? 1 : 0.4 }]}
            onPress={handleSend}
            disabled={!canSend}
            activeOpacity={0.75}
          >
            {isTyping ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <SendIcon />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#091C3C",
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 30,
    letterSpacing: -0.5,
    fontFamily: "Inter_700Bold",
  },
  messageList: {
    paddingHorizontal: 14,
    gap: 10,
  },
  botRow: {
    alignSelf: "flex-start",
    marginVertical: 4,
  },
  userRow: {
    alignSelf: "flex-end",
    marginVertical: 4,
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  botBubble: {
    backgroundColor: "#1e3050",
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "#3d6ef5",
    borderBottomRightRadius: 4,
  },
  botText: {
    color: "#e8edf5",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  userText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 14,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#7a99c8",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 14,
    marginVertical: 10,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#111",
    maxHeight: 100,
    paddingTop: 6,
    paddingBottom: 6,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#3d6ef5",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
});
