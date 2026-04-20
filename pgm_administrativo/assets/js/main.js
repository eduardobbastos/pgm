/**
 * main.js
 * Entry Point e Orquestrador da Aplicação
 */

import { Config } from './modules/Config.js';
import { DataService } from './modules/DataService.js';
import { UIComponents } from './modules/UIComponents.js';

class App {
    constructor() {
        this.config = new Config();
        this.ui = new UIComponents(document.getElementById('shelf-motor'));
    }

    async start() {
        try {
            // 1. Carrega Configurações
            await this.config.load();

            // 2. Inicializa Serviço de Dados
            const dataService = new DataService(this.config);

            // 3. Busca Dados do Google Sheets
            const data = await dataService.fetchAll();

            // 4. Renderiza UI
            this.ui.render(data);

            // 5. Ativa Ícones (Lucide)
            if (window.lucide) {
                window.lucide.createIcons();
            }

            console.log('Estante Virtual v3.1 Modularizada e Pronta! 🚀');
        } catch (error) {
            console.error('Falha ao iniciar app:', error);
            document.getElementById('shelf-motor').innerHTML = `
                <div class="error-container" style="padding: 2rem; background: #ffebee; color: #b71c1c; border-radius: 8px;">
                    <h3>Ocorreu um erro ao carregar a estante</h3>
                    <p style="margin-bottom:10px;">Enviamos um diagnóstico para a tela.</p>
                    <code style="display:block; padding:10px; background:#fff; border:1px solid #ffcdd2; color:#d32f2f;">Erro técnico: ${error.message}</code><br/>
                    <small>Se ainda houver problemas ou mensagens técnicas confusas, avise o assistente de desenvolvimento.</small>
                </div>
            `;
        }
    }
}

// Inicia a aplicação
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.start();
});
