// src/utils/validators.test.js
import { validateDomain } from './validators';

describe('validateDomain', () => {
  test('deve retornar true para domínios válidos', () => {
    expect(validateDomain('exemplo.com.br')).toBe(true);
    expect(validateDomain('meu-site.com')).toBe(true);
    expect(validateDomain('sub.dominio.net')).toBe(true);
  });

  test('deve retornar false para domínios inválidos', () => {
    expect(validateDomain('')).toBe(false);
    expect(validateDomain('exemplo')).toBe(false);
    expect(validateDomain('exemplo.')).toBe(false);
    expect(validateDomain('.com')).toBe(false);
    expect(validateDomain('exemplo com')).toBe(false);
  });
});