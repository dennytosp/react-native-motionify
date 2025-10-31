import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

import { CategoryResponseModel } from '@/api/types';
import { Image } from '@/components/Image';
import ScrollModalContainer from '@/components/ScrollModalContainer';
import { moderateScale } from '@/utils/scale';
import { styles } from './style';
import { filterUniqueArray } from '@/utils/helper';

interface Props {
  onPress: (label: string) => void;
  onPressLeftHeader: () => void;
  category: CategoryResponseModel[];
}

const CategoryImagesItem = (props: Props) => {
  const { category, onPress, onPressLeftHeader } = props;
  const numColumns = 2;

  const uniqueCategoryImages = filterUniqueArray(category, 'image');

  return (
    <ScrollModalContainer onPressLeftHeader={onPressLeftHeader}>
      <FlatList
        data={uniqueCategoryImages}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        keyExtractor={(item, index) => `catalog-image-${item.id}`}
        contentContainerStyle={{ alignSelf: 'center' }}
        columnWrapperStyle={[{ gap: moderateScale(8) }]}
        ItemSeparatorComponent={() => (
          <View style={[{ marginBottom: moderateScale(8) }]} />
        )}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={'category-' + item.id}
              style={[styles.wrapContent]}
              onPress={() => onPress(item.image)}>
              <Image
                resizeMode="cover"
                source={{ uri: item.image }}
                style={[styles.image]}
              />
            </TouchableOpacity>
          );
        }}
      />
    </ScrollModalContainer>
  );
};

export default CategoryImagesItem;
