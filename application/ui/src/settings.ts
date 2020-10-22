export interface Settings {
  mode: string;
}

export const loadSettings = (): Settings => {
  const env = process.env;
  return {
    mode: env.REACT_APP_MODE || "prod",
  };
};
