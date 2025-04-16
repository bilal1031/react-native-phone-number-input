import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import CountryPicker, {
  getCallingCode,
  DARK_THEME,
  DEFAULT_THEME,
  CountryModalProvider,
  Flag,
} from "react-native-country-picker-modal";
import { PhoneNumberUtil } from "google-libphonenumber";
import styles from "./styles";

const dropDown =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAi0lEQVRYR+3WuQ6AIBRE0eHL1T83FBqU5S1szdiY2NyTKcCAzU/Y3AcBXIALcIF0gRPAsehgugDEXnYQrUC88RIgfpuJ+MRrgFmILN4CjEYU4xJgFKIa1wB6Ec24FuBFiHELwIpQxa0ALUId9wAkhCnuBdQQ5ngP4I9wxXsBDyJ9m+8y/g9wAS7ABW4giBshQZji3AAAAABJRU5ErkJggg==";
const phoneUtil = PhoneNumberUtil.getInstance();

const PhoneInput = ({
  defaultCode,
  value,
  defaultValue = "",
  disabled = false,
  onChangeCountry,
  onChangeFormattedText,
  onChangeText,
  withShadow,
  withDarkTheme,
  codeTextStyle,
  textInputProps,
  textInputStyle,
  autoFocus,
  placeholder = "Phone Number",
  disableArrowIcon,
  flagButtonStyle,
  containerStyle,
  textContainerStyle,
  renderDropdownImage,
  countryPickerProps = {},
  filterProps = {},
  countryPickerButtonStyle,
  layout = "first",
  flagSize,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [code, setCode] = useState(defaultCode ? undefined : "91");
  const [number, setNumber] = useState(value || defaultValue);
  const [countryCode, setCountryCode] = useState(defaultCode || "IN");

  useEffect(() => {
    const initializeCode = async () => {
      if (defaultCode) {
        const newCode = await getCallingCode(defaultCode);
        setCode(newCode);
      }
    };
    initializeCode();
  }, [defaultCode]);

  useEffect(() => {
    if (value !== undefined) {
      setNumber(value);
    }
  }, [value]);

  const getCountryCode = () => countryCode;

  const getCallingCode = () => code;

  const isValidNumber = (number) => {
    try {
      const parsedNumber = phoneUtil.parse(number, countryCode);
      return phoneUtil.isValidNumber(parsedNumber);
    } catch (err) {
      return false;
    }
  };

  const onSelect = (country) => {
    setCountryCode(country.cca2);
    setCode(country.callingCode[0]);

    if (onChangeFormattedText) {
      if (country.callingCode[0]) {
        onChangeFormattedText(`+${country.callingCode[0]}${number}`);
      } else {
        onChangeFormattedText(number);
      }
    }
    if (onChangeCountry) {
      onChangeCountry(country);
    }
  };

  const onChangeTextHandler = (text) => {
    setNumber(text);
    if (onChangeText) {
      onChangeText(text);
    }
    if (onChangeFormattedText) {
      if (code) {
        onChangeFormattedText(text.length > 0 ? `+${code}${text}` : text);
      } else {
        onChangeFormattedText(text);
      }
    }
  };

  const getNumberAfterPossiblyEliminatingZero = () => {
    if (number.length > 0 && number.startsWith("0")) {
      const newNumber = number.substr(1);
      return {
        number: newNumber,
        formattedNumber: code ? `+${code}${newNumber}` : newNumber,
      };
    }
    return {
      number,
      formattedNumber: code ? `+${code}${number}` : number,
    };
  };

  const renderDropdownImageDefault = () => {
    return (
      <Image
        source={{ uri: dropDown }}
        resizeMode="contain"
        style={styles.dropDownImage}
      />
    );
  };

  const renderFlagButton = () => {
    if (layout === "first") {
      return (
        <Flag
          countryCode={countryCode}
          flagSize={flagSize || DEFAULT_THEME.flagSize}
        />
      );
    }
    return <View />;
  };

  return (
    <CountryModalProvider>
      <View
        style={[
          styles.container,
          withShadow ? styles.shadow : {},
          containerStyle,
        ]}
      >
        <TouchableOpacity
          style={[
            styles.flagButtonView,
            layout === "second" ? styles.flagButtonExtraWidth : {},
            flagButtonStyle,
            countryPickerButtonStyle,
          ]}
          disabled={disabled}
          onPress={() => setModalVisible(true)}
        >
          {modalVisible && (
            <CountryPicker
              onSelect={onSelect}
              withEmoji
              withFilter
              withFlag
              filterProps={filterProps}
              countryCode={countryCode}
              withCallingCode
              disableNativeModal={disabled}
              visible={modalVisible}
              theme={withDarkTheme ? DARK_THEME : DEFAULT_THEME}
              renderFlagButton={renderFlagButton}
              onClose={() => setModalVisible(false)}
              {...countryPickerProps}
            />
          )}

          {code && layout === "second" && (
            <Text style={[styles.codeText, codeTextStyle]}>{`+${code}`}</Text>
          )}
          {!disableArrowIcon &&
            (renderDropdownImage || renderDropdownImageDefault())}
        </TouchableOpacity>
        <View style={[styles.textContainer, textContainerStyle]}>
          {code && layout === "first" && (
            <Text style={[styles.codeText, codeTextStyle]}>{`+${code}`}</Text>
          )}
          <TextInput
            style={[styles.numberText, textInputStyle]}
            placeholder={placeholder}
            onChangeText={onChangeTextHandler}
            value={number}
            editable={!disabled}
            selectionColor="black"
            keyboardAppearance={withDarkTheme ? "dark" : "default"}
            keyboardType="number-pad"
            autoFocus={autoFocus}
            {...textInputProps}
          />
        </View>
      </View>
    </CountryModalProvider>
  );
};

export const isValidNumber = (number, countryCode) => {
  try {
    const parsedNumber = phoneUtil.parse(number, countryCode);
    return phoneUtil.isValidNumber(parsedNumber);
  } catch (err) {
    return false;
  }
};

export default PhoneInput;

export {
  CountryPicker,
  getCallingCode,
  DARK_THEME,
  DEFAULT_THEME,
  CountryModalProvider,
  Flag,
};
