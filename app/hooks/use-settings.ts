import { showBrand } from "@/lib/utils";
import { SettingKey } from "../stores/use-user-store";

const useSettings = () => {

  const settings: Record<SettingKey, boolean> = {
    hideBrand: !showBrand,
    showCost: false,
  }

  return {
    settings,
  }
}
export default useSettings;
