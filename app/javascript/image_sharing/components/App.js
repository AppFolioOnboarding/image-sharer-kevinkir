import React, { Component } from 'react';
import { inject } from 'mobx-react';
import Footer from './Footer';

class App extends Component {
  /* Add Prop Types check*/
  render() {
    return (
      <div>
        <Footer />
      </div>
    );
  }
}

export default inject('stores')(App);
