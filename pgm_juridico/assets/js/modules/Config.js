/**
 * Config.js
 * Gerenciamento de Configurações e Ambiente
 */

export class Config {
    constructor() {
        this.env = {};
    }

    async load() {
        try {
            const response = await fetch('./config.env');
            if (response.ok) {
                const text = await response.text();
                this.env = this._parseEnv(text);
            }
            return this;
        } catch (error) {
            console.warn('Config.env não carregado, seguindo com configurações vazias.');
            return this;
        }
    }

    _parseEnv(text) {
        const lines = text.split('\n');
        const env = {};
        lines.forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                env[key.trim()] = value.trim();
            }
        });
        return env;
    }
}
