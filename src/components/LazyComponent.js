// src/components/LazyComponent.js
import React, { lazy, Suspense } from 'react';

// Componente de fallback para carregamento
const LoadingFallback = ({ height = 200, message = 'Carregando...' }) => (
  <div 
    style={{ 
      height: `${height}px`, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.05)',
      borderRadius: '8px'
    }}
  >
    <div className="loading-spinner"></div>
    <p>{message}</p>
  </div>
);

// Componente de fallback para erro
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div 
    style={{ 
      padding: '20px', 
      background: 'rgba(255,0,0,0.05)', 
      color: '#ff3333',
      border: '1px solid rgba(255,0,0,0.2)',
      borderRadius: '8px'
    }}
  >
    <h3>Algo deu errado ao carregar este componente</h3>
    <p>{error.message}</p>
    {resetErrorBoundary && (
      <button onClick={resetErrorBoundary}>Tentar novamente</button>
    )}
  </div>
);

// Classe de ErrorBoundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Logar o erro
    console.error("Erro no componente:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error} 
          resetErrorBoundary={this.resetErrorBoundary} 
        />
      );
    }

    return this.props.children;
  }
}

// HOC para criar componente lazy
export function createLazyComponent(factory, options = {}) {
  const LazyComponent = lazy(factory);
  
  return (props) => (
    <ErrorBoundary>
      <Suspense fallback={
        <LoadingFallback 
          height={options.height || 200} 
          message={options.loadingMessage || 'Carregando...'} 
        />
      }>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

export { LoadingFallback, ErrorFallback, ErrorBoundary };