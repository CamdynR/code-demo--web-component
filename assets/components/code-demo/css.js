// code-demo - css.js

export const styles = document.createElement('style');
styles.innerHTML = `
  :host {
    --code-demo--border-rad: 5px;
    --code-demo--drop-shadow: drop-shadow(0 0 15px rgba(0,0,0,0.18));
    --code-demo--figure-margin: 0;
    --code-demo--figure-padding: 50px 2%;
    --code-demo--height: 400px;
    --code-demo--width: 1100px;
  }

  iframe {
    border: none;
  }

  iframe,
  figure,
  section,
  pre {
    height: 100%;
    width: 100%;
  }

  figure {
    background-color: #d8d9e3;
    border-radius: var(--code-demo--border-rad);
    box-sizing: border-box;
    column-gap: 2%;
    display: grid;
    filter: var(--code-demo--drop-shadow);
    grid-template-columns: 49% 49%;
    margin: var(--code-demo--figure-margin);
    padding: var(--code-demo--figure-padding);
    width: var(--code-demo--width);
  }

  pre {
    margin: 0 !important;
  }

  pre::before,
  pre::after {
    display: none !important;
  }

  section {
    background-color: white;
    height: 400px;
  }
`;