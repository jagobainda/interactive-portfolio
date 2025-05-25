declare const anime: any;

class App {
    constructor() {
        this.loadSavedTheme();

        this.loadLanguageStrings();

        this.bindEvents();
    }

    private bindEvents(): void {
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
                this.openConntactModal()
            );

        const btnCloseModal = document.querySelector(
            "#close-btn"
        ) as HTMLButtonElement;
        if (btnCloseModal)
            btnCloseModal.addEventListener("click", () => this.closeModal());
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

    private loadSavedTheme(): void {
        const savedTheme = localStorage.getItem("jidev_theme") || "light";
        document.body.classList.toggle("dark", savedTheme === "dark");

        const icon = document.querySelector(
            "#theme-toggle i"
        ) as HTMLIFrameElement;
        if (icon) {
            icon.classList.toggle("bi-lightbulb-fill", savedTheme === "light");
            icon.classList.toggle(
                "bi-lightbulb-off-fill",
                savedTheme === "dark"
            );
        }
    }

    private toggleTheme(): void {
        const icon = document.querySelector(
            "#theme-toggle i"
        ) as HTMLIFrameElement;
        if (!icon) return;

        icon.classList.toggle("bi-lightbulb-fill");
        icon.classList.toggle("bi-lightbulb-off-fill");

        const theme = document.body.classList.toggle("dark") ? "dark" : "light";
        localStorage.setItem("jidev_theme", theme);
    }

    private openConntactModal(): void {
        this.openModal("contact");
    }

    private openModal(id: string) {
        const modal = document.getElementById(`modal-${id}`);
        if (!modal) return;

        modal.classList.remove("hidden");
        document.body.classList.add("modal-open");

        const content = modal.querySelector(".modal-content");
        if (!content) return;

        anime.remove(content);
        anime({
            targets: content,
            translateY: [-40, 0],
            scale: [0.9, 1],
            opacity: [0, 1],
            boxShadow: [
                "0px 0px 0px rgba(0,0,0,0)",
                "0px 10px 25px rgba(0,0,0,0.2)",
            ],
            duration: 700,
            easing: "easeOutElastic(1, .6)",
            delay: 100,
        });

        history.pushState({ modal: id }, "", `#${id}`);
    }

    private closeModal() {
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
            duration: 400,
            easing: "easeInQuart",
            complete: () => {
                modal.classList.add("hidden");
                document.body.classList.remove("modal-open");
                if (location.hash) history.back();
            },
        });
    }
}

document.addEventListener("DOMContentLoaded", () => new App());
