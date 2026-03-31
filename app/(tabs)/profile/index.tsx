import { icons } from "@/constants/icons";
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
import Svg, { Circle, Path } from "react-native-svg";

// ─── User profile props — swap these out for your real auth/user context ──────
type UserProfile = {
  name: string;
  address: string;
  accountNumber: string;
};

type Props = {
  user?: UserProfile;
  onLogout?: () => void;
};

const DEFAULT_USER: UserProfile = {
  name: "Billy Joel",
  address: "200 W Hill Ave",
  accountNumber: "8764872181",
};
// ─────────────────────────────────────────────────────────────────────────────

type ModalType = "mailing" | "password" | "email" | "phone" | "feedback" | null;

// ── Icons ─────────────────────────────────────────────────────────────────────
function EmailIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="#7a99c8"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 6l-10 7L2 6"
        stroke="#7a99c8"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function PhoneIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="#7a99c8"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function ContactsIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        stroke="#7a99c8"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="9"
        cy="7"
        r="4"
        stroke="#7a99c8"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="#7a99c8"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function BellIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
        stroke="#7a99c8"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function FeedbackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="#7a99c8"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function LogoutIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
        stroke="#e05c5c"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function ChevronIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
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
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
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
            <Text style={modalStyles.sheetTitle}>{title}</Text>
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
  user = DEFAULT_USER,
  onLogout,
}: Props) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

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
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Account card */}
        <View style={styles.accountCard}>
          <Text style={styles.accountName}>{user.name}</Text>
          <Text style={styles.accountDetail}>{user.address}</Text>
          <Text style={styles.accountDetail}>
            Account # {user.accountNumber}
          </Text>
          <TouchableOpacity style={styles.manageBtn} activeOpacity={0.8}>
            <Text style={styles.manageBtnText}>MANAGE YOUR SERVICE</Text>
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

        <Text style={styles.sectionHeader}>Contacts &amp; Notifications</Text>

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
          <Text style={styles.logoutText}>Logout</Text>
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
            <Text style={modalStyles.choiceLabel}>
              {opt === "paperless" ? "Paperless (Digital)" : "Physical Mail"}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={modalStyles.saveBtn} onPress={saveMailing}>
          <Text style={modalStyles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </SheetModal>

      {/* ── Password Modal ── */}
      <SheetModal
        visible={activeModal === "password"}
        title="Change Password"
        onClose={close}
      >
        <Text style={modalStyles.fieldLabel}>New Password</Text>
        <TextInput
          style={modalStyles.textInput}
          placeholder="Min. 12 characters"
          placeholderTextColor="#4a6080"
          secureTextEntry
          value={passwordDraft}
          onChangeText={setPasswordDraft}
          autoCapitalize="none"
        />
        <Text style={modalStyles.fieldLabel}>Confirm Password</Text>
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
          <Text style={modalStyles.saveBtnText}>Update Password</Text>
        </TouchableOpacity>
      </SheetModal>

      {/* ── Email Modal ── */}
      <SheetModal
        visible={activeModal === "email"}
        title="Primary Email"
        onClose={close}
      >
        <Text style={modalStyles.fieldLabel}>Email Address</Text>
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
          <Text style={modalStyles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </SheetModal>

      {/* ── Phone Modal ── */}
      <SheetModal
        visible={activeModal === "phone"}
        title="Phone Number"
        onClose={close}
      >
        <Text style={modalStyles.fieldLabel}>Phone Number</Text>
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
          <Text style={modalStyles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </SheetModal>

      {/* ── Feedback Modal ── */}
      <SheetModal
        visible={activeModal === "feedback"}
        title="App Feedback"
        onClose={close}
      >
        <Text style={modalStyles.fieldLabel}>Your Feedback</Text>
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
          <Text style={modalStyles.saveBtnText}>Submit</Text>
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
        <Text style={styles.rowLabel}>{label}</Text>
        {value && <Text style={styles.rowValue}>{value}</Text>}
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
  scroll: { paddingHorizontal: 20, paddingBottom: 120 },
  pageTitle: {
    color: "#F7FDFD",
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
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
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  accountDetail: {
    color: "#A0B3D3",
    fontSize: 15,
    fontWeight: "600",
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
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  sectionHeader: {
    color: "#F7FDFD",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 4,
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
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowIcon: { marginRight: 12 },
  rowContent: { flex: 1 },
  rowLabel: { color: "#F7FDFD", fontSize: 15, fontWeight: "600" },
  rowValue: { color: "#A0B3D3", fontSize: 13, marginTop: 2 },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginLeft: 16,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
    marginTop: 4,
  },
  logoutText: { color: "#e05c5c", fontSize: 16, fontWeight: "600" },
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
  sheetTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  fieldLabel: {
    color: "#7a99c8",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  textInput: {
    backgroundColor: "#0d1b2e",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#e8edf5",
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1e3050",
  },
  saveBtn: {
    backgroundColor: "#3d6ef5",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
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
  choiceRowActive: { borderColor: "#3d6ef5", backgroundColor: "#0f2044" },
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
  radioActive: { borderColor: "#3d6ef5" },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3d6ef5",
  },
  choiceLabel: { color: "#e8edf5", fontSize: 15, fontWeight: "500" },
});
