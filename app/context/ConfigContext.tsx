import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export const ConfigKeys = [
  "sender_name",
  "welcome_message",
  "greetings_text",
  "sub_greetings_text",
  "background_color",
] as const;

type Config = {
  [K in (typeof ConfigKeys)[number]]: string | undefined;
};

type ConfigKey = (typeof ConfigKeys)[number];

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
      // Get all keys from localStorage
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith("app_config_")
      );
      // Map the keys to their corresponding values
      const result: Config = {} as Config;
      keys.forEach((key) => {
        const configKey = key.replace("app_config_", "") as ConfigKey;
        const value = localStorage.getItem(key);
        if (value) {
          result[configKey] = value;
        }
      });
      return result;
    }
    return {} as Config;
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
