
import './App.css';
import AppRoutes from './Routes';
import { BrowserRouter } from 'react-router-dom';

// import SubscriptionPage from './SubscriptionPage';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <div>
            <AppRoutes />

          </div>
        </header>
      </div>
    </BrowserRouter>
  )

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <div>


  //       </div>
  //     </header>
  //   </div>
  // );
}

export default App;
