import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Image, Input } from '@/components';
import { InputRef } from '@/components/Input/type';
import { BoldText, RegularText, SemiBoldText } from '@/components/Text';
import { RoutesAuthStack, RoutesRootStack } from '@/navigators/routes';
import { AppStyles } from '@/styles';
import { Icons } from '@/theme';
import { translate } from '@/translations/translate';
import { isIos } from '@/utils/device';
import { moderateScale } from '@/utils/scale';
import { styles } from './style';

type NavigationProps =
  ReactNavigation.RootStackScreenProps<RoutesRootStack.AUTH_STACK>;

const SignUp = () => {
  const navigation = useNavigation<NavigationProps['navigation']>();
  const insets = useSafeAreaInsets();

  const fullNameRef = useRef<InputRef>(null);
  const emailRef = useRef<InputRef>(null);
  const passwordRef = useRef<InputRef>(null);
  const confirmPasswordRef = useRef<InputRef>(null);

  const handleSignUp = () => {
    console.log('Pressed Sign Up');
  };

  const handleGoogle = () => {
    console.log('Pressed Google');
  };

  const handleFacebook = () => {
    console.log('Pressed Facebook');
  };

  const onNavigateForgotPassword = () => {
    navigation.navigate(RoutesRootStack.AUTH_STACK, {
      screen: RoutesAuthStack.FORGOT_PASSWORD,
    });
  };

  const onNavigateSignIn = () => {
    navigation.navigate(RoutesRootStack.AUTH_STACK, {
      screen: RoutesAuthStack.SIGN_IN,
    });
  };

  const renderHeader = () => (
    <View
      style={[
        styles.wrapHeader,
        { paddingTop: isIos ? insets.top : moderateScale(32) },
      ]}>
      <Image source={Icons.logo} customStyle={[{ width: moderateScale(80) }]} />
      <View style={[AppStyles.rowVCenter]}>
        <RegularText style={[styles.textTitle]}>
          {translate('taskify.auth.createYour')}
        </RegularText>

        <BoldText style={[styles.textTitle, { textTransform: 'lowercase' }]}>
          {` ${translate('taskify.auth.account')}`}
        </BoldText>
      </View>

      <RegularText style={[styles.textSubtitle]}>
        {translate('taskify.common.slogan')}
      </RegularText>
    </View>
  );

  const renderForm = () => (
    <View style={[]}>
      <Input
        ref={fullNameRef}
        isRequired={true}
        placeHolder={translate('taskify.auth.enterFullName')}
        containerStyle={[{ marginTop: moderateScale(24) }]}
        inputProps={{ maxLength: 75 }}
        title={translate('taskify.auth.fullName')}
      />
      <Input
        ref={emailRef}
        isRequired={true}
        placeHolder={translate('taskify.auth.enterEmail')}
        inputProps={{ keyboardType: 'email-address', maxLength: 75 }}
        title={translate('taskify.auth.emailAddress')}
      />
      <Input
        ref={passwordRef}
        isRequired={true}
        placeHolder={translate('taskify.auth.enterPassword')}
        inputProps={{ textContentType: 'oneTimeCode', maxLength: 50 }}
        isPassword={true}
        title={translate('taskify.auth.password')}
      />
      <Input
        ref={confirmPasswordRef}
        isRequired={true}
        placeHolder={translate('taskify.auth.enterConfirmPassword')}
        inputProps={{ textContentType: 'oneTimeCode', maxLength: 50 }}
        containerStyle={[{ marginBottom: 0 }]}
        isPassword={true}
        title={translate('taskify.auth.confirmPassword')}
      />
    </View>
  );

  const renderButton = () => (
    <Button
      title={translate('taskify.auth.signUp')}
      style={[styles.button]}
      onPress={handleSignUp}
    />
  );

  const renderForgotPassword = () => (
    <TouchableOpacity
      onPress={onNavigateForgotPassword}
      style={[styles.wrapForgotPassword]}>
      <SemiBoldText style={[styles.textForgotPassword]}>
        {`${translate('taskify.auth.forgotPassword')}?`}
      </SemiBoldText>
    </TouchableOpacity>
  );

  const renderOrLine = () => (
    <View style={[styles.wrapOr]}>
      <View style={[styles.line]} />
      <RegularText style={[styles.textOr]}>
        {translate('taskify.auth.or')}
      </RegularText>
      <View style={[styles.line]} />
    </View>
  );

  const renderSocialButton = () => (
    <View style={[AppStyles.rowCenter, { marginBottom: moderateScale(40) }]}>
      <TouchableOpacity
        onPress={handleGoogle}
        style={[styles.touchSocialButton]}>
        <Image source={Icons.google} customStyle={[styles.iconSocial]} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleFacebook}
        style={[styles.touchSocialButton, { marginLeft: moderateScale(32) }]}>
        <Image source={Icons.facebook} customStyle={[styles.iconSocial]} />
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={[AppStyles.rowCenter]}>
      <RegularText style={[styles.textAlreadyHaveAnAccount]}>
        {translate('taskify.auth.alreadyHaveAnAccount')}
      </RegularText>
      <TouchableOpacity onPress={onNavigateSignIn}>
        <SemiBoldText style={[styles.textSignUp]}>
          {` ${translate('taskify.auth.signIn')}`}
        </SemiBoldText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container]}>
      {renderHeader()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={[
          {
            paddingBottom: insets.bottom,
          },
        ]}>
        {renderForm()}
        {renderForgotPassword()}
        {renderButton()}
        {renderOrLine()}
        {renderSocialButton()}
        {renderFooter()}
      </ScrollView>
    </View>
  );
};

export default SignUp;
