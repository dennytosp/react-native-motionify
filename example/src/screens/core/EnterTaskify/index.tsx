import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { getCategories } from '@/api/services/category';
import { getTasks, postAddTask, putUpdateTask } from '@/api/services/task';
import { Button, Header, Input } from '@/components';
import { InputRef } from '@/components/Input/type';
import { CategorySelectItem } from '@/components/Item';
import { Modal, ModalRef } from '@/components/Modal';
import { RegularText } from '@/components/Text';
import { RoutesRootStack } from '@/navigators/routes';
import { EnterTaskifyParams } from '@/navigators/stack/main';
import { getCategoryState } from '@/stores/slices/categorySlice';
import { useAppDispatch, useAppSelector } from '@/stores/types';
import { translate } from '@/translations/translate';
import { styles } from './style';

type NavigationProps =
  ReactNavigation.RootStackScreenProps<RoutesRootStack.MAIN_STACK>;

const EnterTaskify = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProps['navigation']>();
  const route = useRoute<NavigationProps['route']>();
  const params = route.params as unknown as EnterTaskifyParams;
  const { isEdit } = params;

  const { category } = useAppSelector(getCategoryState);

  const nameTaskRef = useRef<InputRef>(null);
  const categoryNameRef = useRef<InputRef>(null);
  const listCategoriesModalRef = useRef<ModalRef>(null);

  useEffect(() => {
    if (isEdit && params?.item) {
      nameTaskRef.current?.changeValue(params.item.name);
      categoryNameRef.current?.changeValue(params.item.category);
    }

    if (category.length === 0) {
      dispatch(getCategories());
    }
  }, []);

  const handleButton = async () => {
    if (isEdit) {
      await dispatch(
        putUpdateTask({
          id: String(params?.item?.id),
          name: nameTaskRef.current?.getValue(),
          category: categoryNameRef.current?.getValue(),
        }),
      );
    } else {
      await dispatch(
        postAddTask({
          id: '$datatype.uuid',
          name: nameTaskRef.current?.getValue(),
          category: categoryNameRef.current?.getValue(),
          createdAt: moment().format(),
          isChecked: false,
        }),
      );
    }

    await dispatch(getTasks());
    navigation.goBack();
  };

  const onSelectCategory = (name: string) => {
    listCategoriesModalRef.current?.hideModal();
    categoryNameRef.current?.changeValue(name);
  };

  const renderHeader = () => (
    <View style={[styles.wrapHeader]}>
      <RegularText style={[styles.textContent]}>
        {translate(
          isEdit
            ? 'taskify.enterTaskify.updateTaskSubtitle'
            : 'taskify.enterTaskify.createTaskSubtitle',
        )}
      </RegularText>
    </View>
  );

  const renderForm = () => (
    <View style={[]}>
      <Input
        ref={nameTaskRef}
        isRequired={true}
        placeHolder={translate('taskify.random.readingBook')}
        inputProps={{ maxLength: 200 }}
        title={translate('taskify.common.nameTask')}
      />
      <Input
        ref={categoryNameRef}
        isRequired={true}
        placeHolder={translate('taskify.random.work')}
        inputProps={{ maxLength: 200 }}
        title={translate('taskify.categories.categoryName')}
        isUsingModal={true}
        onPressInput={() => listCategoriesModalRef.current?.showModal()}
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

  return (
    <View style={[styles.container]}>
      <Header
        title={translate(
          isEdit ? 'taskify.common.updateTask' : 'taskify.common.createTask',
        )}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        {renderHeader()}
        {renderForm()}
        {renderButton()}
      </ScrollView>

      <Modal
        ref={listCategoriesModalRef}
        children={() => (
          <CategorySelectItem
            category={category}
            onPress={onSelectCategory}
            onPressLeftHeader={() =>
              listCategoriesModalRef.current?.hideModal()
            }
          />
        )}
        isScroll={true}
        isFullScreen={true}
        style={[{ paddingVertical: 0 }]}
      />
    </View>
  );
};

export default EnterTaskify;
