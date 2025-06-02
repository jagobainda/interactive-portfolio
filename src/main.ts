declare const anime: any;

class App {
    constructor() {
        this.loadSavedTheme();

        this.typeTitle();

        this.loadLanguageStrings();

        this.bindEvents();
    }

    private bindEvents(): void {
        document.addEventListener("keydown", (event) =>
            this.handleKeydown(event)
        );

        const btnLightbulb = document.querySelector(
            "#theme-toggle"
        ) as HTMLButtonElement;
        if (btnLightbulb)
            btnLightbulb.addEventListener("click", () => this.toggleTheme());

        const btnContacts = document.querySelector(
            "#contact-button"
        ) as HTMLButtonElement;
        if (btnContacts)
            btnContacts.addEventListener("click", () =>
                this.openModal("contact")
            );

        const btnProjects = document.querySelector(
            "#btn-projects"
        ) as HTMLButtonElement;
        if (btnProjects)
            btnProjects.addEventListener("click", () =>
                this.openModal("projects")
            );

        const btnTechnologies = document.querySelector(
            "#btn-technologies"
        ) as HTMLButtonElement;
        if (btnTechnologies)
            btnTechnologies.addEventListener("click", () =>
                this.openModal("technologies")
            );

        const btnExperience = document.querySelector(
            "#btn-experience"
        ) as HTMLButtonElement;
        if (btnExperience)
            btnExperience.addEventListener("click", () =>
                this.openModal("experience")
            );

        const btnAboutMe = document.querySelector(
            "#btn-about-me"
        ) as HTMLButtonElement;
        if (btnAboutMe)
            btnAboutMe.addEventListener("click", () =>
                this.openModal("about-me")
            );

        const closeButtons = document.querySelectorAll(".close-btn");
        closeButtons.forEach((btn) => {
            btn.addEventListener("click", () => this.closeModal());
        });

        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    this.closeModal();
                }
            });
        });

        window.addEventListener('popstate', () => {
            const openModal = document.querySelector('.modal:not(.hidden)');
            if (openModal) {
                this.closeModal(true);
            }
        });
    }

    private loadSavedTheme(): void {
        const savedTheme = localStorage.getItem("jidev_theme") || "light";
        document.body.classList.toggle("dark", savedTheme === "dark");

        const icon = document.querySelector(
            "#theme-toggle i"
        ) as HTMLIFrameElement;

        if (!icon) return;

        icon.classList.toggle("bi-lightbulb-fill", savedTheme === "light");
        icon.classList.toggle("bi-lightbulb-off-fill", savedTheme === "dark");
    }

    private async loadLanguageStrings(): Promise<void> {
        const lang = navigator.language.toLowerCase().startsWith("es")
            ? "es"
            : "en";

        const path = `/language-strings/${lang}.json`;

        const res = await fetch(path);

        if (!res.ok) throw new Error(`Failed to load language file: ${path}`);

        const strings: Record<string, string> = await res.json();

        for (const [id, text] of Object.entries(strings)) {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        }
    }

    private typeTitle(): void {
        const el = document.getElementById("welcome-title");
        
        if (!el) return;

        const base = " Jagoba Inda > ";
        const fake = "Full sta";
        const real = "Backend Developer";
        const visitedKey = "jagoba_dev_visited";

        const randomDelay = () => Math.floor(Math.random() * 21) + 40;

        const write = (text: string, done: () => void) => {
            let i = 0;
            const step = () => {
                if (i > text.length) {
                    done();
                    return;
                }

                el.textContent += text.charAt(i++);
                setTimeout(step, randomDelay());
            };
            step();
        };

        const erase = (count: number, done: () => void) => {
            let removed = 0;
            const step = () => {
                if (removed >= count) {
                    done();
                    return;
                }

                el.textContent = el.textContent!.slice(0, -1);
                removed++;
                setTimeout(step, randomDelay());
            };
            step();
        };

        const finalize = () => {
            el.textContent = base + real;
        };

        const isDevelopment: boolean = !window.location.hostname.includes("jagoba.dev");

        if (!isDevelopment && localStorage.getItem(visitedKey)) {
            finalize();
            return;
        }
        
        el.textContent = "";

        write(base + fake, () =>
            setTimeout(() =>
                    erase(fake.length, () => {
                        write(real, () => localStorage.setItem(visitedKey, "true"));
                    }),
                500
            )
        );
    }

    private handleKeydown(event: KeyboardEvent): void {
        
    }

    private toggleTheme(): void {
        const icon = document.querySelector("#theme-toggle i") as HTMLIFrameElement;
        
        if (!icon) return;

        icon.classList.toggle("bi-lightbulb-fill");
        icon.classList.toggle("bi-lightbulb-off-fill");

        const theme = document.body.classList.toggle("dark") ? "dark" : "light";
        localStorage.setItem("jidev_theme", theme);
    }

    private openModal(id: string): void {
        const modal = document.getElementById(`modal-${id}`);
        if (!modal) return;

        modal.classList.remove("hidden");
        document.body.classList.add("modal-open");

        const content = modal.querySelector(".modal-content");
        if (!content) return;

        anime.remove(content);
        anime({
            targets: content,
            translateY: [-30, 0],
            scale: [0.95, 1],
            opacity: [0, 1],
            rotate: [-2, 0],
            boxShadow: [
                "0px 0px 0px rgba(0,0,0,0)",
                "0px 10px 25px rgba(0,0,0,0.2)",
            ],
            duration: 400,
            easing: "easeOutCubic",
            delay: 100,
        });

        if (id === 'technologies') this.initTechTabs();

        history.pushState({ modal: id }, "", `#${id}`);
    }

    private initTechTabs(): void {
        const tabButtons = document.querySelectorAll('.tech-tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                
                document.querySelectorAll('.tech-tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                document.querySelectorAll('.tech-tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                if (!target) return;
                
                button.classList.add('active');
                document.getElementById(target)?.classList.add('active');
            });
        });
    }

    private closeModal(skipHistory: boolean = false): void {
        const modal = document.querySelector(".modal:not(.hidden)");
        if (!modal) return;

        const content = modal.querySelector(".modal-content");
        if (!content) return;

        anime.remove(content);
        anime({
            targets: content,
            translateY: [0, 20],
            scale: [1, 0.9],
            opacity: [1, 0],
            rotate: [0, -1],
            boxShadow: [
                "0px 10px 25px rgba(0,0,0,0.2)",
                "0px 0px 0px rgba(0,0,0,0)",
            ],
            duration: 250,
            easing: "easeInQuart",
            complete: () => {
                modal.classList.add("hidden");
                document.body.classList.remove("modal-open");
                
                if (location.hash && !skipHistory) history.back();
            },
        });
    }
}

document.addEventListener("DOMContentLoaded", () => new App());
