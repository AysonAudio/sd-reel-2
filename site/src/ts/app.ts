// ##################################################################### //
// ############################ HELPER FUNCS ########################### //
// ##################################################################### //

/** Cache of elems manipulated by app */
type ElemCache = {
    tabBtns: NodeListOf<HTMLAnchorElement>;

    portfolioPageBtns: NodeListOf<HTMLAnchorElement>;
    projectPageBtns: NodeListOf<HTMLAnchorElement>;

    sections: {
        portfolios: HTMLElement;
        projects: HTMLElement;
    };

    portfolioPages: NodeListOf<HTMLElement>;
    projectPages: NodeListOf<HTMLElement>;
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

    // Get tag of section to unhide. Extracts it from tab button class.
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
    for (const pageBtn of cache.portfolioPageBtns) initPageBtn(pageBtn);
    cache.portfolioPageBtns[0]?.click();
    for (const pageBtn of cache.projectPageBtns) initPageBtn(pageBtn);
    cache.projectPageBtns[0]?.click();
});
