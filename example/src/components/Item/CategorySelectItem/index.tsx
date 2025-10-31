import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';

import { CategoryResponseModel } from '@/api/types';
import { Image } from '@/components/Image';
import ScrollModalContainer from '@/components/ScrollModalContainer';
import { RegularText } from '@/components/Text';
import { useAppDispatch } from '@/stores/types';
import { moderateScale } from '@/utils/scale';
import { styles } from './style';

interface Props {
  onPress: (label: string) => void;
  onPressLeftHeader: () => void;
  category: CategoryResponseModel[];
}

const CategorySelectItem = (props: Props) => {
  const { category, onPress, onPressLeftHeader } = props;
  const dispatch = useAppDispatch();

  return (
    <ScrollModalContainer onPressLeftHeader={onPressLeftHeader}>
      <FlatList
        data={category}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `category-${item.id}`}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={'category-' + item.id}
              style={[styles.wrapContent]}
              onPress={() => onPress(item.name)}>
              <Image
                source={{ uri: item.image }}
                customStyle={[
                  { marginRight: moderateScale(8), borderRadius: 8 },
                ]}
              />
              <RegularText children={item.name} style={[styles.textContent]} />
            </TouchableOpacity>
          );
        }}
      />
    </ScrollModalContainer>
  );
};

export default CategorySelectItem;
