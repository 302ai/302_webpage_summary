'use client'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useClientTranslation } from "../hooks/use-client-translation"
import { cn } from "@/lib/utils";
import { languages } from '@/app/i18n/settings'
import ISO639 from 'iso-639-1'
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { LANGUAGE_LIST } from "./language";
import useLocale from "../hooks/use-locale";

/**
 * 查询条件 - 语言切换器
 * Query Criteria - Language Switcher
 * @param props
 * @returns
 */
export const HeaderLanguageSwitcher = (props: {
  disabled: boolean,
  className: string,
  defaultValue?: string,
  onChange?: (newValue: string) => void,
}) => {

  const langs = languages.map((language) => {
    return {
      key: language,
      label: ISO639.getNativeName(language),
    }
  })

  const { className, defaultValue, onChange: onCangeParent,disabled } = props;

  const { locale } = useLocale()
  const { t } = useClientTranslation();

  // 如果没有值，默认选择ISO639的第一个语言（英语）
  // If there is no value, the first language of ISO639 (English) is selected by default
  const [value, setValue] = useState(defaultValue || LANGUAGE_LIST[0].en)

  /**
   * 用于渲染的文字
   * render text
   */
  const renderText = (LANGUAGE_LIST.find(item => item.en === value) || LANGUAGE_LIST[0])[locale]

  const handleChangeLanguage = (newValue: string) => {
    setValue(newValue);
    // 传递到父级组件
    // to parent
    onCangeParent && onCangeParent(newValue);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild={true}>
          <Button
            disabled={disabled}
            variant={"outline"}
            aria-label={renderText}
            className={cn(className)}
          >
            {renderText}
            <FaChevronDown className='size-2 ml-2' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent aria-describedby={undefined}>
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={handleChangeLanguage}
          >
            {LANGUAGE_LIST.map((language, index) => (
              <DropdownMenuRadioItem key={index} value={language.en}>
                {language[locale]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
