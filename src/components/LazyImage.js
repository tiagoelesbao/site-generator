// src/components/LazyImage.js
import React, { useState, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  placeholderColor = '#f0f0f0',
  className = '', 
  style = {} 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = React.useRef();
  
  useEffect(() => {
    // Criar observer
    const observer = new IntersectionObserver(
      (entries) => {
        // Verificar se a imagem está visível
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    
    // Observar elemento
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    // Limpar observer
    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
    };
  }, []);
  
  // Definir estilos do placeholder
  const placeholderStyle = {
    backgroundColor: placeholderColor,
    width: width || '100%',
    height: height || '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...style
  };
  
  // Definir estilos da imagem carregada
  const loadedStyle = {
    ...style,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out'
  };
  
  return (
    <div 
      ref={imgRef} 
      className={`lazy-image-container ${className}`} 
      style={placeholderStyle}
    >
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={loadedStyle}
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

export default LazyImage;