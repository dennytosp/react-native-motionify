import { RoutesMainStack, RoutesRootStack } from "@/navigators/routes";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { deleteTask } from "@/api/services/task";
import { TaskResponseModel } from "@/api/types";
import { Header, Icon, Indicator } from "@/components";
import { TaskItem } from "@/components/Item";
import { RegularText } from "@/components/Text";
import { getTaskState } from "@/stores/slices";
import { useAppDispatch, useAppSelector } from "@/stores/types";
import { AppStyles } from "@/styles";
import { translate } from "@/translations/translate";
import { convertToUnsignedString } from "@/utils/helper";
import { moderateScale, moderateVerticalScale } from "@/utils/scale";
import { useMotionify } from "react-native-motionify";
import { styles } from "./style";

type NavigationProps =
  ReactNavigation.RootStackScreenProps<RoutesRootStack.BOTTOM_TAB_STACK>;

const Completed = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps["navigation"]>();
  const dispatch = useAppDispatch();

  const { task } = useAppSelector(getTaskState);
  const completedTasks = task?.filter((item) => item.isChecked);

  const [searchValue, setSearchValue] = useState<string>("");

  // Reactive scroll integration
  const { onScroll } = useMotionify();

  const filteredCompletedTasks = completedTasks.filter((i) => {
    const taskName = convertToUnsignedString(i?.name?.toUpperCase());
    return taskName.includes(
      convertToUnsignedString(searchValue.toUpperCase())
    );
  });

  const onChangeSearch = useCallback((text: string) => {
    setSearchValue(text);
  }, []);

  const onCreateTask = () => {
    navigation.navigate(RoutesRootStack.MAIN_STACK, {
      screen: RoutesMainStack.ENTER_TASKIFY,
      params: { isEdit: false },
    });
  };

  const keyExtractor = useCallback(
    (item: TaskResponseModel) => `completed-tab-${item.id}`,
    []
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: TaskResponseModel;
    index: number;
  }) => {
    const onEdit = () => {
      navigation.navigate(RoutesRootStack.MAIN_STACK, {
        screen: RoutesMainStack.ENTER_TASKIFY,
        params: { isEdit: true, item },
      });
    };

    const onDelete = async () => {
      await dispatch(deleteTask({ id: item?.id }));
    };

    return (
      <TaskItem
        item={item}
        index={index}
        onDelete={onDelete}
        onEdit={onEdit}
        disable={true}
      />
    );
  };

  return (
    <View style={[styles.container]}>
      <Header
        hideLeftIcon
        title={translate("taskify.bottomTab.tab2")}
        containerStyle={[{ paddingBottom: moderateVerticalScale(8) }]}
        onPressRight={onCreateTask}
      />

      <View style={[styles.wrapperSearchInput]}>
        <TextInput
          style={[styles.searchInput]}
          placeholder={translate("taskify.home.searchPlaceHolder")}
          onChangeText={onChangeSearch}
          value={searchValue}
        />
        {searchValue.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchValue("");
            }}
          >
            <Icon
              type={"Ionicons"}
              name={"close-outline"}
              size={moderateScale(16)}
            />
          </TouchableOpacity>
        )}
      </View>

      <Indicator visible={false}>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
          data={filteredCompletedTasks}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View style={[{ marginTop: moderateVerticalScale(8) }]} />
          )}
          ListEmptyComponent={() => (
            <View style={[AppStyles.columnCenter]}>
              <RegularText style={[{ fontSize: 14 }]}>
                {translate("taskify.common.dataIsEmpty")}
              </RegularText>
            </View>
          )}
          style={[{ marginTop: moderateScale(16) }]}
          contentContainerStyle={[{ paddingBottom: insets.bottom * 4 }]}
          keyExtractor={keyExtractor}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      </Indicator>
    </View>
  );
};

export default Completed;
