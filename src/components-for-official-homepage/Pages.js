import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Navbar'
import Home from './Home'
import Blog from '../components-for-blog/Blog'
import ThePhilosophers from './ThePhilosophers';
import Theism from './Theism';
import Morality from './Morality';
import Metaphysics from './Metaphysics';
import Politics from './Politics';
import HumanNature from './HumanNature';
import Quizes from './Quizes';
import Books from './Books';
import AboutUs from './AboutUs';
import AboutTheFounder from './AboutTheFounder'
import Contact from './Contact'


const Pages = () => {
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/Blog" component={Blog} />
                <Route exact path="/ThePhilosophers" component={ThePhilosophers} />
                <Route exact path="/Theism" component={Theism} />
                <Route exact path="/Morality" component={Morality} />
                <Route exact path="/Metaphysics" component={Metaphysics} />
                <Route exact path="/Politics" component={Politics} />
                <Route exact path="/HumanNature" component={HumanNature} />
                <Route exact path="/Quizes" component={Quizes} />
                <Route exact path="/Books" component={Books} />
                <Route exact path="/AboutUs" component={AboutUs} />
                <Route exact path="/AboutUs" component={AboutUs} />
                <Route exact path="/AboutTheFounder" component={AboutTheFounder} />
                <Route exact path="/Contact" component={Contact} />
            </Switch>

        </Router>
    )
}

export default Pages
