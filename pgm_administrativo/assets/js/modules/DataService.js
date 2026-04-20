/**
 * DataService.js
 * Comunicação com arquivos Markdown e Parse de Dados
 */

export class DataService {
    constructor(config) {
        this.config = config;
    }

    async fetchAll() {
        return this._fetchMarkdown('meta_dados');
    }

    async _fetchMarkdown(fileName) {
        const url = `./${fileName}.md`;
        const response = await fetch(url);
        if (!response.ok) {
            const errorMsg = `Erro ao buscar arquivo markdown: ${url} (Status: ${response.status} ${response.statusText})`;
            throw new Error(errorMsg);
        }

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

        const lines = content.split('\n');
        let currentLesson = null;
        const lessons = [];

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
}
