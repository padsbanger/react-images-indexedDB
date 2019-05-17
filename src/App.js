import React from 'react';
import localforage from 'localforage';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: []
    }
  }

  componentDidMount() {
    localforage.config({
      driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
      name: 'myApp',
      version: 1.0,
      size: 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName: 'images', // Should be alphanumeric, with underscores.
      description: 'some description'
    })

    localforage.ready().then(() => {
      localforage.keys().then((value) => {
        for (const key in value) {
          localforage.getItem(value[key]).then((value) => {
            this.setState({
              images: [...this.state.images, value]
            })
          })
        }
      })
    }).catch(function (e) {
      console.log(e);
    });
  }

  handleImageUpload = (event) => {
    const filesToUpload = Array.from(event.target.files);
    filesToUpload.forEach(this.handleAddToDB.bind(this));
    return null;
  }

  handleAddToDB(file) {
    var reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      localforage.setItem(file.name, e.target.result).then((value) => {
        console.log('adding');
        this.setState({
          images: [...this.state.images, value]
        })
      }).catch(function (err) {
        console.log(err);
      });
    }
  }

  renderImages() {
    return this.state.images.map((image, index) => {
      const src = 'data:image/jpeg;base64,' + btoa(image);
      return (
        <li><img alt="" key={index} src={src} /></li>
      )
    })
  }

  render() {
    return (
      <div className="App">
        <input type="file" id="pictureTest" onChange={this.handleImageUpload} capture multiple />
        <ul>
          {this.renderImages()}
        </ul>
      </div>
    );
  }
}
