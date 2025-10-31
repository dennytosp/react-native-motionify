import { createRef } from 'react';
import { ShowHideRef } from '@/types/ref';

const appLoaderHolder = createRef<ShowHideRef>();

const showAppLoader = () => {
  appLoaderHolder.current?.show();
};

const hideAppLoader = () => {
  appLoaderHolder.current?.hide();
};

export { appLoaderHolder, hideAppLoader, showAppLoader };
