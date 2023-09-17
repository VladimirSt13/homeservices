// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

const func = async () => {
  const blogItems = document.querySelector(".blog__items");
  const loadMore = document.querySelector(".blog__view-more");
  let startItem = 0;
  const numItemsToShow = 1;
  let data;

  const loadBlogItems = async () => {
    try {
      const response = await fetch("files/blog.json", {
        method: "GET",
      });
      return await response.json();
    } catch (error) {
      alert("Error");
    }
  };

  const formatData = ({ data, startItem, numItemsToShow }) => {
    const { items } = data;
    return items
      .slice(startItem, startItem + numItemsToShow)
      .map((item) => buildBlogItem(item))
      .join("");
  };

  const buildBlogItem = (item) => {
    return `
   <article data-id="${item.id}" class="blog__item item-blog">

      ${
        item.image
          ? `<a href="${item.url} target="_blank" class="item-blog__image-ibg"><img src="${item.image}" alt="${item.title}" /></a>`
          : ""
      }
      
      <div class="item-blog__body">
        <div class="item-blog__date">${item.data}</div>

        <h4 class="item-blog__title">
          <a href="${item.url}" class="item-blog__link-title">${item.title}</a>
        </h4>

        ${
          item.description
            ? `<div class="item-blog__text text">
                  <p>
                      ${item.description.length > 150 ? item.description.slice(0, 150) + "..." : item.description}
                      </p>
               </div>`
            : ""
        }
      </div >

      ${
        item.tags && Object.keys(item.tags).length > 0
          ? `
            <div class="item-blog__tags">
              ${Object.entries(item.tags)
                .map(([key, value]) => {
                  return `<a href="${value}" class="item-blog__tag">${key}</a>`;
                })
                .join("")}                       
            </div>
          `
          : ``
      }
  </article>
  `;
  };

  const render = (element, data) => {
    element.insertAdjacentHTML("beforeend", data);
  };

  const handleLoadMore = (e) => {
    e.preventDefault();
    startItem += numItemsToShow;
    render(blogItems, formatData({ data, startItem, numItemsToShow }));
    if (data.items.length <= startItem + numItemsToShow) {
      loadMore.disabled = true;
    }
  };

  if (blogItems) {
    data = await loadBlogItems();
    render(blogItems, formatData({ data, startItem, numItemsToShow }));
  }

  loadMore && loadMore.addEventListener("click", handleLoadMore);
};

func();

class Accordion {
  constructor(el, allEls) {
    // Store the <details> element
    this.el = el;
    this.allEls = allEls;
    // Store the <summary> element
    this.summary = el.querySelector(".spollers-questions__title");
    // Store the <div class="content"> element
    this.content = el.querySelector(".spollers-questions__body");

    // Store the animation object (so we can cancel it if needed)
    this.animation = null;
    // Store if the element is closing
    this.isClosing = false;
    // Store if the element is expanding
    this.isExpanding = false;
    // Detect user clicks on the summary element
    this.summary.addEventListener("click", (e) => this.onClick(e));
  }

  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault();
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = "hidden";
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.el.open) {
      this.open();
      // Check if the element is being openned or is already open
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
    this.allEls.forEach((el) => {
      if (el !== this.el) {
        el.open = false;
      }
    });
  }

  shrink() {
    // Set the element as "being closed"
    this.isClosing = true;

    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the height of the summary
    const endHeight = `${this.summary.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      {
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight],
      },
      {
        duration: 400,
        easing: "ease-out",
      }
    );

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false);
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => (this.isClosing = false);
  }

  open() {
    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.el.open = true;
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      {
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight],
      },
      {
        duration: 400,
        easing: "ease-out",
      }
    );
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true);
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  onAnimationFinish(open) {
    // Set the open attribute based on the parameter
    this.el.open = open;
    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = "";
  }
}

const pageSpollers = document.querySelectorAll(".spollers-questions__item");

pageSpollers.forEach((el, index, allEls) => {
  new Accordion(el, allEls);
});
