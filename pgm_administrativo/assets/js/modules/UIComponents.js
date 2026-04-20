/**
 * UIComponents.js
 * Fábrica de Elementos de Interface
 */

import { Utils } from './Utils.js';

export class UIComponents {
    constructor(container) {
        this.container = container;
        this.utils = new Utils();
    }

    render(data) {
        this.container.innerHTML = '';

        // Agrupa por Curso
        const cursos = [...new Set(data.map(item => item['Curso']))];

        cursos.forEach(cursoName => {
            const items = data.filter(item => item['Curso'] === cursoName);
            const section = this.createCursoSection(cursoName, items);
            this.container.appendChild(section);
        });
    }

    createCursoSection(cursoName, items) {
        const section = document.createElement('section');
        section.className = 'discipline-section';
        const typeSlug = this.utils.slugify(cursoName || 'curso');

        const firstItem = items[0];

        section.innerHTML = `
            <div class="discipline-header">
                <h2>${cursoName || 'Sem Título'}</h2>
                <div class="discipline-info">
                    <div class="prof-info" style="width: 100%">
                        <span class="info-item"><b>Objetivo:</b> ${firstItem['Objetivo'] || ''}</span><br/>
                        <span class="info-item" style="margin-top: 10px; display:inline-block;"><b>Promovido por:</b> ${firstItem['Promovido por'] || ''}</span>
                    </div>
                </div>
            </div>
            <div class="accordion-container" id="lesson-grid-${typeSlug}"></div>
        `;

        const lessonGrid = section.querySelector(`#lesson-grid-${typeSlug}`);

        items.forEach((item, index) => {
            const accordionItem = this.createAccordionItem(item, cursoName, index === 0);
            lessonGrid.appendChild(accordionItem);
        });

        return section;
    }

    createAccordionItem(item, cursoName, isExpandedInitally = false) {
        const itemContainer = document.createElement('div');
        itemContainer.className = `accordion-item ${isExpandedInitally ? 'expanded' : ''}`;

        const header = document.createElement('div');
        header.className = 'accordion-header';

        const mainTitle = item['Aula'] ? `${item['Aula']}: ${item['Título']}` : (item['Título'] || 'Sem Título');

        header.innerHTML = `
            <div class="accordion-title-area">
                <i data-lucide="book-open" class="accordion-icon"></i>
                <h3 class="accordion-title">${mainTitle}</h3>
            </div>
            <div class="accordion-toggle">
                <i data-lucide="chevron-down" class="chevron-icon"></i>
            </div>
        `;

        const body = document.createElement('div');
        body.className = 'accordion-body';

        const contentStr = item['Conteúdo'] || '';
        const contentHtml = contentStr.replace(/\n/g, '<br/>');

        body.innerHTML = `
            <div class="accordion-content-inner">
                <div style="margin-bottom: 1.5rem;">
                    <span style="display:block; font-size:12px; color:#555; text-transform:uppercase; font-weight:bold; margin-bottom:5px;">Instrutores</span>
                    <strong style="color:var(--secondary-color);">${item['Professores']}</strong>
                </div>
                <div>
                    <span style="display:block; font-size:12px; color:#555; text-transform:uppercase; font-weight:bold; margin-bottom:10px;">Conteúdo Programático</span>
                    <div style="line-height:1.6; color:#333;">${contentHtml}</div>
                </div>
            </div>
        `;

        itemContainer.appendChild(header);
        itemContainer.appendChild(body);

        header.addEventListener('click', () => {
            itemContainer.classList.toggle('expanded');
        });

        return itemContainer;
    }
}
