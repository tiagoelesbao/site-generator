// src/components/publish/PublishingStatus.js
import React from 'react';

function PublishingStatus({ isSettingUpEmails, testingMode }) {
  return (
    <div className="publishing-status">
      <div className="loader">
        <div className="loader-inner"></div>
      </div>
      <h3>Publicando seu site...</h3>
      <p>Esse processo pode levar alguns instantes.</p>
      {isSettingUpEmails && (
        <p>Configurando emails profissionais...</p>
      )}
      {testingMode && (
        <p className="testing-mode-tag">MODO DE TESTE ATIVADO</p>
      )}
    </div>
  );
}

export default PublishingStatus;