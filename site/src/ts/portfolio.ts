// ##################################################################### //
// ############################ HELPER FUNCS ########################### //
// ##################################################################### //

/** Cache of elems manipulated by app */
type ElemCache = {
    tabBtns: NodeListOf<HTMLAnchorElement>;
    sections: {
        reels: HTMLElement;
        projects: HTMLElement;
        music: HTMLElement;
        compositions: HTMLElement;
    };
};

/**
 * A decorated function.
 * One global {@link ElemCache} object is initialized in the decorator.
 * Calling the resulting function returns the same object every time.
 */
export const GetElemCache: () => ElemCache = (() => {
    let cache: ElemCache = {
        tabBtns: document.querySelectorAll("#tabs > .tabs > ul > li > a"),
        sections: {
            reels: document.querySelector("#reels"),
            projects: document.querySelector("#projects"),
            music: document.querySelector("#music"),
            compositions: document.querySelector("#compositions"),
        },
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

// ##################################################################### //
// ################################ MAIN ############################### //
// ##################################################################### //

document.addEventListener("DOMContentLoaded", () => {
    let cache = GetElemCache();
    for (const tab of cache.tabBtns) initTabBtn(tab);
    cache.tabBtns[0].click();
});
