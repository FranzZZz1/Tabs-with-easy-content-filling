// ----------------- Tabs content -----------------
function tabsInit() {
    const contentTypes = {
        IMAGE: "IMG",
        IFRAME_DEFAULT: "IFRAME-DEF",
        IFRAME_YOUTUBE: "IFRAME-YT",
        TEXT: "TEXT",
        TITLE_LG: "TITLE-LG",
        TITLE_MD: "TITLE-MD",
        LIST: "LIST",
        EMPTY: "EMPTY",
    };
    const warningsTextContent = {
        EMPTY_TAB: "Без названия",
        EMPTY_TEXT: "Здесь пока ничего нет",
        WRONG_IFRAME_TEXT: "Неверный тип iframe, либо неправильно введен адрес",
    };

    const tabsSection =
        document.querySelector(data.tabsSectionClass || ".tabs__section") ||
        null;
    const tabsContainer =
        document.querySelector(data.tabsContainerClass || ".tabs__container") ||
        null;
    const tabsButtonsWrapper =
        document.querySelector(
            data.tabsNavWrapperClass || ".tabs__navigation-wrapper"
        ) || null;
    const tabsMain = document.querySelector(data.tabsClass || ".tabs") || null;
    const tabsButtons =
        document.querySelector(data.tabsButtonsClass || ".tabs__navigation") ||
        null;
    const tabsContent =
        document.querySelector(data.tabsContentClass || ".tabs__content") ||
        null;
    const tabsLine =
        document.querySelector(data.tabsLine || ".tabs__line") || null;

    function addClass(items, sampleClass) {
        if (sampleClass === null || sampleClass === undefined) return;

        if (!Array.isArray(items)) {
            items = [items];
        }

        items.forEach((item) => {
            if (item == null) return;
            item.classList.forEach((currentClass) => {
                const newClass = `${sampleClass}-${currentClass}`;
                item.classList.add(currentClass, newClass);
            });
        });
    }
    addClass(
        [
            tabsSection,
            tabsContainer,
            tabsButtonsWrapper,
            tabsMain,
            tabsButtons,
            tabsContent,
            tabsLine,
        ],
        data.general_class
    );

    if (!tabsButtons || !tabsContent) return;

    if (data.tabs.length !== data.content.length) {
        const difference = Math.abs(data.tabs.length - data.content.length);

        if (data.tabs.length > data.content.length) {
            for (let i = 0; i < difference; i++) {
                data.content.push([
                    `${contentTypes.EMPTY}: ${warningsTextContent.EMPTY_TEXT}`,
                ]);
            }
        } else {
            for (let i = 0; i < difference; i++) {
                data.tabs.push(warningsTextContent.EMPTY_TAB);
            }
        }
    }

    data.tabs.forEach((tabText, index) => {
        const tab = document.createElement("button");
        tab.setAttribute("type", "button");
        tab.className = `tabs__button`;
        tab.textContent = tabText;
        tab.dataset.tabsTitle = "";
        tabsButtons.appendChild(tab);

        const tabContent = document.createElement("div");
        tabContent.className = `tabs__body`;
        tabContent.dataset.tabsItem = "";

        addClass([tab, tabContent], data.general_class);

        if (index === 0) {
            tab.classList.add("_tab-active");
            tabContent.removeAttribute("hidden");
        } else {
            tabContent.setAttribute("hidden", "");
        }
        if (data.content[index].length === 0) {
            const emptyTab = createEmptyElement("Здесь пока ничего нет");
            tabContent.appendChild(emptyTab);
        } else {
            data.content[index].forEach((contentItem) => {
                if (Array.isArray(contentItem)) {
                    const nestedContentDiv =
                        createNestedContentDiv(contentItem);
                    tabContent.appendChild(nestedContentDiv);
                } else {
                    createContent(contentItem, tabContent);
                }
            });
        }
        tabsContent.appendChild(tabContent);
    });

    function createImageElement(src) {
        const imageContainer = document.createElement("div");
        imageContainer.className = `tabs__image-container`;
        const image = document.createElement("img");
        image.src = src;
        image.className = `tabs__img`;
        imageContainer.appendChild(image);

        addClass([imageContainer, image], data.general_class);

        return imageContainer;
    }

    function isYouTubeEmbedLink(link) {
        const embedLinkPattern = /^https:\/\/www\.youtube\.com\/embed\//;
        return embedLinkPattern.test(link);
    }

    function isYouTubeVideoLink(link) {
        const youtubeVideoLinkPattern =
            /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/;

        return youtubeVideoLinkPattern.test(link);
    }

    function convertYouTubeLink(link) {
        const videoId = link.split("/").pop();
        return `https://www.youtube.com/embed/${videoId}`;
    }

    function wrongIframe(text) {
        const wrongMessage = document.createElement("p");
        wrongMessage.className = `tabs__wrong-iframe`;
        wrongMessage.textContent = text;

        addClass(wrongMessage, data.general_class);
        return wrongMessage;
    }

    function isLinkValidAndWorking(url) {
        const urlPattern = /^(http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/;

        return urlPattern.test(url);
    }

    function createIframeElement(src, type) {
        const iframeContainer = document.createElement("div");
        iframeContainer.className = `tabs__iframe-container`;
        addClass(iframeContainer, data.general_class);
        const iframe = document.createElement("iframe");

        if (!isLinkValidAndWorking(src)) {
            return wrongIframe(warningsTextContent.WRONG_IFRAME_TEXT);
        }

        iframe.width = 560;
        iframe.height = 315;
        if (type === contentTypes.IFRAME_YOUTUBE && isYouTubeVideoLink(src)) {
            if (!isYouTubeEmbedLink(src)) {
                src = convertYouTubeLink(src);
            }
            iframe.src = src;
            iframe.setAttribute("title", "YouTube video player");
            iframe.frameBorder = 0;
            iframe.setAttribute("frameborder", 0);
            iframe.setAttribute(
                "allow",
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            );
            iframe.setAttribute("allowfullscreen", "");
        } else if (
            type !== contentTypes.IFRAME_YOUTUBE &&
            !isYouTubeVideoLink(src)
        ) {
            iframe.src = src;
            iframe.frameBorder = 0;
        }

        iframeContainer.appendChild(iframe);

        return iframeContainer && iframe.src !== ""
            ? iframeContainer
            : wrongIframe(warningsTextContent.WRONG_IFRAME_TEXT);
    }

    function createTextElement(text) {
        const tabText = document.createElement("p");
        tabText.className = `tabs__text`;
        tabText.textContent = text;

        addClass(tabText, data.general_class);

        return tabText;
    }

    function createTitleElement(title, type) {
        const tabTitle = document.createElement("h3");
        tabTitle.className = `tabs__title ${
            type === contentTypes.TITLE_MD
                ? "tabs__title--md"
                : "tabs__title--lg"
        }`;
        tabTitle.textContent = title;

        addClass(tabTitle, data.general_class);

        return tabTitle;
    }

    function createListElement(items) {
        const listItems = items.split(";;").map((item) => item.trim());

        const list = document.createElement("ul");
        list.className = `tabs__list`;
        addClass(list, data.general_class);

        listItems.forEach((item) => {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            listItem.className = `tabs__item`;
            list.appendChild(listItem);

            addClass(listItem, data.general_class);
        });
        return list;
    }

    function createEmptyElement(text) {
        const emptyTab = document.createElement("p");
        emptyTab.className = `tabs__empty`;
        emptyTab.textContent = text;

        addClass(emptyTab, data.general_class);
        return emptyTab;
    }

    function createNestedContentDiv(contentArray) {
        if (contentArray.length === 0) {
            return createEmptyElement("Здесь пока ничего нет");
        }

        const contentDiv = document.createElement("div");
        contentDiv.className = `tabs__flex`;

        addClass(contentDiv, data.general_class);

        contentArray.forEach((contentItem) => {
            if (Array.isArray(contentItem)) {
                const textContainer = document.createElement("div");
                textContainer.className = `tabs__text-container`;

                addClass(textContainer, data.general_class);
                contentItem.forEach((item) => {
                    createContent(item, textContainer);
                });
                contentDiv.appendChild(textContainer);
            } else {
                createContent(contentItem, contentDiv);
            }
        });
        return contentDiv;
    }

    function createContent(item, parent) {
        const contentType = item.slice(0, item.indexOf(":")).trim();
        const contentValue = item.slice(item.indexOf(":") + 1).trim();

        const contentCreators = {
            [contentTypes.IMAGE]: createImageElement,
            [contentTypes.TEXT]: createTextElement,
            [contentTypes.TITLE_LG]: createTitleElement,
            [contentTypes.TITLE_MD]: createTitleElement,
            [contentTypes.IFRAME_YOUTUBE]: createIframeElement,
            [contentTypes.IFRAME_DEFAULT]: createIframeElement,
            [contentTypes.LIST]: createListElement,
            [contentTypes.EMPTY]: createEmptyElement,
        };

        if (contentType in contentCreators) {
            const contentItem = contentCreators[contentType](
                contentValue,
                contentType
            );
            if (contentItem) {
                parent.appendChild(contentItem);
            }
        }
    }

    // ----------------- Tabs functions -----------------
    function tabs() {
        const tabs = document.querySelectorAll("[data-tabs]");
        if (tabs.length > 0) {
            tabs.forEach((tabsBlock, index) => {
                tabsBlock.classList.add("_tab-init");
                tabsBlock.setAttribute("data-tabs-index", index);
                tabsBlock.addEventListener("click", setTabsAction);
                initTabs(tabsBlock);
            });
        }
        // Работа с контентом
        function initTabs(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;

            if (tabsContent.length) {
                tabsContent = Array.from(tabsContent).filter(
                    (item) => item.closest("[data-tabs]") === tabsBlock
                );
                tabsTitles = Array.from(tabsTitles).filter(
                    (item) => item.closest("[data-tabs]") === tabsBlock
                );
                tabsContent.forEach((tabsContentItem, index) => {
                    tabsTitles[index].setAttribute("data-tabs-title", "");
                    tabsContentItem.setAttribute("data-tabs-item", "");
                    tabsContentItem.hidden =
                        !tabsTitles[index].classList.contains("_tab-active");
                });
            }
            if (tabsLine && tabsTitles[0]) {
                tabsLine.style.width = tabsTitles[0].offsetWidth + "px";
                tabsLine.style.left = tabsTitles[0].offsetLeft + "px";
            }
        }
        function setTabsStatus(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            if (tabsContent.length > 0) {
                tabsContent = Array.from(tabsContent).filter(
                    (item) => item.closest("[data-tabs]") === tabsBlock
                );
                tabsTitles = Array.from(tabsTitles).filter(
                    (item) => item.closest("[data-tabs]") === tabsBlock
                );
                tabsContent.forEach((tabsContentItem, index) => {
                    if (tabsTitles[index].classList.contains("_tab-active")) {
                        tabsContentItem.hidden = false;
                    } else {
                        tabsContentItem.hidden = true;
                    }
                });
            }
        }
        function setTabsAction(e) {
            const el = e.target;
            if (el.closest("[data-tabs-title]")) {
                const tabTitle = el.closest("[data-tabs-title]");
                const tabsBlock = tabTitle.closest("[data-tabs]");
                if (!tabTitle.classList.contains("_tab-active")) {
                    let tabActiveTitle = tabsBlock.querySelectorAll(
                        "[data-tabs-title]._tab-active"
                    );
                    tabActiveTitle.length
                        ? (tabActiveTitle = Array.from(tabActiveTitle).filter(
                              (item) =>
                                  item.closest("[data-tabs]") === tabsBlock
                          ))
                        : null;
                    tabActiveTitle.length
                        ? tabActiveTitle[0].classList.remove("_tab-active")
                        : null;
                    tabTitle.classList.add("_tab-active");
                    setTabsStatus(tabsBlock);
                }
                e.preventDefault();

                if (tabsLine) {
                    tabsLine.style.width = el.offsetWidth + "px";
                    tabsLine.style.left = el.offsetLeft + "px";
                }
            }
        }
    }
    tabs();
}
window.addEventListener("load", tabsInit);
