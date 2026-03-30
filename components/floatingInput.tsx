import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

// This component is used in the forgot username/password pages as well as the create login page. Used to create the text boxes for user input.

// These are the props the parent screen will pass down
export default function FloatingInput({ label, value, onChangeText, keyboard, maxLength, keyType, alertIcon, inputRef, onSubmitEditing, isPassword }: any) {
  
   // Track the focus of the component here instead of in parent file
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`rounded-sm mt-5 flex-row items-center ${
        isFocused ? "border-2 border-text_main" : "border border-inactive_text"
      }`}
    >
      <Text
        className={`absolute left-3 px-1 z-10 bg-primary font-sans ${
          isFocused || value.length > 0 
            ? `-top-3 text-sm ${isFocused ? 'text-text_main' : 'text-inactive_text'}` // Color of the text is based on it being focused alone
            : 'top-5 text-base text-inactive_text'
        }`}
      >
        {label}
      </Text>

      <TextInput
        ref={inputRef}
        onSubmitEditing={onSubmitEditing}
        className={`flex-1 font-sans p-5 text-base ${
          isFocused ? 'text-text_main' : 'text-inactive_text'
        }`}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={keyboard}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        maxLength={maxLength}
        returnKeyType={keyType}
        secureTextEntry={!!isPassword}
      />

      {alertIcon !== undefined ? alertIcon : null}

    </View>
  );
}