// src/utils/security.test.js
import { sanitizeInput, sanitizeHTML } from './security';

describe('sanitizeInput', () => {
  test('deve remover tags HTML', () => {
    expect(sanitizeInput('<script>alert("XSS")</script>')).toBe('alert("XSS")');
    expect(sanitizeInput('<img src="x" onerror="alert(1)">')).toBe('');
  });

  test('deve preservar texto normal', () => {
    expect(sanitizeInput('Texto normal')).toBe('Texto normal');
    expect(sanitizeInput('123456')).toBe('123456');
  });
});

describe('sanitizeHTML', () => {
  test('deve permitir tags seguras e remover atributos perigosos', () => {
    expect(sanitizeHTML('<p>Texto <b>negrito</b></p>')).toBe('<p>Texto <b>negrito</b></p>');
    expect(sanitizeHTML('<p onclick="alert(1)">Texto</p>')).toBe('<p>Texto</p>');
  });
});