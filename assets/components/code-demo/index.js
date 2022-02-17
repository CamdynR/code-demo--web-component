// code-demo - index.js

import { styles } from './css.js';
const prismLocations = {
  js: 'assets/components/code-demo/PrismJS/prism.js',
  css: 'assets/components/code-demo/PrismJS/prism.css'
};

class CodeDemo extends HTMLElement {
  constructor() {
    super();

    const markup = document.createElement('figure');
    markup.innerHTML = `
      <section id="section--code">
        <pre><code class="line-numbers" contenteditable autocorrect="off" spellcheck="false"></code></pre>
      </section>
      <section id="output">
        <iframe srcdoc=""></iframe>
      </section>
    `;

    const prismJS = document.createElement('script');
    const prismCSS = document.createElement('link');
    prismJS.src = prismLocations.js;
    prismCSS.href = prismLocations.css;
    prismCSS.rel = 'stylesheet';

    const codeElem = markup.querySelector('code');
    codeElem.addEventListener('keyup', () => {
      this.rerender();
    });

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(prismCSS, prismJS, styles, markup);
  }

  connectedCallback() {
    if (this.getAttribute('repo') && this.getAttribute('dir')) {
      this.pullRepoTree();
    }
  }

  pullRepoTree() {
    const repo = this.getAttribute('repo');
    const dir = this.getAttribute('dir');
    fetch(repo)
      .then(response => response.json())
      .then(({tree}) => {
        this.files = tree.filter(file => file.path.startsWith(dir));
        this.files = this.files.map(file => {
          file.url = file.url.replace('http://localhost:3001/examples', repo);
          return file;
        });
        this.pullCode();
      })
      .catch(err => console.error(err));
  }

  pullCode() {
    let numFetched = 0;
    for (let i = 0; i < this.files.length; i++) {
      fetch(this.files[i].url)
        .then(response => response.json())
        .then(data => {
          this.files[i].code = atob(data.content);
          numFetched += 1;
          if (numFetched == this.files.length) {
            this.render();
          }
        })
        .catch(err => console.error(err));
    }
  }

  render() {
    const codeElem = this.shadowRoot.querySelector('code');
    const iframeElem = this.shadowRoot.querySelector('iframe');
    this.codeElem = codeElem;
    this.iframeElem = iframeElem;

    let index = this.files.reduce(file => {
      if (file.path.endsWith('index.html')) return file;
    });

    index = index.length > 0 ? index[0] : this.files[0];
    const language = index.path.split('.').pop();

    codeElem.innerHTML = index.code.replaceAll('<', '&lt;');
    codeElem.classList.add(`language-${language}`);
    const receiveMsg = `
      <script type="module">
      window.addEventListener('message', (event) => {
        const { type, value } = event.data;

        if (type === 'html') {
          document.body.innerHTML = value;
        }
      });
      </script>
    `;
    const insertIndex = index.code.indexOf('</head>');
    index.code = index.code.slice(0, insertIndex)
      + receiveMsg + index.code.slice(insertIndex);
    iframeElem.srcdoc = index.code;

    if (Prism) Prism.highlightElement(codeElem);
  }

  rerender() {
    if (!Prism) return;

    const selection = window.getSelection();

    // Prism.highlightElement(this.codeElem);

    let newTxt = this.codeElem.textContent;
    const receiveMsg = `
      <script type="module">
      window.addEventListener('message', (event) => {
        const { type, value } = event.data;

        if (type === 'html') {
          document.body.innerHTML = value;
        }
      });
      </script>
    `;
    const insertIndex = newTxt.indexOf('</head>');
    newTxt = newTxt.slice(0, insertIndex)
      + receiveMsg + newTxt.slice(insertIndex);

    this.iframeElem.contentWindow.postMessage({
      type: 'html',
      value: newTxt
    }, '*');
  }
}

customElements.define('code-demo', CodeDemo);