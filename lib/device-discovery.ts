import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';

class DeviceDiscovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
    };
  }

  componentDidMount() {
    this.startMDNS();
  }

  startMDNS() {
    const mdns = require('mdns');
    const browser = mdns.createBrowser(mdns.tcp('device')); // Change 'device' to your desired service type

    browser.on('serviceUp', (service) => {
      console.log('Service up:', service);
      this.setState((prevState) => ({ devices: [...prevState.devices, service] }));
    });

    browser.start();
  }

  render() {
    return (
      <div>
        <h1>Available Devices</h1>
        <ul>
          {this.state.devices.map((device, index) => (
            <li key={index}>{device.name} - {device.addresses.join(', ')}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default DeviceDiscovery;