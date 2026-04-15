import ScreenHeader from "@/components/headerStyle";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AlternateContacts() {
  return (
    <View className="flex-1 px-6 pt-6">
      <ScreenHeader title="Alternate Contacts" />

      {/* Subtitle Text */}
      <Text className="text-text_main text-2xl text-center mt-6 mb-8">
        You may provide additional contacts to receive notifications for this
        account:
      </Text>

      {/* Phone Numbers Section*/}
      <Text className="text-text_main font-bold text-base mb-3">
        Phone Numbers
      </Text>
      <View style={modalStyles.inputWrapper}>
        <TextInput
          style={modalStyles.textInput}
          placeholder="8653613333"
          placeholderTextColor="#4a6080"
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={modalStyles.inputButton} onPress={() => {}}>
          <Text style={modalStyles.inputButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Email Addresses Section */}
      <Text className="text-text_main font-bold text-base mt-8 mb-3">
        Email Addresses
      </Text>
      <View style={modalStyles.inputWrapper}>
        <TextInput
          style={modalStyles.textInput}
          placeholder="you@example.com"
          placeholderTextColor="#4a6080"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={modalStyles.inputButton} onPress={() => {}}>
          <Text style={modalStyles.inputButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const modalStyles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d1b2e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e3050",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#e8edf5",
    fontSize: 15,
  },
  inputButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#3d6ef5",
    borderRadius: 8,
    marginRight: 6,
  },
  inputButtonText: {
    color: "#fff",
    fontSize: 15,
  },
});
