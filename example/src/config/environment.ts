export enum EnvName {
  DEV = 'DEV',
  FAKE = 'FAKE',
}

export type EnvType = 'DEV' | 'FAKE';

export const initEnv: EnvType = EnvName.DEV;

const Config = {
  DEV: {
    APP_ENV: 'DEV',
    API_URL: 'https://663d91e0e1913c476794a5f6.mockapi.io/taskify/',
  },
  FAKE: {
    APP_ENV: 'FAKE',
    API_URL: 'https://664080d9a7500fcf1a9df02a.mockapi.io/taskify/',
  },
};

export const dynamicEnv = (env: EnvType) => {
  return Config[env];
};

export default Config[initEnv];
