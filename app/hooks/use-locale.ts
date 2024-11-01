import { useParams } from "next/navigation"
import { fallbackLng, languages } from '../i18n/settings'

/**
 * 获取全局语言选择器所选语言
 * @returns i18n/settings的值
 */
const useLocale = () => {
  const { locale } = useParams();
  // 设定默认语言
  let resultLocale = languages[0] || fallbackLng
  if (typeof locale === "string" && languages.includes(locale)) {
    resultLocale = locale;
  }
  return {
    /**
     * i18n/settings的值
     */
    locale: resultLocale
  }
}
export default useLocale;
