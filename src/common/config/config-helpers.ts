export const throwIfNotPresent = (value: string | null | undefined, configKey: string) => {
  if (!value || value.trim().length === 0) {
    throw new Error(`Configuration item ${configKey} was not provided with a value`);
  }
  return value;
};

export const getEnvSecretName = (name: string | undefined) => {
  if (!name || name.trim().length === 0) {
    throw new Error('Secret name was not provided with a value');
  }
  return name;
};
