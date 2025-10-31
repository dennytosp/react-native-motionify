import React, {
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ColorValue,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppStyles } from '@/styles';
import { COLORS, Icons } from '@/theme';
import { moderateScale, moderateVerticalScale } from '@/utils/scale';
import { Image } from '../Image';
import { RegularText } from '../Text';
import { styles } from './style';
import { InputProps, InputRef } from './type';

const Input = forwardRef((props: InputProps, ref: Ref<InputRef>) => {
  const {
    title,
    inputProps,
    placeHolder,
    containerStyle,
    style,
    titleStyle,
    inputStyle,
    defaultValue,
    isRequired,
    isPickerImage,
    isPassword = false,
    isUsingModal,
    leftIcon,
    rightIcon,
    hintError = '',
    hintErrorEmpty = 'Please input the required fields!',
    handleChangeText,
    onBlurInput,
    onSubmit,
    onPressInput,
    onPressRightInput,
    onPressLeftInput,
    renderCustom,
  } = props;

  const inputRef = useRef<TextInput>(null);

  const [inputValue, setInputValue] = useState<string>(defaultValue || '');
  const [isError, setIsError] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const [inputFocus, setInputFocus] = useState<boolean>(false);

  const isDisabled = onPressInput && isUsingModal;

  useImperativeHandle(
    ref,
    () => ({
      getErrorStatus,
      changeErrorStatus,
      changeValue,
      getValue,
      clearValue,
      getLengthCharacter,
      focus: onFocus,
    }),
    [inputValue],
  );

  useEffect(() => {
    if (isUsingModal) {
      onHandleModal();
    }
  }, [inputValue]);

  const onHandleModal = () => {
    isError && setIsError(prev => !prev);
  };

  const onBlur = useCallback(() => {
    onBlurInput && onBlurInput();
    setInputFocus(false);
  }, [inputValue]);

  const onChangeText = (text: string) => {
    setInputValue(text);

    isError && setIsError(prev => !prev);
    handleChangeText && handleChangeText(text);
  };

  const onActionPassword = () => setIsShowPassword(prev => !prev);
  const onFocus = () => inputRef.current?.focus();
  const changeErrorStatus = (status: boolean) => setIsError(status);
  const getErrorStatus = () => isError;
  const changeValue = (val: string) => setInputValue(val);
  const getValue = () => inputValue;
  const clearValue = () => setInputValue('');
  const getLengthCharacter = () => inputValue.length;

  const renderError = () => {
    const isHintError = hintError && inputValue;
    const isHintErrorEmpty = hintErrorEmpty && !inputValue;

    if (isError && (isHintError || isHintErrorEmpty)) {
      return (
        <>
          <RegularText
            children={inputValue ? hintError : hintErrorEmpty}
            style={[styles.textErrorWarning]}
          />
        </>
      );
    }
  };

  const displayColor = (colorDefault?: ColorValue | undefined) => {
    return isError
      ? COLORS.red
      : inputFocus
      ? COLORS.primary
      : colorDefault ?? COLORS.border;
  };

  const renderDisableInput = () => {
    if (isPickerImage && inputValue) {
      return (
        <Image
          resizeMode="cover"
          source={{ uri: inputValue }}
          customStyle={[{ width: moderateScale(60), borderRadius: 8 }]}
        />
      );
    }

    return (
      <RegularText
        children={inputValue || placeHolder}
        style={[styles.textInput, !inputValue && { color: COLORS.border }]}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        inputFocus && !title && styles.shadowFocus,
        { borderColor: displayColor() },
        styles.enabledBorderWidth,
        containerStyle,
      ]}>
      {title && (
        <RegularText
          children={title}
          style={[
            styles.titleStyle,
            { color: displayColor(COLORS.grey) },
            titleStyle,
          ]}
        />
      )}

      <View style={[style]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPressInput}
          style={[
            AppStyles.rowCenterBetween,
            {
              minHeight: moderateVerticalScale(24),
              paddingVertical: moderateScale(16),
            },
          ]}>
          {leftIcon && (
            <Pressable
              style={[{ marginRight: moderateScale(8) }]}
              onPress={onPressLeftInput}>
              <Image source={leftIcon} customStyle={[styles.customStyle]} />
            </Pressable>
          )}

          {isDisabled ? (
            <>{renderDisableInput()}</>
          ) : (
            <TextInput
              ref={inputRef}
              autoCorrect={false}
              placeholder={placeHolder}
              placeholderTextColor={COLORS.border}
              underlineColorAndroid="transparent"
              onChangeText={onChangeText}
              style={[styles.textInput, inputStyle]}
              onFocus={() => {
                setInputFocus(true);
              }}
              value={inputValue}
              onBlur={onBlur}
              onSubmitEditing={onSubmit}
              secureTextEntry={isPassword && !isShowPassword}
              returnKeyType="next"
              // blurOnSubmit={false}
              // textContentType={'oneTimeCode'}
              {...inputProps}
            />
          )}

          <View style={[AppStyles.rowVCenter]}>
            {/* {isError && <SpeedImage source={Images.errorWarning} />} */}

            {rightIcon && (
              <Pressable
                style={[styles.customStyle]}
                onPress={onPressRightInput || onPressInput}>
                <Image source={rightIcon} customStyle={[styles.customStyle]} />
              </Pressable>
            )}

            {isPassword && (
              <TouchableOpacity activeOpacity={0.2} onPress={onActionPassword}>
                <Image
                  source={isShowPassword ? Icons.eyeOpen : Icons.eyeClose}
                  customStyle={[styles.customStyle]}
                />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {renderError()}
      {inputValue && renderCustom && renderCustom()}
    </View>
  );
});

export default Input;
