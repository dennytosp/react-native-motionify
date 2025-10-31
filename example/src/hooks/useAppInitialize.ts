import { useEffect, useState } from 'react';

export default function useAppInitialized() {
  const [appLoadingComplete, setAppLoadingComplete] = useState(false);

  useEffect(() => {
    onAppInitialize();
  }, []);

  const onAppInitialize = async () => {
    try {
      await handleAppInitialize();
    } catch (err) {
      console.log(err);
    } finally {
      setAppLoadingComplete(true);
    }
  };

  const handleAppInitialize = async () => {};

  return { appLoadingComplete };
}
