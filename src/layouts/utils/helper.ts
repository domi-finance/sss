import type { MessageInstance } from "antd/es/message/interface";
import { VERSION } from "@/utils/config";
import axios from "axios";

/** Version monitoring */
export const versionCheck = async (messageApi: MessageInstance) => {
  // if (import.meta.env.MODE === 'development') return;
  const versionLocal = localStorage.getItem(VERSION);
  const { data: { version } } = await axios.get('version.json');

  // Cache local data on first visit
  if (!versionLocal) {
    return localStorage.setItem(VERSION, String(version));
  }

  if (versionLocal !== String(version)) {
    localStorage.setItem(VERSION, String(version));
    messageApi.info({
      content: 'New content detected, auto-updating...',
      key: 'reload',
      onClose: () => {
        let timer: NodeJS.Timeout | null = setTimeout(() => {
          clearTimeout(timer as NodeJS.Timeout);
          timer = null;
          window.location.reload();
        }, 60000);
      }
    });
  }
};
