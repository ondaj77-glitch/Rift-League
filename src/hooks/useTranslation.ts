import { en } from '../data/locales/en';
import { cs } from '../data/locales/cs';
import { useGameStore } from '../store/gameStore';
import type { TranslationKey } from '../data/locales/en';

const locales = { en, cs };

export function useTranslation() {
  const language = useGameStore(s => s.language);
  const dict = locales[language] || en;

  function t(key: TranslationKey | string, ...args: (string | number)[]): string {
    let text = (dict as Record<string, string>)[key] || (en as Record<string, string>)[key] || key;
    args.forEach((arg, i) => {
      text = text.replace(`{${i}}`, String(arg));
    });
    return text;
  }

  return { t, language, lang: language };
}
