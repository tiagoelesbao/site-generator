// src/context/SiteContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial da aplicação
const initialState = {
  formData: {
    empresa: '',
    razaoSocial: '',
    cnpj: '',
    endereco: '',
    email: '',
    emailLGPD: '',
    telefone: '',
    dominio: '',
    tituloHero: '',
    subtituloHero: '',
    servico1Nome: '',
    servico1Desc: '',
    servico2Nome: '',
    servico2Desc: '',
    servico3Nome: '',
    servico3Desc: '',
    quemSomos: ''
  },
  heroImage: null,
  isGenerating: false,
  isGenerated: false,
  generationError: null,
  publishResult: null,
  isPublishing: false,
  zipBlob: null,
  logs: []
};

// Tipos de ações para o reducer
const ACTION_TYPES = {
  UPDATE_FORM_DATA: 'UPDATE_FORM_DATA',
  SET_HERO_IMAGE: 'SET_HERO_IMAGE',
  SET_IS_GENERATING: 'SET_IS_GENERATING',
  SET_IS_GENERATED: 'SET_IS_GENERATED',
  SET_GENERATION_ERROR: 'SET_GENERATION_ERROR',
  SET_PUBLISH_RESULT: 'SET_PUBLISH_RESULT',
  SET_IS_PUBLISHING: 'SET_IS_PUBLISHING',
  SET_ZIP_BLOB: 'SET_ZIP_BLOB',
  ADD_LOG: 'ADD_LOG',
  RESET_STATE: 'RESET_STATE'
};

// Reducer para gerenciar as ações
function siteReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_FORM_DATA:
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value
        }
      };
    case ACTION_TYPES.SET_HERO_IMAGE:
      return {
        ...state,
        heroImage: action.payload
      };
    case ACTION_TYPES.SET_IS_GENERATING:
      return {
        ...state,
        isGenerating: action.payload
      };
    case ACTION_TYPES.SET_IS_GENERATED:
      return {
        ...state,
        isGenerated: action.payload
      };
    case ACTION_TYPES.SET_GENERATION_ERROR:
      return {
        ...state,
        generationError: action.payload
      };
    case ACTION_TYPES.SET_PUBLISH_RESULT:
      return {
        ...state,
        publishResult: action.payload
      };
    case ACTION_TYPES.SET_IS_PUBLISHING:
      return {
        ...state,
        isPublishing: action.payload
      };
    case ACTION_TYPES.SET_ZIP_BLOB:
      return {
        ...state,
        zipBlob: action.payload
      };
    case ACTION_TYPES.ADD_LOG:
      return {
        ...state,
        logs: [...state.logs, {
          timestamp: new Date().toISOString(),
          level: action.level,
          message: action.message,
          data: action.data
        }]
      };
    case ACTION_TYPES.RESET_STATE:
      return {
        ...initialState
      };
    default:
      return state;
  }
}

// Criar o contexto
const SiteContext = createContext();

// Hook personalizado para usar o contexto
export function useSiteContext() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext deve ser usado dentro de um SiteProvider');
  }
  return context;
}

// Provedor do contexto
export function SiteProvider({ children }) {
  const [state, dispatch] = useReducer(siteReducer, initialState);

  // Logger centralizado
  const logger = {
    info: (message, data) => {
      dispatch({ 
        type: ACTION_TYPES.ADD_LOG, 
        level: 'info', 
        message, 
        data 
      });
      console.info(message, data);
    },
    warn: (message, data) => {
      dispatch({ 
        type: ACTION_TYPES.ADD_LOG, 
        level: 'warn', 
        message, 
        data 
      });
      console.warn(message, data);
    },
    error: (message, data) => {
      dispatch({ 
        type: ACTION_TYPES.ADD_LOG, 
        level: 'error', 
        message, 
        data 
      });
      console.error(message, data);
    }
  };

  // Persistir logs no localStorage em desenvolvimento
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('siteGeneratorLogs', JSON.stringify(state.logs));
    }
  }, [state.logs]);

  // Ações para atualizar o estado
  const actions = {
    updateFormField: (field, value) => {
      dispatch({ 
        type: ACTION_TYPES.UPDATE_FORM_DATA, 
        field, 
        value 
      });
    },
    setHeroImage: (image) => {
      dispatch({ 
        type: ACTION_TYPES.SET_HERO_IMAGE, 
        payload: image 
      });
    },
    setIsGenerating: (isGenerating) => {
      dispatch({ 
        type: ACTION_TYPES.SET_IS_GENERATING, 
        payload: isGenerating 
      });
    },
    setIsGenerated: (isGenerated) => {
      dispatch({ 
        type: ACTION_TYPES.SET_IS_GENERATED, 
        payload: isGenerated 
      });
    },
    setGenerationError: (error) => {
      dispatch({ 
        type: ACTION_TYPES.SET_GENERATION_ERROR, 
        payload: error 
      });
      if (error) {
        logger.error('Erro na geração do site', error);
      }
    },
    setPublishResult: (result) => {
      dispatch({ 
        type: ACTION_TYPES.SET_PUBLISH_RESULT, 
        payload: result 
      });
      if (result) {
        logger.info('Site publicado com sucesso', result);
      }
    },
    setIsPublishing: (isPublishing) => {
      dispatch({ 
        type: ACTION_TYPES.SET_IS_PUBLISHING, 
        payload: isPublishing 
      });
    },
    setZipBlob: (blob) => {
      dispatch({ 
        type: ACTION_TYPES.SET_ZIP_BLOB, 
        payload: blob 
      });
    },
    resetState: () => {
      dispatch({ type: ACTION_TYPES.RESET_STATE });
    }
  };

  return (
    <SiteContext.Provider value={{ state, actions, logger }}>
      {children}
    </SiteContext.Provider>
  );
}