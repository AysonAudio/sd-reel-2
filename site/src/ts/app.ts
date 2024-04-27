// ##################################################################### //
// ############################ HELPER FUNCS ########################### //
// ##################################################################### //

/** Cache of elems manipulated by app */
type ElemCache = {
    tabBtns: NodeListOf<HTMLAnchorElement>;

    portfolioPageBtns: NodeListOf<HTMLAnchorElement>;
    projectPageBtns: NodeListOf<HTMLAnchorElement>;

    reelBtns: NodeListOf<HTMLAnchorElement>;

    sections: {
        portfolios: HTMLElement;
        projects: HTMLElement;
    };

    portfolioPages: NodeListOf<HTMLElement>;
    projectPages: NodeListOf<HTMLElement>;

    reelVidBoxes: NodeListOf<HTMLDivElement>;
    reelVids: NodeListOf<HTMLVideoElement>;
};

/**
 * A decorated function.
 * One global {@link ElemCache} object is initialized in the decorator.
 * Calling the resulting function returns the same object every time.
 */
export const GetElemCache: () => ElemCache = (() => {
    let cache: ElemCache = {
        /**
         * Tab buttons -> hide / unhide : sections
         * Created in parts/_tab.haml | Used in index.html.haml
         */
        tabBtns: document.querySelectorAll("#tabs > .tabs > ul > li > a"),

        /**
         * Pagination buttons -> hide / unhide : containers in sections
         * Created in blocks/_nav.haml | Used in index.html.haml
         */
        portfolioPageBtns: document.querySelectorAll("[id^='btn-portfolio-']"),
        projectPageBtns: document.querySelectorAll("[id^='btn-project-']"),

        /**
         * Reel gallery menu buttons -> hide / unhide : reel videos
         * Created in blocks/_reel-gallery.haml | Used in index.html.haml
         */
        reelBtns: document.querySelectorAll("[id^='reel-btn-']"),

        /**
         * Sections <- hidden / unhidden : click tab buttons
         * Created in index.html.haml
         */
        sections: {
            portfolios: document.querySelector("#portfolios"),
            projects: document.querySelector("#projects"),
        },

        /**
         * Containers in sections <- hidden / unhidden : click page buttons
         * Created in index.html.haml
         */
        portfolioPages: document.querySelectorAll("[id^='portfolio-']"),
        projectPages: document.querySelectorAll("[id^='project-']"),

        /**
         * Reel videos in pages <- hidden / unhidden : click reel buttons
         * Created in blocks/_reel-gallery.haml | Used in index.html.haml
         */
        reelVidBoxes: document.querySelectorAll("[id^='reel-vid-box-']"),
        reelVids: document.querySelectorAll("[id^='reel-vid-box-'] > video"),
    };
    return () => cache;
})();

// ##################################################################### //
// ############################# INIT FUNCS ############################ //
// ##################################################################### //

/**
 * Make a tab button:
 *   Hide / unhide content sections
 *   Set active tab button
 *   Pause all reel videos
 */
function initTabBtn(tabBtn: HTMLAnchorElement) {
    let cache = GetElemCache();

    // Get tag of section to unhide. Extracts it from tab button class
    const targetSectionTag = tabBtn.className;

    tabBtn.addEventListener("click", () => {
        // Use CSS classes to hide / unhide content sections
        for (const id in cache.sections) {
            const section: HTMLElement = cache.sections[id];
            if (id === targetSectionTag) section.classList.remove("is-hidden");
            else section.classList.add("is-hidden");
        }
        // Use CSS classes to set active tab button
        for (const _tabBtn of cache.tabBtns)
            _tabBtn.parentElement.classList.remove("is-active");
        tabBtn.parentElement.classList.add("is-active");
        // Pause all reel videos
        for (const elem of cache.reelVids) elem.pause();
    });
}

/**
 * Make a page button:
 *   Hide / unhide content subsections
 *   Set active page button
 *   Pause all reel videos
 */
function initPageBtn(pageBtn: HTMLAnchorElement) {
    let cache = GetElemCache();

    // Get id of page to unhide. Extracts it from page button id
    const targetPageId = pageBtn.id.slice("btn-".length);
    const targetPageType = targetPageId.slice(0, targetPageId.indexOf("-"));
    const targetPageNum = targetPageId.slice(targetPageId.indexOf("-") + 1);
    const targetPageBtnList = targetPageType + "PageBtns";
    const targetPagesList = targetPageType + "Pages";

    pageBtn.addEventListener("click", () => {
        // Use CSS classes to hide / unhide pages
        for (const elem of cache[targetPagesList] as NodeListOf<HTMLElement>) {
            if (elem.id === targetPageId)
                for (const child of elem.children)
                    child.classList.remove("is-hidden");
            else
                for (const child of elem.children)
                    child.classList.add("is-hidden");
        }
        // Update screen reader metadata
        for (const _pageBtn of cache[targetPageBtnList]) {
            _pageBtn.classList.remove("is-current");
            _pageBtn.setAttribute(
                "aria-label",
                "Goto page " + (targetPageNum + 1)
            );
            _pageBtn.removeAttribute("aria-current");
        }
        pageBtn.classList.add("is-current");
        pageBtn.setAttribute("aria-label", "Page " + (targetPageNum + 1));
        pageBtn.setAttribute("aria-current", "page");
        // Pause all reel videos
        for (const elem of cache.reelVids) elem.pause();
    });
}

/**
 * Make a reel gallery menu button:
 *   Hide / unhide reel video boxes
 *   Set active menu button
 *   Pause all reel videos
 */
function initReelBtn(reelBtn: HTMLAnchorElement) {
    let cache = GetElemCache();

    // Get id of video to unhide. Extracts uuid substring from reel button id.
    const uuid = reelBtn.id.slice("reel-btn-".length);
    const boxId = "reel-vid-box-" + uuid;

    reelBtn.addEventListener("click", () => {
        // Use CSS classes to hide / unhide reel video boxes
        for (const elem of cache.reelVidBoxes) {
            if (elem.id === boxId) elem.classList.remove("is-hidden");
            else elem.classList.add("is-hidden");
        }
        // Use CSS classes to set active menu button
        for (const elem of cache.reelBtns) {
            if (elem.id === reelBtn.id) elem.classList.add("is-active");
            else elem.classList.remove("is-active");
        }
        // Pause all reel videos
        for (const elem of cache.reelVids) elem.pause();
    });
}

// ##################################################################### //
// ################################ MAIN ############################### //
// ##################################################################### //

document.addEventListener("DOMContentLoaded", () => {
    let cache = GetElemCache();

    // Tab buttons -> hide / unhide : sections
    for (const tabBtn of cache.tabBtns) initTabBtn(tabBtn);

    // Pagination buttons -> hide / unhide : containers in sections
    for (const pageBtn of cache.portfolioPageBtns) initPageBtn(pageBtn);
    for (const pageBtn of cache.projectPageBtns) initPageBtn(pageBtn);
    // Default to first page
    cache.portfolioPageBtns[0]?.click();
    cache.projectPageBtns[0]?.click();

    // Reel gallery menu buttons -> hide / unhide : reel videos
    for (const reelBtn of cache.reelBtns) initReelBtn(reelBtn);
});
