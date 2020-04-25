import { useEffect, useState } from "react";
import { AsyncStorage } from "react-native";

const useAsyncStoragePersistedState = (persistedName, defaultValue) => {
  const [initialized, setInitialized] = useState(false);
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem(persistedName);
      if (value) {
        setValue(JSON.parse(value));
      }
      setInitialized(true);
    })();
  }, [setInitialized, setValue]);

  const setAndPersistValue = async (value) => {
    setValue(value);
    await AsyncStorage.setItem(persistedName, JSON.stringify(value));
  };

  return [initialized, value, setAndPersistValue];
};

export default useAsyncStoragePersistedState;
