import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import { putUpdateTask } from '@/api/services/task';
import { TaskResponseModel } from '@/api/types';
import { CheckBox } from '@/components';
import Icon from '@/components/Icon';
import { RegularText } from '@/components/Text';
import { useAppDispatch } from '@/stores/types';
import { AppStyles } from '@/styles';
import { COLORS, FONTS } from '@/theme';
import { translate } from '@/translations/translate';
import { moderateScale } from '@/utils/scale';
import { PayloadAction } from '@reduxjs/toolkit';
import { debounce } from 'lodash';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { styles } from './style';

interface ITaskItemProps {
  item: TaskResponseModel;
  index: number;
  onEdit?: () => void;
  onDelete?: () => void;
  disable?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TaskItem: FC<ITaskItemProps> = ({
  item,
  index,
  onEdit,
  onDelete,
  disable,
  style,
}) => {
  const dispatch = useAppDispatch();
  const [isCheck, setIsCheck] = useState<boolean>(Boolean(item?.isChecked));
  const previousValueRef = useRef<boolean>(isCheck);

  const DATA_DROP_DOWN = [
    { name: translate('system.edit'), onSelect: onEdit },
    { name: translate('system.delete'), onSelect: onDelete },
  ];

  useEffect(() => {
    debounceCheckBox(isCheck);
  }, [previousValueRef, isCheck]);

  const debounceCheckBox = useCallback(
    debounce(async (isCheck: boolean) => {
      if (previousValueRef.current !== isCheck) {
        try {
          const result = await dispatch(
            putUpdateTask({ id: item.id, isChecked: isCheck }),
          );
          previousValueRef.current = isCheck;
          return result as PayloadAction<TaskResponseModel>;
        } catch (error) {
          setIsCheck(previousValueRef.current);
        }
      }
    }, 500),
    [],
  );

  const onCheckBox = useCallback(() => {
    setIsCheck(prevCheck => !prevCheck);
  }, []);

  const DropDown = useCallback(
    () => (
      <Icon type={'Feather'} name={'more-vertical'} size={moderateScale(16)} />
    ),
    [],
  );

  const MenuItem = useCallback(
    () => (
      <>
        {DATA_DROP_DOWN.map((dropDownItem, dropDownIndex) => (
          <MenuOption
            key={`drop-down-${item.createdAt}-${dropDownIndex}`}
            onSelect={dropDownItem.onSelect}
            text={dropDownItem.name}
          />
        ))}
      </>
    ),
    [],
  );

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.wrapperTaskifyItem, style]}>
      <View style={[AppStyles.rowVCenter]}>
        <View style={[styles.checkBox]}>
          <CheckBox disable={disable} value={isCheck} onChange={onCheckBox} />
          {/* <RegularText onPress={onCheckBox}> {`${isCheck ? 'Allow' : 'Denied'}  `}</RegularText> */}
        </View>
        <RegularText
          style={[
            styles.textLabelTaskify,
            isCheck && { textDecorationLine: 'line-through' },
          ]}>
          {item.name}
        </RegularText>
      </View>

      <Menu renderer={renderers.ContextMenu}>
        <MenuTrigger>
          <DropDown />
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: { borderRadius: 16 },
            optionsWrapper: { padding: moderateScale(8) },
            optionWrapper: { padding: moderateScale(8) },
            optionText: {
              fontFamily: FONTS.regular,
              color: COLORS.text,
              fontSize: moderateScale(12),
            },
          }}>
          <MenuItem />
        </MenuOptions>
      </Menu>
    </Animated.View>
  );
};

export default TaskItem;
