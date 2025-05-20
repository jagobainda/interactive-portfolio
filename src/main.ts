import anime from 'animejs/lib/anime.es.js';

class App {
  constructor() {
    //this.loadLanguageStrings();

    this.bindEvents();
  }

  private bindEvents(): void {
    const btnLightbulb = document.querySelector('#theme-toggle') as HTMLButtonElement;
    if (btnLightbulb)  btnLightbulb.addEventListener('click', () => this.toggleTheme());
    
    const btnContacts = document.querySelector('#contact-button') as HTMLButtonElement;
    if (btnContacts)  btnContacts.addEventListener('click', () => this.toggleTheme());
  }

  private toggleTheme(): void {
    console.log("Toggle theme");
    
    const icon = document.querySelector('#theme-toggle i') as HTMLIFrameElement;
    if (!icon) return;
    icon.classList.toggle("bi-lightbulb-fill");
    icon.classList.toggle("bi-lightbulb-off-fill");

    const theme = document.body.classList.toggle('dark') ? 'dark' : 'light';
    localStorage.setItem('jidev_theme', theme);
  }

  private async loadLanguageStrings(): Promise<void> {
    const lang = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
    const path = `/language-strings/${lang}.json`;

    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load language file: ${path}`);
    const strings: Record<string, string> = await res.json();

    for (const [id, text] of Object.entries(strings)) {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => new App());
