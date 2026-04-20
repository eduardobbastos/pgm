/**
 * Config.js
 * Gerenciamento de Configurações e Ambiente
 */

export class Config {
    constructor() {
        this.sheetId = '';
        this.tabs = {
            dados: ''
        };
    }

    async load() {
        try {
            const response = await fetch('./config.env');
            if (!response.ok) {
                console.warn('Arquivo config.env não foi carregado (possivelmente bloqueado pelo Live Server). Utilizando valores padrão de fallback.');
                this.sheetId = '1KzuZCjrKK9XLeREuZqURgjgSiWIG-gs-7fLvux_y8yI';
                this.tabs.dados = 'meta_dados';
                return this;
            }

            const text = await response.text();
            const env = this._parseEnv(text);

            if (!env.SHEET_ID || text.includes('DOCTYPE html')) {
                console.warn('Conteúdo bloqueado ou HTML de fallback recebido. Utilizando valores padrão de fallback reais.');
                this.sheetId = '1KzuZCjrKK9XLeREuZqURgjgSiWIG-gs-7fLvux_y8yI';
                this.tabs.dados = 'meta_dados';
                return this;
            }

            this.sheetId = env.SHEET_ID;
            this.tabs.dados = env.TAB_DADOS || 'meta_dados';

            return this;
        } catch (error) {
            console.warn('Erro fatal na requisição do config.env. Utilizando valores padrão de fallback.', error);
            this.sheetId = '1KzuZCjrKK9XLeREuZqURgjgSiWIG-gs-7fLvux_y8yI';
            this.tabs.dados = 'meta_dados';
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
