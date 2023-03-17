import { lightbulb } from '../types';

export type performance = {
  lightbulbs: lightbulb[];
  config: {
    hubIP?: string;
    minActive: number;
    maxActive: number;
  };
  notifications: {
    clickHubButton: boolean;
  };
  isConnected: boolean;
  isConnecting: boolean;
};

export const INITIAL_STATE: performance = {
  lightbulbs: [],
  config: {
    minActive: 1,
    maxActive: 4,
  },
  notifications: {
    clickHubButton: false,
  },
  isConnected: false,
  isConnecting: false,
};

export const ACTIONS = {
  ADD_LIGHTBULB: 'ADD_LIGHTBULB',
  SET_LIGHTBULB_STATE: 'SET_LIGHTBULB_STATE',
  SET_LIGHTBULB_NAME: 'SET_LIGHTBULB_NAME',
  SET_HUB_IP: 'SET_HUB_IP',
  SET_MIN_ACTIVE: 'SET_MIN_ACTIVE',
  SET_MAX_ACTIVE: 'SET_MAX_ACTIVE',
  SET_IS_CONNECTED: 'SET_IS_CONNECTED',
  SET_IS_CONNECTING: 'SET_IS_CONNECTING',
};

export const performanceReducer = (
  state: performance,
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case ACTIONS.ADD_LIGHTBULB:
      for (let i = 0; i < state.lightbulbs.length; i++) {
        if (state.lightbulbs[i].id === action.payload.id) {
          return state;
        }
      }

      return {
        ...state,
        lightbulbs: [...state.lightbulbs, action.payload],
      };
    case ACTIONS.SET_LIGHTBULB_STATE:
      return {
        ...state,
        lightbulbs: state.lightbulbs.map((lightbulb) => {
          if (lightbulb.id === action.payload.id) {
            lightbulb.state = action.payload.state;
          }
          return lightbulb;
        }),
      };
    case ACTIONS.SET_LIGHTBULB_NAME:
      return {
        ...state,
        lightbulbs: state.lightbulbs.map((lightbulb) => {
          if (lightbulb.id === action.payload.id) {
            lightbulb.name = action.payload.name;
          }
          return lightbulb;
        }),
      };
    case ACTIONS.SET_HUB_IP:
      return {
        ...state,
        config: {
          ...state.config,
          hubIP: action.payload,
        },
      };
    case ACTIONS.SET_MIN_ACTIVE:
      return {
        ...state,
        config: {
          ...state.config,
          minActive: action.payload,
        },
      };
    case ACTIONS.SET_MAX_ACTIVE:
      return {
        ...state,
        config: {
          ...state.config,
          maxActive: action.payload,
        },
      };
    case ACTIONS.SET_IS_CONNECTED:
      return {
        ...state,
        isConnected: action.payload,
      };
    case ACTIONS.SET_IS_CONNECTING:
      return {
        ...state,
        isConnecting: action.payload,
      };
    default:
      return state;
  }
};
