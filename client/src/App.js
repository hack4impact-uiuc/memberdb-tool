import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from 'react-router-dom';

import * as Routes from './routes';

import Home from './pages/Home';
import Member from './pages/Member';
import Login from './pages/Login';

import Navbar from './components/navbar/Navbar';
import NotFound from './pages/NotFound';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    React.useEffect(() => {

    }, []);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        console.log(isAuthenticated);
    };

    return (
        <div className="App">
            <Router>
                <Navbar logout={logout} />
                <Switch>
                    <Route path={Routes.DEFAULT_ROUTE} exact>
                        {isAuthenticated ? (
                            <Redirect to={Routes.HOME_PAGE_ROUTE} />
                        ) : (
                                <Login login={login} />
                            )}
                    </Route>
                    <Route path={Routes.HOME_PAGE_ROUTE} exact>
                        {isAuthenticated ? <Home /> : <Login login={login} />}
                    </Route>
                    <Route path={Routes.MEMBER_PAGE_ROUTE} exact>
                        {isAuthenticated ? <Member /> : <Login login={login} />}
                    </Route>
                    <Route path="*">
                        {isAuthenticated ? <NotFound /> : <Login login={login} />}
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
