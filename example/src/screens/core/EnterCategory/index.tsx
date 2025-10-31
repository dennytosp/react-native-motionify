import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  getCategories,
  postAddCategory,
  putUpdateCategory,
} from '@/api/services/category';
import { Button, Header, Input, Modal } from '@/components';
import { InputRef } from '@/components/Input/type';
import { CategoryImagesItem } from '@/components/Item';
import { ModalRef } from '@/components/Modal';
import { RegularText } from '@/components/Text';
import { RoutesRootStack } from '@/navigators/routes';
import { EnterCategoryParams } from '@/navigators/stack/main';
import { getCategoryState } from '@/stores/slices/categorySlice';
import { useAppDispatch, useAppSelector } from '@/stores/types';
import { AppStyles } from '@/styles';
import { translate } from '@/translations/translate';
import { styles } from './style';

type NavigationProps =
  ReactNavigation.RootStackScreenProps<RoutesRootStack.MAIN_STACK>;

const EnterCategory = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProps['navigation']>();
  const route = useRoute<NavigationProps['route']>();
  const params = route.params as unknown as EnterCategoryParams;
  const { isEdit } = params;

  const { category } = useAppSelector(getCategoryState);

  const categoryNameRef = useRef<InputRef>(null);
  const categoryImagesRef = useRef<InputRef>(null);
  const listCategoryImagesRef = useRef<ModalRef>(null);

  useEffect(() => {
    if (isEdit && params?.item) {
      categoryNameRef.current?.changeValue(params.item.name);
      categoryImagesRef.current?.changeValue(params.item.image);
    }

    if (category.length === 0) {
      dispatch(getCategories());
    }
  }, []);

  const handleButton = async () => {
    if (isEdit) {
      await dispatch(
        putUpdateCategory({
          id: String(params?.item?.id),
          name: categoryNameRef.current?.getValue(),
          image: categoryImagesRef.current?.getValue(),
        }),
      );
    } else {
      await dispatch(
        postAddCategory({
          id: '$datatype.uuid',
          name: categoryNameRef.current?.getValue(),
          createdAt: moment().format(),
          image: categoryImagesRef.current?.getValue(),
        }),
      );
    }

    navigation.goBack();
  };

  const onShowListCategoryImage = () => {
    listCategoryImagesRef.current?.showModal();
  };

  const onSelectCategoryImage = (image: string) => {
    listCategoryImagesRef.current?.hideModal();
    categoryImagesRef.current?.changeValue(image);
  };

  const renderHeader = () => (
    <View style={[styles.wrapHeader]}>
      <RegularText style={[styles.textContent]}>
        {translate(
          isEdit
            ? 'taskify.categories.updateCategorySubtitle'
            : 'taskify.categories.createCategorySubtitle',
        )}
      </RegularText>
    </View>
  );

  const renderForm = () => (
    <View style={[]}>
      <Input
        ref={categoryNameRef}
        isRequired={true}
        placeHolder={translate('taskify.random.work')}
        inputProps={{ maxLength: 200 }}
        title={translate('taskify.categories.categoryName')}
      />
      <Input
        ref={categoryImagesRef}
        isRequired={true}
        placeHolder={translate('taskify.common.chooseCategoryImage')}
        inputProps={{ maxLength: 200 }}
        isPickerImage={true}
        isUsingModal={true}
        onPressInput={onShowListCategoryImage}
        title={translate('taskify.common.categoryImage')}
        containerStyle={[{ marginBottom: 0 }]}
      />
    </View>
  );

  const renderButton = () => (
    <Button
      title={translate(isEdit ? 'system.edit' : 'system.create')}
      style={[styles.button]}
      onPress={handleButton}
    />
  );

  const renderFooter = () => (
    <View style={[AppStyles.rowCenter, { flex: 1 }]}>
      <RegularText style={[styles.textDidYouRemember]}>
        {translate('taskify.common.slogan')}
      </RegularText>
    </View>
  );

  return (
    <View style={[styles.container]}>
      <Header
        title={translate(
          isEdit
            ? 'taskify.categories.updateCategory'
            : 'taskify.categories.createCategory',
        )}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        {renderHeader()}
        {renderForm()}
        {renderButton()}
        {renderFooter()}
      </ScrollView>

      <Modal
        ref={listCategoryImagesRef}
        children={() => (
          <CategoryImagesItem
            category={category}
            onPress={onSelectCategoryImage}
            onPressLeftHeader={() => listCategoryImagesRef.current?.hideModal()}
          />
        )}
        isScroll={true}
        isFullScreen={true}
        style={[{ paddingVertical: 0 }]}
      />
    </View>
  );
};

export default EnterCategory;
