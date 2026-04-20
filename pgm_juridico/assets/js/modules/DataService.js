/**
 * DataService.js
 * Comunicação com Google Sheets e Parse de Dados
 */

export class DataService {
    constructor(config) {
        this.config = config;
    }

    async fetchAll() {
        // Tentamos buscar o Markdown primeiro
        try {
            const dados = await this._fetchMarkdown('meta_dados');
            return dados;
        } catch (error) {
            console.warn('Falha ao carregar Markdown, tentando CSV:', error);
            const dados = await this._fetchCSV(this.config.tabs.dados);
            return dados;
        }
    }

    async _fetchMarkdown(fileName) {
        const url = `./${fileName}.md`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ao buscar arquivo markdown: ${fileName}.md`);

        const text = await response.text();
        return this._parseMarkdown(text);
    }

    _parseMarkdown(mdText) {
        const sections = mdText.split(/---/);
        let frontmatter = {};
        let content = '';

        if (sections.length >= 3) {
            const yamlText = sections[1];
            content = sections.slice(2).join('---');

            yamlText.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length > 0) {
                    const cleanKey = key.trim().toLowerCase();
                    const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
                    frontmatter[cleanKey] = value;
                }
            });
        } else {
            content = mdText;
        }

        // Regex para capturar Aula e Título
        // Exemplo: # Aula 1: Engenharia de Prompt
        const lessonRegex = /^#\s*(Aula\s*\d+)\s*:\s*(.*)/gim;
        const rows = [];
        let match;

        const lessons = [];
        const lines = content.split('\n');
        let currentLesson = null;

        lines.forEach(line => {
            const lessonMatch = /^#\s*(Aula\s*\d+)\s*:\s*(.*)/i.exec(line);
            if (lessonMatch) {
                if (currentLesson) {
                    lessons.push(currentLesson);
                }
                currentLesson = {
                    aula: lessonMatch[1].trim(),
                    titulo: lessonMatch[2].trim(),
                    conteudo: []
                };
            } else if (currentLesson) {
                currentLesson.conteudo.push(line);
            }
        });

        if (currentLesson) {
            lessons.push(currentLesson);
        }

        return lessons.map(lesson => ({
            "Curso": frontmatter['curso'] || "",
            "Objetivo": frontmatter['objetivo'] || "",
            "Promovido por": frontmatter['promovido por'] || frontmatter['promovido_por'] || "",
            "Professores": frontmatter['professores'] || "",
            "Aula": lesson.aula,
            "Título": lesson.titulo,
            "Conteúdo": lesson.conteudo.join('\n').trim()
        }));
    }

    async _fetchCSV(sheetName) {
        const url = `https://docs.google.com/spreadsheets/d/${this.config.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
        const response = await fetch(url);
        if (!response.ok) {
            // Fallback para CSV local se for do tipo local
            const localUrl = `./${sheetName}.csv`;
            const localResponse = await fetch(localUrl);
            if (!localResponse.ok) throw new Error(`Erro ao buscar aba ou arquivo local: ${sheetName}`);
            const text = await localResponse.text();
            return this._parseCSV(text);
        }

        const text = await response.text();
        return this._parseCSV(text);
    }

    _parseCSV(csvText) {
        const rows = [];
        let currentRow = [];
        let currentCell = '';
        let inQuotes = false;

        for (let i = 0; i < csvText.length; i++) {
            const char = csvText[i];
            const nextChar = csvText[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    currentCell += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                currentRow.push(currentCell);
                currentCell = '';
            } else if ((char === '\n' || char === '\r') && !inQuotes) {
                if (char === '\r' && nextChar === '\n') i++;
                currentRow.push(currentCell);
                if (currentRow.some(c => c.trim() !== '')) rows.push(currentRow);
                currentRow = [];
                currentCell = '';
            } else {
                currentCell += char;
            }
        }

        if (currentCell !== '' || currentRow.length > 0) {
            currentRow.push(currentCell);
            if (currentRow.some(c => c.trim() !== '')) rows.push(currentRow);
        }

        if (rows.length < 2) return [];

        const headers = rows[0].map(h => h.trim());

        return rows.slice(1).map(values => {
            const obj = {};
            headers.forEach((header, i) => {
                if (header) {
                    obj[header] = (values[i] !== undefined) ? values[i].trim() : '';
                }
            });
            return obj;
        }).filter(item => Object.values(item).some(v => v !== ''));
    }
}
