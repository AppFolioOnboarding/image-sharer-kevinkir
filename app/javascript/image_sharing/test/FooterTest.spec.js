/* eslint-env mocha */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Footer from '../components/Footer';

describe('Footer', () => {
  it('should display the footer element', () => {
    const footerWrapper = shallow(<Footer />);
    const footer = footerWrapper.find('footer');
    expect(footer.text()).to.equal('Copyright: AppFolio Inc. Onboarding');
  });
});
