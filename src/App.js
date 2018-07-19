import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import minimatch from 'minimatch';
import './App.css';
import ContentEditable from 'react-contenteditable';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      minimatchString: '/**/*.js',
      testAgaintString: `<div>/Users/doge/very/amaze.js</div><div>usr/local/bin/wow</div>`,
      contentEditableRef: null
    };
    this.onTestStringChange = this.onTestStringChange.bind(this);
    this.onMinimatchStringChange = this.onMinimatchStringChange.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.getContentEditableRef = this.getContentEditableRef.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contentEditableRef !== prevState.contentEditableRef) {
      this.validate();
    }
  }

  componentDidMount() {
    this.validate();
  }

  onTestStringChange(e) {
    const testAgainstString = e.target.value;
    this.setState({ testAgainstString }, () => {
      this.validate();
    });
  }

  onMinimatchStringChange(e) {
    const minimatchString = e.target.value;
    this.setState({ minimatchString }, () => {
      this.validate();
    });
  }

  validate() {
    const contentEditableElement = this.state.contentEditableRef && ReactDOM.findDOMNode(this.state.contentEditableRef);
    if (contentEditableElement) {
      const children = contentEditableElement.children;
      for (let c of children) {
        if (minimatch(c.innerText, this.state.minimatchString)) {
          c.classList.add('App-editable-match');
        } else {
          c.classList.remove('App-editable-match');
        }
      }
    }
  }

  getContentEditableRef(ref) {
    ref && this.setState({ contentEditableRef: ref });
  }

  /**
   * Strip all html tags on paste
   * @param e
   */
  onPaste(e) {
    e.preventDefault();
    let text;
    const clp = (e.originalEvent || e).clipboardData;
    if (clp === undefined || clp === null) {
      text = window.clipboardData.getData("text") || "";
      if (text !== "") {
        text = text.replace(/<[^>]*>/g, "");
        if (window.getSelection) {
          const newNode = document.createElement("span");
          newNode.innerHTML = text;
          window.getSelection().getRangeAt(0).insertNode(newNode);
        } else {
          document.selection.createRange().pasteHTML(text);
        }
      }
    } else {
      text = clp.getData('text/plain') || "";
      if (text !== "") {
        text = text.replace(/<[^>]*>/g, "");
        document.execCommand('insertText', false, text);
      }
    }
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'><span className='App-title-mini'>mini</span>match Playground</h1>
        </header>
        <main>
          <div className='App-field'>
            <label>MINIMATCH STRING</label>
            <input type='text' value={this.state.minimatchString}
                   onChange={this.onMinimatchStringChange}
            />
          </div>
          <div className='App-field' onPaste={this.onPaste}>
            <label>TEST AGAINST <small>Successful matches highlighted in red</small></label>
            <ContentEditable
              className='App-editable'
              html={this.state.testAgaintString}
              disabled={false}
              onChange={this.onTestStringChange}
              ref={this.getContentEditableRef}
            />
          </div>
        </main>
        <footer>
          <div className='App-credits'>
            <p>Coded with <span role="img">❤</span>️ by Liron Zluf</p>
            <p><a href="https://lironzluf.github.io/" rel="noopener noreferrer" target="_blank">lironzluf.github.io</a></p>
            <p>Icons made by <a href="http://www.freepik.com" target="_blank" rel="noopener noreferrer" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" target="_blank" rel="noopener noreferrer" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></p>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
