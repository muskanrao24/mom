import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Config = {
  sender_name?: string;
  welcome_message?: string;
  greetings_text?: string;
  sub_greetings_text?: string;
  background_color?: string;
};

type ConfigKey = keyof Config;

interface ConfigContextType {
  get: <T extends ConfigKey>(
    key: T,
    fallback: NonNullable<Config[T]>
  ) => NonNullable<Config[T]>;
  set: <T extends ConfigKey>(key: T, value: NonNullable<Config[T]>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<Config>(() => {
    if (typeof window !== "undefined") {
      const keys: ConfigKey[] = [
        "sender_name",
        "welcome_message",
        "background_color",
      ];
      const result: Config = {};
      keys.forEach((key) => {
        const value = localStorage.getItem(`app_config_${key}`);
        if (value !== null) result[key] = value;
      });
      return result;
    }
    return {};
  });

  const get = <T extends ConfigKey>(
    key: T,
    fallback: NonNullable<Config[T]>
  ): NonNullable<Config[T]> => {
    return (config[key] ?? fallback) as NonNullable<Config[T]>;
  };

  const set = <T extends ConfigKey>(key: T, value: NonNullable<Config[T]>) => {
    localStorage.setItem(`app_config_${key}`, value);
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-expect-error TypeScript doesn't know about window.setContext and window.getContext
      window.setContext = <T extends ConfigKey>(
        key: T,
        value: NonNullable<Config[T]>
      ) => {
        set(key, value);
      };

      // @ts-expect-error TypeScript doesn't know about window.setContext and window.getContext
      window.getContext = <T extends ConfigKey>(
        key: T,
        fallback: NonNullable<Config[T]>
      ): NonNullable<Config[T]> => {
        return get(key, fallback);
      };
    }
  }, [config]);

  return (
    <ConfigContext.Provider value={{ get, set }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
