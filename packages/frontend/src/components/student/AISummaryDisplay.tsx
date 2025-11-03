import React from 'react';
import { Sparkles, BookOpen, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react';

interface AISummaryDisplayProps {
  summary: string; // Résumé brut en Markdown (généré par l'IA)
}

/**
 * Composant d'affichage du résumé AI d'un chapitre
 * Fonctionnalités :
 * - Parse le texte brut en sections (titres, listes, paragraphes)
 * - Support du Markdown inline (**gras**, *italique*, `code`)
 * - Détection intelligente :
 *   - Questions (icône alerte)
 *   - Notes importantes (icône ampoule)
 *   - Listes avec puces
 * - Design riche avec icônes, couleurs, bordures
 * - Responsive et accessible
 */
const AISummaryDisplay: React.FC<AISummaryDisplayProps> = ({ summary }) => {
  /**
   * Parse le texte brut en sections structurées
   * Gère :
   * - Titres (finissant par ":" ou en **gras**)
   * - Listes (commençant par "* " ou "- ")
   * - Paragraphes normaux
   */
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const sections: Array<{ type: string; content: string; items?: string[] }> = [];
    let currentSection: { type: string; content: string; items?: string[] } | null = null;

    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (!trimmed) {
        if (currentSection) {
          sections.push(currentSection);
          currentSection = null;
        }
        return;
      }

      // Détecte les en-têtes
      if (trimmed.endsWith(':') || (trimmed.startsWith('**') && trimmed.endsWith('**'))) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          type: 'header',
          content: trimmed.replace(/\*\*/g, '').replace(/:$/, ''),
          items: []
        };
      }
      // Détecte les éléments de liste
      else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        if (!currentSection || currentSection.type !== 'header') {
          if (currentSection) sections.push(currentSection);
          currentSection = { type: 'list', content: '', items: [] };
        }
        currentSection.items?.push(trimmed.substring(2));
      }
      // Paragraphe normal
      else {
        if (currentSection && currentSection.type === 'header' && currentSection.items) {
          currentSection.content += ' ' + trimmed;
        } else {
          if (currentSection) sections.push(currentSection);
          currentSection = { type: 'paragraph', content: trimmed };
        }
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  /**
   * Formate le Markdown inline dans le texte
   * Gère : **gras**, *italique*, `code`
   */
  const formatInlineMarkdown = (text: string) => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    const combinedRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
    const matches = Array.from(remaining.matchAll(combinedRegex));

    let lastIndex = 0;
    matches.forEach(match => {
      if (match.index! > lastIndex) {
        parts.push(remaining.substring(lastIndex, match.index));
      }

      const matchText = match[0];
      if (matchText.startsWith('**')) {
        parts.push(
          <strong key={key++} className="font-bold text-gray-900 dark:text-white">
            {matchText.slice(2, -2)}
          </strong>
        );
      } else if (matchText.startsWith('`')) {
        parts.push(
          <code key={key++} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400 rounded text-sm font-mono">
            {matchText.slice(1, -1)}
          </code>
        );
      } else if (matchText.startsWith('*')) {
        parts.push(
          <em key={key++} className="italic text-gray-700 dark:text-gray-300">
            {matchText.slice(1, -1)}
          </em>
        );
      }

      lastIndex = match.index! + matchText.length;
    });

    if (lastIndex < remaining.length) {
      parts.push(remaining.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const sections = parseContent(summary);

  return (
    <div className="space-y-6">
      {/* === Bannière d'en-tête AI === */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Sparkles size={24} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-purple-900 dark:text-purple-100">
            AI-Generated Summary
          </h3>
          <p className="text-xs text-purple-700 dark:text-purple-300">
            Automatically extracted key concepts and insights
          </p>
        </div>
      </div>

      {/* === Contenu structuré === */}
      <div className="space-y-5">
        {sections.map((section, index) => {
          // === En-tête avec liste (ex: Concepts clés:) ===
          if (section.type === 'header') {
            return (
              <div key={index} className="space-y-3">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  {formatInlineMarkdown(section.content)}
                </h4>
                {section.items && section.items.length > 0 && (
                  <ul className="space-y-2 ml-4">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                        <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{formatInlineMarkdown(item)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          }

          // === Liste simple (sans en-tête) ===
          if (section.type === 'list') {
            return (
              <ul key={index} className="space-y-2 ml-4">
                {section.items?.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="leading-relaxed">{formatInlineMarkdown(item)}</span>
                  </li>
                ))}
              </ul>
            );
          }

          // === Paragraphe avec détection intelligente ===
          if (section.type === 'paragraph') {
            const isQuestion = section.content.includes('?');
            const isNote = section.content.toLowerCase().startsWith('note:') || 
                          section.content.toLowerCase().startsWith('important:');

            // Question mise en évidence
            if (isQuestion) {
              return (
                <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {formatInlineMarkdown(section.content)}
                    </p>
                  </div>
                </div>
              );
            }

            // Note importante
            if (isNote) {
              return (
                <div key={index} className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
                  <div className="flex items-start gap-3">
                    <Lightbulb size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {formatInlineMarkdown(section.content)}
                    </p>
                  </div>
                </div>
              );
            }

            // Paragraphe standard
            return (
              <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                {formatInlineMarkdown(section.content)}
              </p>
            );
          }

          return null;
        })}
      </div>

      {/* === Pied de page === */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <BookOpen size={16} />
          <span>Continue reading the full chapter content for complete details</span>
        </div>
      </div>
    </div>
  );
};

export default AISummaryDisplay;