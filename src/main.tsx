import ReactDOM from 'react-dom/client';
import Router from './router';
import '@/assets/css/public.less';
import '@/assets/fonts/font.less';

// State Management
import { Provider } from 'react-redux';
import { store } from './stores';

// styles
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs'; // Compatible with lower version browsers
import 'uno.css';
import 'nprogress/nprogress.css';
import '@/assets/css/scrollbar.less';
import '@/assets/css/theme-color.less';

// Internationalization (i18n)
import './locales/config';

// antd
import '@/assets/css/antd.less';

// Set time to Chinese
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StyleProvider
    hashPriority='high'
    transformers={[legacyLogicalPropertiesTransformer]}
  >
    <Provider store={store}>
      <Router />
    </Provider>
  </StyleProvider>
);

// close loading
const firstElement = document.getElementById('first');
if (firstElement && firstElement.style?.display !== 'none') {
  firstElement.style.display = 'none';
}
