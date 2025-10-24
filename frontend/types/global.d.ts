/// <reference types="next" />

// Declaración de tipos para imports de CSS
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Declaración para side-effect imports de CSS
declare module '*.css' {
  const content: any;
  export = content;
}
