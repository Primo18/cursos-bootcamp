const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

class Password {
  async validateAndClean(pass) {
    const cleanedPass = String(pass ?? '').trim();
    if (cleanedPass.length < MIN_PASSWORD_LENGTH) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    return cleanedPass;
  }

  async compare(pass, hash) {
    const cleanedPass = await this.validateAndClean(pass);
    return bcrypt.compare(cleanedPass, hash);
  }

  async toHash(pass) {
    const cleanedPass = await this.validateAndClean(pass);
    return bcrypt.hash(cleanedPass, SALT_ROUNDS);
  }
}

module.exports = Password;
