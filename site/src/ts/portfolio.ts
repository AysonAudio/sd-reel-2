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
        tabBtns: document.querySelectorAll("#tabs > .tabs > ul > li > a"),

        reelPageBtns: document.querySelectorAll("[id^='btn-reel-']"),
        projectPageBtns: document.querySelectorAll("[id^='btn-project-']"),
        musicPageBtns: document.querySelectorAll("[id^='btn-music-']"),
        compositionPageBtns: document.querySelectorAll(
            "[id^='btn-composition-']"
        ),

        sections: {
            reels: document.querySelector("#reels"),
            projects: document.querySelector("#projects"),
            music: document.querySelector("#music"),
            compositions: document.querySelector("#compositions"),
        },

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

/** Make a tab button hide / unhide content sections and set active tab */
function initTabBtn(tabBtn: HTMLAnchorElement) {
    let cache = GetElemCache();
    const targetSectionId = tabBtn.className;

    tabBtn.addEventListener("click", () => {
        for (const id in cache.sections) {
            const section: HTMLElement = cache.sections[id];
            if (id == targetSectionId) section.classList.remove("is-hidden");
            else section.classList.add("is-hidden");
        }

        for (const _tabBtn of cache.tabBtns)
            _tabBtn.parentElement.classList.remove("is-active");
        tabBtn.parentElement.classList.add("is-active");
    });
}

/** Make a page button hide / unhide content sections and set active page */
function initPageBtn(pageBtn: HTMLAnchorElement) {
    let cache = GetElemCache();
    const targetPageId = pageBtn.id.slice("btn-".length);
    const targetPageType = targetPageId.slice(0, targetPageId.indexOf("-"));
    const targetPageNum = targetPageId.slice(targetPageId.indexOf("-") + 1);
    const targetPageBtnList = targetPageType + "PageBtns";
    const targetPagesList = targetPageType + "Pages";

    pageBtn.addEventListener("click", () => {
        for (const elem of cache[targetPagesList] as NodeListOf<HTMLElement>) {
            if (elem.id == targetPageId)
                for (const child of elem.children)
                    child.classList.remove("is-hidden");
            else
                for (const child of elem.children)
                    child.classList.add("is-hidden");
        }

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

    for (const tabBtn of cache.tabBtns) initTabBtn(tabBtn);
    cache.tabBtns[0]?.click();

    for (const pageBtn of cache.reelPageBtns) initPageBtn(pageBtn);
    cache.reelPageBtns[0]?.click();

    for (const pageBtn of cache.projectPageBtns) initPageBtn(pageBtn);
    cache.projectPageBtns[0]?.click();

    for (const pageBtn of cache.musicPageBtns) initPageBtn(pageBtn);
    cache.musicPageBtns[0]?.click();

    for (const pageBtn of cache.compositionPageBtns) initPageBtn(pageBtn);
    cache.compositionPageBtns[0]?.click();
});
