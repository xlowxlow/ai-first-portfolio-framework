import { SupportedLanguage } from '../generators/llms-txt-generator';

export interface LanguageDetectionResult {
  language: SupportedLanguage;
  confidence: number;
  detectedFrom: 'text' | 'locale' | 'default';
}

export class LanguageUtils {
  private static chineseCharRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
  private static traditionalCharRegex = /[繁體簡体]/;
  
  private static languagePatterns = {
    zh: /[\u4e00-\u9fff]/g,
    en: /[a-zA-Z]/g,
  };

  public static detectLanguage(text: string, locale?: string): LanguageDetectionResult {
    if (locale) {
      const localeLanguage = this.getLanguageFromLocale(locale);
      if (localeLanguage) {
        return {
          language: localeLanguage,
          confidence: 1.0,
          detectedFrom: 'locale',
        };
      }
    }

    if (!text || text.trim().length === 0) {
      return {
        language: 'en',
        confidence: 0.5,
        detectedFrom: 'default',
      };
    }

    const chineseMatches = (text.match(this.languagePatterns.zh) || []).length;
    const englishMatches = (text.match(this.languagePatterns.en) || []).length;
    const totalChars = chineseMatches + englishMatches;

    if (totalChars === 0) {
      return {
        language: 'en',
        confidence: 0.3,
        detectedFrom: 'default',
      };
    }

    const chineseRatio = chineseMatches / totalChars;
    
    if (chineseRatio > 0.3) {
      const isTraditional = this.isTraditionalChinese(text);
      return {
        language: isTraditional ? 'zh-TW' : 'zh-CN',
        confidence: Math.min(0.9, chineseRatio + 0.1),
        detectedFrom: 'text',
      };
    }

    return {
      language: 'en',
      confidence: Math.min(0.9, (1 - chineseRatio) + 0.1),
      detectedFrom: 'text',
    };
  }

  private static getLanguageFromLocale(locale: string): SupportedLanguage | null {
    const normalizedLocale = locale.toLowerCase();
    
    if (normalizedLocale.startsWith('zh-tw') || 
        normalizedLocale.startsWith('zh-hk') || 
        normalizedLocale.includes('traditional')) {
      return 'zh-TW';
    }
    
    if (normalizedLocale.startsWith('zh-cn') || 
        normalizedLocale.startsWith('zh-sg') ||
        normalizedLocale.startsWith('zh') ||
        normalizedLocale.includes('simplified')) {
      return 'zh-CN';
    }
    
    if (normalizedLocale.startsWith('en')) {
      return 'en';
    }
    
    return null;
  }

  private static isTraditionalChinese(text: string): boolean {
    const traditionalChars = ['繁', '體', '語', '題', '過', '這', '個', '會', '來', '時', '間'];
    const simplifiedChars = ['简', '体', '语', '题', '过', '这', '个', '会', '来', '时', '间'];
    
    let traditionalCount = 0;
    let simplifiedCount = 0;
    
    for (const char of traditionalChars) {
      if (text.includes(char)) traditionalCount++;
    }
    
    for (const char of simplifiedChars) {
      if (text.includes(char)) simplifiedCount++;
    }
    
    return traditionalCount > simplifiedCount;
  }

  public static formatDate(dateString: string, language: SupportedLanguage): string {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
    };
    
    let locale: string;
    switch (language) {
      case 'zh':
      case 'zh-CN':
        locale = 'zh-CN';
        break;
      case 'zh-TW':
        locale = 'zh-TW';
        break;
      default:
        locale = 'en-US';
    }
    
    try {
      return date.toLocaleDateString(locale, options);
    } catch (error) {
      return date.toLocaleDateString('en-US', options);
    }
  }

  public static formatNumber(num: number, language: SupportedLanguage): string {
    let locale: string;
    switch (language) {
      case 'zh':
      case 'zh-CN':
        locale = 'zh-CN';
        break;
      case 'zh-TW':
        locale = 'zh-TW';
        break;
      default:
        locale = 'en-US';
    }
    
    try {
      return num.toLocaleString(locale);
    } catch (error) {
      return num.toLocaleString('en-US');
    }
  }

  public static joinArray(array: string[], language: SupportedLanguage): string {
    if (array.length === 0) return '';
    if (array.length === 1) return array[0];
    
    const separator = language.startsWith('zh') ? '、' : ', ';
    const lastSeparator = language.startsWith('zh') ? '和' : ' and ';
    
    if (array.length === 2) {
      return array.join(lastSeparator);
    }
    
    return array.slice(0, -1).join(separator) + lastSeparator + array[array.length - 1];
  }

  public static truncateText(text: string, maxLength: number, language: SupportedLanguage): string {
    if (text.length <= maxLength) {
      return text;
    }
    
    const ellipsis = language.startsWith('zh') ? '……' : '...';
    const truncated = text.substring(0, maxLength - ellipsis.length);
    
    const lastSpace = truncated.lastIndexOf(' ');
    const lastNewline = truncated.lastIndexOf('\n');
    const lastBreak = Math.max(lastSpace, lastNewline);
    
    if (lastBreak > 0 && lastBreak > maxLength * 0.8) {
      return truncated.substring(0, lastBreak) + ellipsis;
    }
    
    return truncated + ellipsis;
  }

  public static validateLanguage(language: string): language is SupportedLanguage {
    return ['en', 'zh', 'zh-CN', 'zh-TW'].includes(language);
  }

  public static normalizeLanguage(language: string): SupportedLanguage {
    const normalized = language.toLowerCase();
    
    if (normalized.startsWith('zh-tw') || normalized.includes('traditional')) {
      return 'zh-TW';
    }
    
    if (normalized.startsWith('zh-cn') || normalized.startsWith('zh-sg') || normalized === 'zh') {
      return 'zh-CN';
    }
    
    if (normalized.startsWith('en')) {
      return 'en';
    }
    
    return 'en';
  }

  public static getReadingTime(text: string, language: SupportedLanguage): number {
    const wordsPerMinute = language.startsWith('zh') ? 250 : 200;
    
    let wordCount: number;
    if (language.startsWith('zh')) {
      wordCount = Array.from(text).filter(char => 
        this.chineseCharRegex.test(char)
      ).length;
    } else {
      wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    }
    
    return Math.ceil(wordCount / wordsPerMinute);
  }

  public static getLanguageDirection(language: SupportedLanguage): 'ltr' | 'rtl' {
    return 'ltr';
  }

  public static getCharacterCount(text: string, language: SupportedLanguage): number {
    if (language.startsWith('zh')) {
      return Array.from(text).filter(char => 
        this.chineseCharRegex.test(char)
      ).length;
    }
    
    return text.replace(/\s+/g, '').length;
  }

  public static pluralize(count: number, singular: string, plural?: string, language: SupportedLanguage = 'en'): string {
    if (language.startsWith('zh')) {
      return `${count}${singular}`;
    }
    
    if (count === 1) {
      return `${count} ${singular}`;
    }
    
    return `${count} ${plural || singular + 's'}`;
  }
}

export class TextFormatter {
  public static formatParagraph(text: string, language: SupportedLanguage): string {
    const sentences = text.split(/[。！？.!?]+/).filter(s => s.trim());
    
    if (language.startsWith('zh')) {
      return sentences.join('。');
    }
    
    return sentences.join('. ');
  }

  public static formatList(items: string[], language: SupportedLanguage, ordered: boolean = false): string {
    if (items.length === 0) return '';
    
    const bullet = language.startsWith('zh') ? '·' : '-';
    
    return items.map((item, index) => {
      const prefix = ordered ? `${index + 1}.` : bullet;
      return `${prefix} ${item}`;
    }).join('\n');
  }

  public static formatHeading(text: string, level: number, language: SupportedLanguage): string {
    const prefix = '#'.repeat(Math.max(1, Math.min(6, level)));
    return `${prefix} ${text}`;
  }

  public static formatEmphasis(text: string, type: 'bold' | 'italic' | 'code'): string {
    switch (type) {
      case 'bold':
        return `**${text}**`;
      case 'italic':
        return `*${text}*`;
      case 'code':
        return `\`${text}\``;
      default:
        return text;
    }
  }

  public static formatLink(text: string, url: string): string {
    return `[${text}](${url})`;
  }

  public static formatCodeBlock(code: string, language?: string): string {
    const lang = language || '';
    return `\`\`\`${lang}\n${code}\n\`\`\``;
  }
}