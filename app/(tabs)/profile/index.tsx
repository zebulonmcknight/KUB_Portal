import { icons } from "@/constants/icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

// ─── User profile props — swap these out for your real auth/user context ──────
type UserProfile = {
  name: string;
  address: string;
  accountNumber: string;
};

const DEFAULT_USER: UserProfile = {
  name: "Billy Joel",
  address: "200 W Hill Ave",
  accountNumber: "8764872181",
};
// ─────────────────────────────────────────────────────────────────────────────

type ModalType = "mailing" | "password" | "email" | "phone" | "feedback" | null;

// ── Icons ─────────────────────────────────────────────────────────────────────
function ChevronIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke="#4a6080"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function CloseIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke="#7a99c8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Reusable modal shell ───────────────────────────────────────────────────────
function SheetModal({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const translateY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
        speed: 14,
      }).start();
    } else {
      translateY.setValue(600);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={modalStyles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Backdrop appears instantly */}
        <TouchableOpacity
          style={modalStyles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        {/* Only the sheet slides up */}
        <Animated.View
          style={[modalStyles.sheet, { transform: [{ translateY }] }]}
        >
          <View style={modalStyles.handle} />
          <View style={modalStyles.sheetHeader}>
            <Text allowFontScaling={false} style={modalStyles.sheetTitle}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CloseIcon />
            </TouchableOpacity>
          </View>
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ProfileScreen({
  user = DEFAULT_USER
}) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const tabBarHeight = useBottomTabBarHeight();

  // Field values
  const [mailing, setMailing] = useState<"paperless" | "physical">("paperless");
  const [mailingDraft, setMailingDraft] = useState<"paperless" | "physical">(
    "paperless",
  );
  const [password, setPassword] = useState("••••••••");
  const [passwordDraft, setPasswordDraft] = useState("");
  const [confirmDraft, setConfirmDraft] = useState("");
  const [email, setEmail] = useState("billy@gmail.com");
  const [emailDraft, setEmailDraft] = useState("");
  const [phone, setPhone] = useState("865-361-3331");
  const [phoneDraft, setPhoneDraft] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackDraft, setFeedbackDraft] = useState("");

  const open = (type: ModalType) => {
    if (type === "mailing") setMailingDraft(mailing);
    if (type === "email") setEmailDraft(email);
    if (type === "phone") setPhoneDraft(phone);
    if (type === "password") {
      setPasswordDraft("");
      setConfirmDraft("");
    }
    if (type === "feedback") setFeedbackDraft(feedback);
    setActiveModal(type);
  };
  const close = () => setActiveModal(null);

  const saveMailing = () => {
    setMailing(mailingDraft);
    close();
  };

  const savePassword = () => {
    if (passwordDraft.length < 8) {
      Alert.alert("Too short", "Password must be at least 8 characters.");
      return;
    }
    if (passwordDraft !== confirmDraft) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }
    setPassword("••••••••");
    close();
  };

  const handlePushNotifications = () => {
    Linking.openSettings();
  };

  const saveEmail = () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDraft);
    if (!valid) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    setEmail(emailDraft);
    close();
  };

  const savePhone = () => {
    const digits = phoneDraft.replace(/\D/g, "");
    if (digits.length !== 10) {
      Alert.alert("Invalid phone", "Please enter a 10-digit phone number.");
      return;
    }
    const formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    setPhone(formatted);
    close();
  };

  const saveFeedback = () => {
    if (!feedbackDraft.trim()) {
      Alert.alert("Empty", "Please enter your feedback.");
      return;
    }
    setFeedback(feedbackDraft.trim());
    Alert.alert("Thank you!", "Your feedback has been submitted.");
    close();
  };

  const router = useRouter();
  const handleStorageCleanup = async () => {
    // On logout delete the stored keys
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("token_expiry");

    // Redirect to login page
    router.replace("/(auth)/login");
  };
  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          handleStorageCleanup();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}  edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[styles.scroll, {paddingBottom: tabBarHeight}]}
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text allowFontScaling={false} style={styles.pageTitle}>Profile</Text>

        {/* Account card */}
        <View style={styles.accountCard}>
          <Text allowFontScaling={false} style={styles.accountName}>{user.name}</Text>
          <Text allowFontScaling={false} style={styles.accountDetail}>{user.address}</Text>
          <Text allowFontScaling={false} style={styles.accountDetail}>
            Account # {user.accountNumber}
          </Text>
          <TouchableOpacity
            style={styles.manageBtn}
            activeOpacity={0.8}
            onPress={() =>
              router.navigate({
                pathname: "/(tabs)/profile/manageYourService",
              })
            }
          >
            <Text allowFontScaling={false} style={styles.manageBtnText}>MANAGE YOUR SERVICE</Text>
          </TouchableOpacity>
        </View>

        {/* Settings rows */}
        <View>
          <RowButton
            label="Mailing Preference"
            value={mailing === "paperless" ? "Paperless" : "Physical Mail"}
            onPress={() => open("mailing")}
          />
          <Divider />
          <RowButton
            label="Password"
            value="(Hidden)"
            onPress={() => open("password")}
          />
        </View>
        <Divider />
        <Text allowFontScaling={false} style={styles.sectionHeader}>Contacts &amp; Notifications</Text>

        <View>
          <RowButton
            icon={
              <Image source={icons.email} style={{ width: 18, height: 18 }} />
            }
            label="Primary Email"
            value={email}
            onPress={() => open("email")}
          />
          <Divider />
          <RowButton
            icon={
              <Image source={icons.phone} style={{ width: 18, height: 18 }} />
            }
            label="Phone"
            value={phone}
            onPress={() => open("phone")}
          />
          <Divider />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.navigate({
                pathname: "/(tabs)/profile/alternateContacts",
              })
            }
          >
            <RowButton
              icon={
                <Image
                  source={icons.phonebook}
                  style={{ width: 18, height: 18 }}
                />
              }
              label="Alternate Contacts"
              chevron={false}
            />
          </TouchableOpacity>
          <Divider />
          <RowButton
            icon={
              <Image
                source={icons.notifications}
                style={{ width: 18, height: 18 }}
              />
            }
            label="Push Notifications"
            chevron={false}
            onPress={handlePushNotifications}
          />
          <Divider />
          <RowButton
            icon={
              <Image
                source={icons.feedback}
                style={{ width: 18, height: 18 }}
              />
            }
            label="App Feedback"
            onPress={() => open("feedback")}
          />
        </View>
        <Divider />

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutRow}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Image
            source={icons.logout}
            style={{ width: 18, height: 18, tintColor: "#e05c5c" }}
          />
          <Text allowFontScaling={false} style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Mailing Preference Modal ── */}
      <SheetModal
        visible={activeModal === "mailing"}
        title="Mailing Preference"
        onClose={close}
      >
        {(["paperless", "physical"] as const).map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              modalStyles.choiceRow,
              mailingDraft === opt && modalStyles.choiceRowActive,
            ]}
            onPress={() => setMailingDraft(opt)}
            activeOpacity={0.8}
          >
            <View
              style={[
                modalStyles.radio,
                mailingDraft === opt && modalStyles.radioActive,
              ]}
            >
              {mailingDraft === opt && <View style={modalStyles.radioDot} />}
            </View>
            <Text allowFontScaling={false} style={modalStyles.choiceLabel}>
              {opt === "paperless" ? "Paperless (Digital)" : "Physical Mail"}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={modalStyles.saveBtn} onPress={saveMailing}>
          <Text allowFontScaling={false} style={modalStyles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </SheetModal>

      {/* ── Password Modal ── */}
      <SheetModal
        visible={activeModal === "password"}
        title="Change Password"
        onClose={close}
      >
        <Text allowFontScaling={false} style={modalStyles.fieldLabel}>New Password</Text>
        <TextInput
          style={modalStyles.textInput}
          placeholder="Min. 12 characters"
          placeholderTextColor="#4a6080"
          secureTextEntry
          value={passwordDraft}
          onChangeText={setPasswordDraft}
          autoCapitalize="none"
        />
        <Text allowFontScaling={false} style={modalStyles.fieldLabel}>Confirm Password</Text>
        <TextInput
          style={modalStyles.textInput}
          placeholder="Repeat password"
          placeholderTextColor="#4a6080"
          secureTextEntry
          value={confirmDraft}
          onChangeText={setConfirmDraft}
          autoCapitalize="none"
        />
        <TouchableOpacity style={modalStyles.saveBtn} onPress={savePassword}>
          <Text allowFontScaling={false} style={modalStyles.saveBtnText}>Update Password</Text>
        </TouchableOpacity>
      </SheetModal>

      {/* ── Email Modal ── */}
      <SheetModal
        visible={activeModal === "email"}
        title="Primary Email"
        onClose={close}
      >
        <Text allowFontScaling={false} style={modalStyles.fieldLabel}>Email Address</Text>
        <TextInput
          style={modalStyles.textInput}
          placeholder="you@example.com"
          placeholderTextColor="#4a6080"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={emailDraft}
          onChangeText={setEmailDraft}
        />
        <TouchableOpacity style={modalStyles.saveBtn} onPress={saveEmail}>
          <Text allowFontScaling={false} style={modalStyles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </SheetModal>

      {/* ── Phone Modal ── */}
      <SheetModal
        visible={activeModal === "phone"}
        title="Phone Number"
        onClose={close}
      >
        <Text allowFontScaling={false} style={modalStyles.fieldLabel}>Phone Number</Text>
        <TextInput
          style={modalStyles.textInput}
          placeholder="10-digit number"
          placeholderTextColor="#4a6080"
          keyboardType="phone-pad"
          value={phoneDraft}
          onChangeText={setPhoneDraft}
          maxLength={14}
        />
        <TouchableOpacity style={modalStyles.saveBtn} onPress={savePhone}>
          <Text allowFontScaling={false} style={modalStyles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </SheetModal>

      {/* ── Feedback Modal ── */}
      <SheetModal
        visible={activeModal === "feedback"}
        title="App Feedback"
        onClose={close}
      >
        <Text allowFontScaling={false} style={modalStyles.fieldLabel}>Your Feedback</Text>
        <TextInput
          style={[
            modalStyles.textInput,
            { height: 100, textAlignVertical: "top" },
          ]}
          placeholder="Tell us what you think…"
          placeholderTextColor="#4a6080"
          multiline
          value={feedbackDraft}
          onChangeText={setFeedbackDraft}
        />
        <TouchableOpacity style={modalStyles.saveBtn} onPress={saveFeedback}>
          <Text allowFontScaling={false} style={modalStyles.saveBtnText}>Submit</Text>
        </TouchableOpacity>
      </SheetModal>
    </SafeAreaView>
  );
}

// ── Row button component ───────────────────────────────────────────────────────
function RowButton({
  icon,
  label,
  value,
  onPress,
  chevron = true,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  chevron?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
      disabled={!onPress}
    >
      {icon && <View style={styles.rowIcon}>{icon}</View>}
      <View style={styles.rowContent}>
        <Text allowFontScaling={false} style={styles.rowLabel}>{label}</Text>
        {value && <Text allowFontScaling={false} style={styles.rowValue}>{value}</Text>}
      </View>
      {chevron && onPress && <ChevronIcon />}
    </TouchableOpacity>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#091C3C" },
  scroll: { paddingHorizontal: 16, paddingBottom: 120 },
  pageTitle: {
    color: "#F7FDFD",
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 18,
  },
  accountCard: {
    backgroundColor: "#162C53",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  accountName: {
    color: "#F7FDFD",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
  },
  accountDetail: {
    color: "#A0B3D3",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
  },
  manageBtn: {
    marginTop: 16,
    backgroundColor: "#3377F4",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  manageBtnText: {
    color: "#F7FDFD",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    textAlign: 'center',
    letterSpacing: 2,
  },
  sectionHeader: {
    color: "#F7FDFD",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginTop: 10,
  },
  section: {
    backgroundColor: "#162C53",
    borderRadius: 14,
    marginBottom: 20,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  rowIcon: { marginRight: 12 },
  rowContent: { flex: 1 },
  rowLabel: { color: "#F7FDFD", fontSize: 16, fontFamily: "Inter_400Regular" },
  rowValue: { color: "#A0B3D3", fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 2 },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
    marginTop: 6,
  },
  logoutText: { color: "#e05c5c", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#132338",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#2e4a6a",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    marginBottom: 20,
  },
  sheetTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  fieldLabel: {
    color: "#A0B3D3",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  textInput: {
    backgroundColor: "#0d1b2e",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#F7FDFD",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1e3050",
  },
  saveBtn: {
    backgroundColor: "#3377F4",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  choiceRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#0d1b2e",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1e3050",
  },
  choiceRowActive: { borderColor: "#3377F4", backgroundColor: "#0f2044" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4a6080",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioActive: { borderColor: "#3377F4" },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3377F4",
  },
  choiceLabel: {
    color: "#F7FDFD",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
});
