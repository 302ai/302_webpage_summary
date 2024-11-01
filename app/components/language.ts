interface Language {
  zh: string;
  en: string,
  ja: string,
  [key: string]: string,
};
/**
 * 工具语言配置
 */
export const LANGUAGE_LIST: Array<Language> = [
  { zh: '中文', en: 'Chinese', ja: '中文' },
  { zh: '英语', en: 'English', ja: 'English' },
  { zh: '日语', en: 'Japanese', ja: '日本語' },
  { zh: '法语', en: 'French', ja: 'Deutsch' },
  { zh: '韩语', en: 'Korean', ja: 'Français' },
  { zh: '德语', en: 'German', ja: '한국어' },
]
