import {  useRoutes } from 'react-router-dom';
import ProductsPage from './pages/Products';
import SubscriptionPage from './pages/SubscriptionPage';
import Pricing from './components/PricingBootstrap';


const AppRoutes = () => {

  const SubscriptionRoutes = {
    // path: '/',
    // element: <div> </div>,
    children : [
      { path: '/subscribe/:networkid/:priceid', element: <SubscriptionPage />},
      { path: '/products', element: <ProductsPage />},
      { path: '/pricing', element: <Pricing />},


    ]
  }

  return useRoutes( [SubscriptionRoutes]  );
};

export default AppRoutes;