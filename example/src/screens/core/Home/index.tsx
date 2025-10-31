import { RoutesMainStack, RoutesRootStack } from "@/navigators/routes";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated as Animation,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMotionify } from "react-native-motionify";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { deleteTask } from "@/api/services/task";
import { getTasks } from "@/api/services/task/get-tasks";
import { TaskResponseModel } from "@/api/types";
import { Header, Icon, Indicator } from "@/components";
import { TaskItem } from "@/components/Item";
import { RegularText, SemiBoldText } from "@/components/Text";
import { useStateWhenMounted } from "@/hooks";
import { getTaskState, taskActions } from "@/stores/slices";
import { useAppDispatch, useAppSelector } from "@/stores/types";
import { AppStyles } from "@/styles";
import { translate } from "@/translations/translate";
import { convertToUnsignedString, getGreeting } from "@/utils/helper";
import { moderateScale, moderateVerticalScale } from "@/utils/scale";
import { PayloadAction } from "@reduxjs/toolkit";
import { debounce } from "lodash";
import { styles } from "./style";

type NavigationProps =
  ReactNavigation.RootStackScreenProps<RoutesRootStack.BOTTOM_TAB_STACK>;

const Home = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps["navigation"]>();
  const dispatch = useAppDispatch();

  const { task } = useAppSelector(getTaskState);
  const greeting = getGreeting("Mad Dinh");

  const { onScroll } = useMotionify();

  const [searchValue, setSearchValue] = useState<string>("");
  const [isLoading, setIsLoading] = useStateWhenMounted(true);
  const previousTasks = useRef<TaskResponseModel[]>([]);

  const onGetAPIs = useCallback(async () => {
    const taskData = (await dispatch(getTasks())) as PayloadAction<
      TaskResponseModel[]
    >;
    previousTasks.current = taskData.payload;
    setIsLoading(false);
  }, [dispatch, setIsLoading]);

  useEffect(() => {
    onGetAPIs();
  }, [onGetAPIs]);

  const findTasks = (key: string) => {
    const keySearch = convertToUnsignedString(key?.toUpperCase());

    const newTasks = previousTasks.current?.filter((i) => {
      const taskName = convertToUnsignedString(i?.name?.toUpperCase());
      return taskName?.includes(keySearch);
    });

    dispatch(taskActions.onSetTask(newTasks));
  };

  const onSearch = useCallback(
    debounce((text: string) => {
      findTasks(text);
    }, 500),
    [dispatch]
  );

  const onChangeSearch = (text: string) => {
    setSearchValue(text);
    onSearch(text);
  };

  const onCreateTask = () => {
    navigation.navigate(RoutesRootStack.MAIN_STACK, {
      screen: RoutesMainStack.ENTER_TASKIFY,
      params: { isEdit: false },
    });
  };

  const keyExtractor = (item: TaskResponseModel, index: number) =>
    `home-tab-${item.id}-${index}`;

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
      <TaskItem item={item} index={index} onDelete={onDelete} onEdit={onEdit} />
    );
  };

  return (
    <View style={[styles.container]}>
      <Header
        hideLeftIcon
        title={greeting}
        containerStyle={[{ paddingBottom: moderateVerticalScale(8) }]}
        onPressRight={onCreateTask}
      />
      <SemiBoldText style={[styles.textCurrentTime]}>
        {`${translate("taskify.home.itsTime", {
          time: moment().format("dddd, MMMM D YYYY"),
          countTasks: task.length,
        })}`}
      </SemiBoldText>

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
              dispatch(taskActions.onSetTask(previousTasks.current));
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

      <Indicator visible={isLoading}>
        <Animation.FlatList
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          data={task}
          extraData={task}
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
          contentContainerStyle={[
            { paddingBottom: insets.bottom + moderateVerticalScale(16) },
          ]}
          keyExtractor={keyExtractor}
        />
      </Indicator>
    </View>
  );
};

export default Home;
