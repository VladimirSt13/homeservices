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
