import React, { useRef } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Button, Header, Input } from '@/components';
import { InputRef } from '@/components/Input/type';
import { RegularText, SemiBoldText } from '@/components/Text';
import { RoutesAuthStack, RoutesRootStack } from '@/navigators/routes';
import { AppStyles } from '@/styles';
import { translate } from '@/translations/translate';
import { styles } from './style';

type NavigationProps =
  ReactNavigation.RootStackScreenProps<RoutesRootStack.AUTH_STACK>;

const ForgotPassword = () => {
  const navigation = useNavigation<NavigationProps['navigation']>();

  const emailRef = useRef<InputRef>(null);

  const handleVerify = () => {
    console.log('Pressed Verify');
  };

  const onNavigateSignIn = () => {
    navigation.navigate(RoutesRootStack.AUTH_STACK, {
      screen: RoutesAuthStack.SIGN_IN,
    });
  };

  const renderHeader = () => (
    <View style={[styles.wrapHeader]}>
      <RegularText style={[styles.textContent]}>
        {translate('taskify.auth.pleaseVerifyYourEmail')}
      </RegularText>
    </View>
  );

  const renderForm = () => (
    <View style={[]}>
      <Input
        ref={emailRef}
        isRequired={true}
        placeHolder={'jonathan@example.com'}
        inputProps={{ keyboardType: 'email-address', maxLength: 75 }}
        title={translate('taskify.auth.emailAddress')}
        containerStyle={[{ marginBottom: 0 }]}
      />
    </View>
  );

  const renderButton = () => (
    <Button
      title={translate('taskify.auth.verify')}
      style={[styles.button]}
      onPress={handleVerify}
    />
  );

  const renderFooter = () => (
    <View style={[AppStyles.rowCenter]}>
      <RegularText style={[styles.textDidYouRemember]}>
        {translate('taskify.auth.didYouRememberThePassword')}
      </RegularText>
      <TouchableOpacity onPress={onNavigateSignIn}>
        <SemiBoldText style={[styles.textSignIn]}>
          {` ${translate('taskify.auth.signIn')}`}
        </SemiBoldText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container]}>
      <Header title={translate('taskify.auth.forgotPassword')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        {renderHeader()}
        {renderForm()}
        {renderButton()}
        {renderFooter()}
      </ScrollView>
    </View>
  );
};

export default ForgotPassword;
