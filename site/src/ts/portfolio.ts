// ##################################################################### //
// ############################ HELPER FUNCS ########################### //
// ##################################################################### //

/** Cache of elems manipulated by app */
type ElemCache = {
    tabBtns: NodeListOf<HTMLAnchorElement>;

    reelPageBtns: NodeListOf<HTMLAnchorElement>;
    projectPageBtns: NodeListOf<HTMLAnchorElement>;
    musicPageBtns: NodeListOf<HTMLAnchorElement>;
    compositionPageBtns: NodeListOf<HTMLAnchorElement>;

    sections: {
        reels: HTMLElement;
        projects: HTMLElement;
        music: HTMLElement;
        compositions: HTMLElement;
    };

    reelPages: NodeListOf<HTMLElement>;
    projectPages: NodeListOf<HTMLElement>;
    musicPages: NodeListOf<HTMLElement>;
    compositionPages: NodeListOf<HTMLElement>;
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
        reelPageBtns: document.querySelectorAll("[id^='btn-reel-']"),
        projectPageBtns: document.querySelectorAll("[id^='btn-project-']"),
        musicPageBtns: document.querySelectorAll("[id^='btn-music-']"),
        compositionPageBtns: document.querySelectorAll(
            "[id^='btn-composition-']"
        ),

        /**
         * Sections <- hidden / unhidden : click tab buttons
         * Created in index.html.haml
         */
        sections: {
            reels: document.querySelector("#reels"),
            projects: document.querySelector("#projects"),
            music: document.querySelector("#music"),
            compositions: document.querySelector("#compositions"),
        },

        /**
         * Containers in sections <- hidden / unhidden : click page buttons
         * Created in index.html.haml
         */
        reelPages: document.querySelectorAll("[id^='reel-']"),
        projectPages: document.querySelectorAll("[id^='project-']"),
        musicPages: document.querySelectorAll("[id^='music-']"),
        compositionPages: document.querySelectorAll("[id^='composition-']"),
    };
    return () => cache;
})();

// ##################################################################### //
// ############################# INIT FUNCS ############################ //
// ##################################################################### //

/**
 * Make a tab button hide / unhide content sections and set active tab.
 */
function initTabBtn(tabBtn: HTMLAnchorElement) {
    let cache = GetElemCache();
    const targetSectionTag = tabBtn.className;

    tabBtn.addEventListener("click", () => {
        // Use CSS classes to hide / unhide
        for (const id in cache.sections) {
            const section: HTMLElement = cache.sections[id];
            if (id == targetSectionTag) section.classList.remove("is-hidden");
            else section.classList.add("is-hidden");
        }
        // Use CSS classes to set active
        for (const _tabBtn of cache.tabBtns)
            _tabBtn.parentElement.classList.remove("is-active");
        tabBtn.parentElement.classList.add("is-active");
    });
}

/**
 * Make a page button hide / unhide content sections and set active page.
 *
 */
function initPageBtn(pageBtn: HTMLAnchorElement) {
    let cache = GetElemCache();

    // Get id of page (container in section). Extracts it from page button id
    const targetPageId = pageBtn.id.slice("btn-".length);
    const targetPageType = targetPageId.slice(0, targetPageId.indexOf("-"));
    const targetPageNum = targetPageId.slice(targetPageId.indexOf("-") + 1);
    const targetPageBtnList = targetPageType + "PageBtns";
    const targetPagesList = targetPageType + "Pages";

    pageBtn.addEventListener("click", () => {
        // Use CSS classes to hide / unhide
        for (const elem of cache[targetPagesList] as NodeListOf<HTMLElement>) {
            if (elem.id == targetPageId)
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
    });
}

// ##################################################################### //
// ################################ MAIN ############################### //
// ##################################################################### //

document.addEventListener("DOMContentLoaded", () => {
    let cache = GetElemCache();

    // Tab buttons -> hide / unhide : sections
    for (const tabBtn of cache.tabBtns) initTabBtn(tabBtn);
    cache.tabBtns[0]?.click();

    // Pagination buttons -> hide / unhide : containers in sections
    for (const pageBtn of cache.reelPageBtns) initPageBtn(pageBtn);
    cache.reelPageBtns[0]?.click();
    for (const pageBtn of cache.projectPageBtns) initPageBtn(pageBtn);
    cache.projectPageBtns[0]?.click();
    for (const pageBtn of cache.musicPageBtns) initPageBtn(pageBtn);
    cache.musicPageBtns[0]?.click();
    for (const pageBtn of cache.compositionPageBtns) initPageBtn(pageBtn);
    cache.compositionPageBtns[0]?.click();
});
