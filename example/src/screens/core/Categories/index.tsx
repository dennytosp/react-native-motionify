import { useNavigation } from "@react-navigation/native";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";
import { useMotionify } from "react-native-motionify";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { deleteCategory, getCategories } from "@/api/services/category";
import { CategoryResponseModel } from "@/api/types";
import { Header, Icon, Indicator } from "@/components";
import CategoryItem from "@/components/Item/CategoryItem";
import { RegularText } from "@/components/Text";
import { useStateWhenMounted } from "@/hooks";
import { RoutesMainStack, RoutesRootStack } from "@/navigators/routes";
import {
  categoryActions,
  getCategoryState,
} from "@/stores/slices/categorySlice";
import { useAppDispatch, useAppSelector } from "@/stores/types";
import { AppStyles } from "@/styles";
import { translate } from "@/translations/translate";
import { convertToUnsignedString } from "@/utils/helper";
import { moderateScale, moderateVerticalScale } from "@/utils/scale";
import { debounce } from "lodash";
import { styles } from "./style";

type NavigationProps =
  ReactNavigation.RootStackScreenProps<RoutesRootStack.BOTTOM_TAB_STACK>;

const Categories = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps["navigation"]>();
  const dispatch = useAppDispatch();

  const { category } = useAppSelector(getCategoryState);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isLoading, setIsLoading] = useStateWhenMounted(true);
  const currentCategory = useRef<CategoryResponseModel[]>([]);

  const { onScroll } = useMotionify();

  const onGetAPIs = useCallback(async () => {
    if (category.length === 0) {
      await dispatch(getCategories());
    }
    const categoryData = (await dispatch(getCategories())) as PayloadAction<
      CategoryResponseModel[]
    >;
    currentCategory.current = categoryData.payload;

    setIsLoading(false);
  }, [category.length, dispatch, setIsLoading]);

  const findCategories = (key: string) => {
    const keySearch = convertToUnsignedString(key?.toUpperCase());

    const newCategories = currentCategory.current?.filter((i) => {
      const taskName = convertToUnsignedString(i?.name?.toUpperCase());
      return taskName?.includes(keySearch);
    });

    dispatch(categoryActions.onSetCategories(newCategories));
  };

  const onSearch = useCallback(
    debounce((text: string) => {
      findCategories(text);
    }, 500),
    [dispatch]
  );

  const onChangeSearch = useCallback(
    (text: string) => {
      setSearchValue(text);
      onSearch(text);
    },
    [onSearch]
  );

  useEffect(() => {
    onGetAPIs();
  }, [onGetAPIs]);

  const onCreateCategory = () => {
    navigation.navigate(RoutesRootStack.MAIN_STACK, {
      screen: RoutesMainStack.ENTER_CATEGORY,
      params: { isEdit: false },
    });
  };

  const keyExtractor = (item: CategoryResponseModel, index: number) =>
    `categories-tab-${item.id}-${index}`;

  const Item = ({
    item,
    index,
  }: {
    item: CategoryResponseModel;
    index: number;
  }) => {
    const onEdit = () => {
      navigation.navigate(RoutesRootStack.MAIN_STACK, {
        screen: RoutesMainStack.ENTER_CATEGORY,
        params: { isEdit: true, item },
      });
    };

    const onDelete = async () => {
      await dispatch(deleteCategory({ id: item?.id }));
    };

    return (
      <CategoryItem
        item={item}
        index={index}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
  };

  return (
    <View style={[styles.container]}>
      <Header
        hideLeftIcon
        title={translate("taskify.bottomTab.tab3")}
        containerStyle={[{ paddingBottom: moderateVerticalScale(8) }]}
        onPressRight={onCreateCategory}
      />

      <View style={[styles.wrapperSearchInput]}>
        <TextInput
          style={[styles.searchInput]}
          placeholder={translate("taskify.categories.searchPlaceHolder")}
          onChangeText={onChangeSearch}
          value={searchValue}
        />
        {searchValue.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchValue("");
              dispatch(
                categoryActions.onSetCategories(currentCategory.current)
              );
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
        <FlatList
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
          data={category}
          renderItem={Item}
          ItemSeparatorComponent={() => (
            <View style={[{ marginTop: moderateVerticalScale(8) }]} />
          )}
          ListEmptyComponent={() => (
            <View style={[AppStyles.columnCenter]}>
              <RegularText>
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

export default Categories;
