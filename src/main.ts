declare const anime: any;

class App {
    public lang: string;

    constructor() {
        this.lang = navigator.language.toLowerCase().startsWith("es") ? "es" : "en";

        this.loadSavedTheme();

        this.typeTitle();

        this.loadLanguageStrings();

        this.loadProjects();
        this.loadExperience();
        this.loadTechnologies();
        this.loadAboutMe();

        this.bindEvents();
    }

    private bindEvents(): void {
        document.addEventListener("keydown", event => this.handleKeydown(event));

        const btnLightbulb = document.querySelector("#theme-toggle") as HTMLButtonElement;
        if (btnLightbulb) btnLightbulb.addEventListener("click", () => this.toggleTheme());

        const btnContacts = document.querySelector("#contact-button") as HTMLButtonElement;
        if (btnContacts) btnContacts.addEventListener("click", () => this.openModal("contact"));

        const btnProjects = document.querySelector("#btn-projects") as HTMLButtonElement;
        if (btnProjects) btnProjects.addEventListener("click", () => this.openModal("projects"));

        const btnTechnologies = document.querySelector("#btn-technologies") as HTMLButtonElement;
        if (btnTechnologies) btnTechnologies.addEventListener("click", () => this.openModal("technologies"));

        const btnExperience = document.querySelector("#btn-experience") as HTMLButtonElement;
        if (btnExperience) btnExperience.addEventListener("click", () => this.openModal("experience"));

        const btnAboutMe = document.querySelector("#btn-about-me") as HTMLButtonElement;
        if (btnAboutMe) btnAboutMe.addEventListener("click", () => this.openModal("about-me"));

        const closeButtons = document.querySelectorAll(".close-btn");
        closeButtons.forEach(btn => {
            btn.addEventListener("click", () => this.closeModal());
        });

        const modals = document.querySelectorAll(".modal");
        modals.forEach(modal => {
            modal.addEventListener("click", event => {
                if (event.target === modal) {
                    this.closeModal();
                }
            });
        });

        window.addEventListener("popstate", () => {
            const openModal = document.querySelector(".modal:not(.hidden)");
            if (openModal) {
                this.closeModal(true);
            }
        });
    }

    private loadSavedTheme(): void {
        const savedTheme = localStorage.getItem("jidev_theme") || "dark";
        document.body.classList.toggle("dark", savedTheme === "dark");

        const icon = document.querySelector("#theme-toggle i") as HTMLIFrameElement;

        if (!icon) return;

        icon.classList.toggle("bi-lightbulb-fill", savedTheme === "light");
        icon.classList.toggle("bi-lightbulb-off-fill", savedTheme === "dark");
    }

    private async loadLanguageStrings(): Promise<void> {
        document.documentElement.lang = this.lang;

        const path = `/language-strings/${this.lang}.json`;

        const res = await fetch(path);

        if (!res.ok) throw new Error(`Failed to load language file: ${path}`);

        const strings: Record<string, string> = await res.json();

        for (const [id, text] of Object.entries(strings)) {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        }
    }

    private async loadProjects(): Promise<void> {
        interface Project {
            name: string;
            description: string;
            image: string;
            tags: string[];
            links: {
                text: string;
                url: string;
                icon: string;
            }[];
        }

        interface ProjectsData {
            tabNames: {
                personal: string;
                work: string;
                student: string;
            };
            personal: Project[];
            work: Project[];
            student: Project[];
        }

        try {
            const res = await fetch(`/data/modal-projects-${this.lang}.json`);
            if (!res.ok) throw new Error("Failed to load projects data");

            const data: ProjectsData = await res.json();

            document.getElementById("btn-personal-tab")!.textContent = data.tabNames.personal;
            document.getElementById("btn-work-tab")!.textContent = data.tabNames.work;
            document.getElementById("btn-student-tab")!.textContent = data.tabNames.student;

            const projectsMap: Record<string, Project[]> = {
                "personal-tab": data.personal,
                "work-tab": data.work,
                "student-tab": data.student
            };

            for (const [tabId, projects] of Object.entries(projectsMap)) {
                const container = document.querySelector(`#${tabId} .project-grid`);
                if (!container) continue;

                container.innerHTML = "";

                projects.forEach(project => {
                    const projectCard = document.createElement("div");
                    projectCard.className = "project-card";

                    let linksHTML = "";
                    project.links.forEach(link => {
                        linksHTML += `
                            <a href="${link.url}" class="project-link" ${link.url.startsWith("http") ? 'target="_blank"' : ""}>
                                <i class="${link.icon}"></i>
                                ${link.text}
                            </a>
                        `;
                    });

                    let tagsHTML = "";
                    project.tags.forEach(tag => {
                        tagsHTML += `<span class="project-tag">
                            <i class="bi bi-check-circle-fill"></i>
                            ${tag}
                        </span>`;
                    });

                    projectCard.innerHTML = `
                        <div class="project-info">
                            <h3 class="project-name">${project.name}</h3>
                            <p class="project-description">${project.description}</p>
                            <div class="project-tags">
                                ${tagsHTML}
                            </div>
                            <div class="project-links">
                                ${linksHTML}
                            </div>
                        </div>
                    `;

                    container.appendChild(projectCard);
                });
            }
        } catch (error) {
            console.error("Failed to load projects:", error);
        }
    }

    private async loadTechnologies(): Promise<void> {
        type TechnologyItem = {
            icon: string;
            name: string;
            category?: string;
        };

        try {
            const res = await fetch("/data/modal-technologies.json");
            if (!res.ok) throw new Error("Failed to load technology data");

            const data = await res.json();

            const items: TechnologyItem[] = [...data.technologies.map((item: TechnologyItem) => ({ ...item, category: "tech" })), ...data.programmingTools.map((item: TechnologyItem) => ({ ...item, category: "prog" })), ...data.operatingSystems.map((item: TechnologyItem) => ({ ...item, category: "os" }))];

            const containerMap: Record<string, HTMLElement | null> = {
                tech: document.querySelector("#tech-tab .tech-grid"),
                prog: document.querySelector("#prog-tab .tech-grid"),
                os: document.querySelector("#os-tab .tech-grid")
            };

            for (const item of items) {
                const container = containerMap[item.category || ""];
                if (!container) continue;

                const div = document.createElement("div");
                div.className = "tech-item";

                div.innerHTML = `
                    <i class="tech-icon ${item.icon} colored"></i>
                    <div class="tech-name">${item.name}</div>
                `;

                container.appendChild(div);
            }
        } catch (error) {
            console.error("Failed to load technologies:", error);
        }
    }

    private async loadExperience(): Promise<void> {
        try {
            const res = await fetch(`/data/modal-experience-${this.lang}.json`);
            if (!res.ok) throw new Error("Failed to load experience data");

            const data = await res.json();

            const modalBody = document.querySelector("#modal-experience .modal-body");
            if (!modalBody) return;

            modalBody.innerHTML = "";

            const timelineContainer = document.createElement("div");
            timelineContainer.className = "experience-timeline";
            modalBody.appendChild(timelineContainer);

            data.experiences.forEach((exp: any, index: number) => {
                const experienceCard = document.createElement("div");
                experienceCard.className = "experience-card";

                const header = document.createElement("div");
                header.className = "experience-header";

                const iconDiv = document.createElement("div");
                iconDiv.className = "experience-icon";
                iconDiv.innerHTML = `<i class="${exp.icon}"></i>`;

                const titleDiv = document.createElement("div");
                titleDiv.className = "experience-title";
                titleDiv.innerHTML = `
                    <h3>${exp.position}</h3>
                    <div class="company-info">
                        <span class="company-name">${exp.company}</span>
                        <span class="location">${exp.location}</span>
                    </div>
                    <div class="period">${exp.period}</div>
                `;

                header.appendChild(iconDiv);
                header.appendChild(titleDiv);
                experienceCard.appendChild(header);

                if (exp.responsibilities && exp.responsibilities.length) {
                    const respDiv = document.createElement("div");
                    respDiv.className = "experience-responsibilities";

                    const respTitle = document.createElement("h4");
                    respTitle.textContent = this.lang === "es" ? "Responsabilidades:" : "Responsibilities:";
                    respDiv.appendChild(respTitle);

                    const respList = document.createElement("ul");
                    exp.responsibilities.forEach((resp: string) => {
                        const li = document.createElement("li");
                        li.textContent = resp;
                        respList.appendChild(li);
                    });

                    respDiv.appendChild(respList);
                    experienceCard.appendChild(respDiv);
                }

                if (exp.technologies && exp.technologies.length) {
                    const techDiv = document.createElement("div");
                    techDiv.className = "experience-technologies";

                    const techTitle = document.createElement("h4");
                    techTitle.textContent = this.lang === "es" ? "Tecnologías:" : "Technologies:";
                    techDiv.appendChild(techTitle);

                    const skillsList = document.createElement("div");
                    skillsList.className = "skills-list";

                    exp.technologies.forEach((tech: string) => {
                        const skillItem = document.createElement("span");
                        skillItem.className = "skill-item";

                        skillItem.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${tech}`;
                        skillsList.appendChild(skillItem);
                    });

                    techDiv.appendChild(skillsList);
                    experienceCard.appendChild(techDiv);
                }

                timelineContainer.appendChild(experienceCard);

                if (index < data.experiences.length - 1) {
                    const connector = document.createElement("div");
                    connector.className = "timeline-connector";
                    timelineContainer.appendChild(connector);
                }
            });
        } catch (error) {
            console.error("Failed to load experience data:", error);
        }
    }

    private async loadAboutMe(): Promise<void> {
        type Section = { title: string; content: string; icon: string };
        type AboutMe = {
            intro: string;
            sections: Section[];
            quote?: string;
            date: string;
        };

        const res = await fetch(`/data/modal-aboutme-${this.lang}.json`);

        if (!res.ok) return console.error("Failed to load about me data");

        const data = (await res.json()) as AboutMe;
        const { intro, sections, quote, date } = data;

        const birth = new Date(date);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

        const modalBody = document.querySelector("#modal-about-me .modal-body");
        if (!modalBody) return;
        modalBody.innerHTML = "";

        const introEl = document.createElement("div");
        introEl.className = "about-section about-intro";
        introEl.innerHTML = `<p>${intro.replace("--AGE-PLACEHOLDER--", age.toString())}</p>`;
        modalBody.appendChild(introEl);

        const container = document.createElement("div");
        container.className = "about-sections";
        sections.forEach(({ title, icon, content }) => {
            const el = document.createElement("div");
            el.className = "about-section";
            el.innerHTML = `
                <div class="section-header">
                    <i class="${icon}"></i>
                    <h3>${title}</h3>
                </div>
                <div class="section-content">
                    <p>${content}</p>
                </div>
            `;
            container.appendChild(el);
        });

        modalBody.appendChild(container);

        if (quote) {
            const q = document.createElement("div");
            q.className = "about-section about-quote";
            q.innerHTML = `<blockquote>${quote}</blockquote>`;
            modalBody.appendChild(q);
        }
    }

    private typeTitle(): void {
        const el = document.getElementById("welcome-title");

        if (!el) return;

        const base = " Jagoba Inda ~$ ";
        const text = "Full Stack Developer";
        const visitedKey = "jagoba_dev_visited";

        const randomDelay = () => Math.floor(Math.random() * 81) + 60;

        const write = (fullText: string, done: () => void) => {
            let i = 0;
            const step = () => {
                if (i > fullText.length) {
                    done();
                    return;
                }

                el.textContent += fullText.charAt(i++);
                setTimeout(step, randomDelay());
            };
            step();
        };

        const finalize = () => {
            el.textContent = base + text;
        };

        if (localStorage.getItem(visitedKey)) {
            finalize();
            return;
        }

        el.textContent = "";

        write(base + text, () => localStorage.setItem(visitedKey, "true"));
    }

    private handleKeydown(event: KeyboardEvent): void {
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

        switch (event.key) {
            case "1":
                this.handleModalShortcut("projects");
                break;
            case "2":
                this.handleModalShortcut("technologies");
                break;
            case "3":
                this.handleModalShortcut("experience");
                break;
            case "4":
                this.handleModalShortcut("about-me");
                break;
            case "c":
            case "C":
                this.handleModalShortcut("contact");
                break;
            case "t":
            case "T":
                this.toggleTheme();
                break;
            case "Escape":
                this.closeModal();
                break;
        }
    }

    private handleModalShortcut(modalId: string): void {
        const currentModal = document.querySelector(".modal:not(.hidden)");

        if (currentModal) {
            const currentModalId = currentModal.id.replace("modal-", "");

            if (currentModalId === modalId) {
                this.closeModal();
                return;
            }

            this.closeModal(false, () => {
                this.openModal(modalId);
            });
        } else {
            this.openModal(modalId);
        }
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
        if ((this as any)._modalTransitionInProgress) return;

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
            boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 10px 25px rgba(0,0,0,0.2)"],
            duration: 400,
            easing: "easeOutCubic",
            delay: 100
        });

        if (id === "technologies") this.initTechTabs();
        if (id === "projects") this.initProjectTabs();

        history.pushState({ modal: id }, "", `#${id}`);
    }

    private initTechTabs(): void {
        const tabButtons = document.querySelectorAll(".tech-tab-btn");

        tabButtons.forEach(button => {
            button.addEventListener("click", () => {
                const target = button.getAttribute("data-target");

                document.querySelectorAll(".tech-tab-btn").forEach(btn => {
                    btn.classList.remove("active");
                });

                document.querySelectorAll(".tech-tab-content").forEach(content => {
                    content.classList.remove("active");
                });

                if (!target) return;

                button.classList.add("active");
                document.getElementById(target)?.classList.add("active");
            });
        });
    }

    private initProjectTabs(): void {
        const tabButtons = document.querySelectorAll(".project-tab-btn");

        tabButtons.forEach(button => {
            button.addEventListener("click", () => {
                const target = button.getAttribute("data-target");

                document.querySelectorAll(".project-tab-btn").forEach(btn => {
                    btn.classList.remove("active");
                });

                document.querySelectorAll(".project-tab-content").forEach(content => {
                    content.classList.remove("active");
                });

                if (!target) return;

                button.classList.add("active");
                document.getElementById(target)?.classList.add("active");
            });
        });
    }

    private closeModal(skipHistory: boolean = false, callback?: () => void): void {
        const modal = document.querySelector(".modal:not(.hidden)");
        if (!modal) {
            if (callback) callback();
            return;
        }

        const content = modal.querySelector(".modal-content");
        if (!content) {
            if (callback) callback();
            return;
        }

        anime.remove(content);

        (this as any)._modalTransitionInProgress = true;

        anime({
            targets: content,
            translateY: [0, 20],
            scale: [1, 0.9],
            opacity: [1, 0],
            rotate: [0, -1],
            boxShadow: ["0px 10px 25px rgba(0,0,0,0.2)", "0px 0px 0px rgba(0,0,0,0)"],
            duration: 250,
            easing: "easeInQuart",
            complete: () => {
                modal.classList.add("hidden");
                document.body.classList.remove("modal-open");

                if (location.hash && !skipHistory) history.back();

                (this as any)._modalTransitionInProgress = false;

                if (callback) setTimeout(callback, 50);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => new App());
