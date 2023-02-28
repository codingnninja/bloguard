import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";
import {auth, loadData, 
    createOrUpdateData,
    startPrivateAuth,
    endPrivateAuth,
    storeDataInHTML,
    getDataFromHTML } from "https://cdn.skypack.dev/@codingnninja/sapabase";

auth({
    username: 'codingnninja',
    reponame: 'bloguard',
    folder: 'user',
    Octokit,
    // status: 'private',
});

let page = 1;
const articles = await loadData(page);
storeDataInHTML(articles)
console.log(articles);

const display = (content) => {
    const resolvedSelector = selector ? `.${selector}` : '.content';
    const contentElement = document.querySelector(resolvedSelector); 
    contentElement.innerHTML = content;
}

const render = (content, position) => {
    const contentElement = document.querySelector('.content');

    if(position === 'replace') {
        contentElement.innerHTML = content;
        return true
    }
    const div = document.createElement('div');
    div.innerHTML = content;
    contentElement[position](div);

    return true
}

const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
}

const searchDataById = (allData, singleDataId) => {
    const data = [...allData];
    const reversedData = data.reverse();
    const searchTerm = singleDataId;
    let firstIndex = 0
    let lastIndex = allData.length - 1;
    let result = null;

    for(let index = 0; index < reversedData.length; index++ ) {
        const midpoint = Math.floor((lastIndex + firstIndex) / 2);
        const itemAtMidpoint = reversedData[midpoint] ? reversedData[midpoint] : {id: reversedData.length};
        
        if (searchTerm === itemAtMidpoint.id ) {
            result = itemAtMidpoint;
        }
        
        if ( itemAtMidpoint.id > searchTerm ) {
            lastIndex = midpoint - 1;
        }
        
        if ( itemAtMidpoint.id < searchTerm ) {
            firstIndex = midpoint + 1;
        }
    }
    return result;
}

const chooseColorAtRandom = () => {
    const colorClasses = ['bg-purple-600', 'bg-blue-500', 'bg-indigo-700', 'bg-rose-700', 'bg-teal-600', 'bg-green-600', 'bg-emerald-600']
    return colorClasses[Math.floor(Math.random() * colorClasses.length)]
}

const Articles = (articles) => {
    const articlesViews = articles.map( (article) => Article(article));
    return articlesViews.join('');
}

const Article = (article) => `
<div class="max-w-6xl mx-auto p-6 sm:px-6 h-full">
    <!-- Blog post -->
    <article class="article max-w-sm mx-auto md:max-w-none grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center">
        <div class="relative block group w-full">
            <div class="absolute inset-0 bg-gray-800 hidden md:block transform md:translate-y-2 md:translate-x-4 xl:translate-y-4 xl:translate-x-8 group-hover:translate-x-0 group-hover:translate-y-0 transition duration-700 ease-out pointer-events-none rounded-lg" aria-hidden="true"></div>
            <figure class="relative h-0 pb-[56.25%] md:pb-[75%] lg:pb-[56.25%] overflow-hidden transform md:-translate-y-2 xl:-translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition duration-700 ease-out rounded-lg">
                <img class="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition duration-700 ease-out rounded-lg" src="${article.cover_image ? article.cover_image : 'analy log.png'}" alt="Blog post">
            </figure>
        </div>
        <div class="relative block group w-full">
            <header>
                ${makeTags(article.tags)}
                <h2 class="text-2xl lg:text-3xl font-bold leading-tight mb-2 hover:text-gray-100 transition duration-150 ease-in-out md:w-full" onclick="displayArticle(${article.id})">
                    ${article.title}
                </h2>
            </header>
            <p class="text-lg text-gray-400 flex-grow">${article.description}</p>
            <footer class="flex items-center mt-4">
                <img class="rounded-full flex-shrink-0 mr-4" src="ayobami.jpg" width="40" height="40" alt="Author 04">
                <div>
                    <div class="font-medium text-gray-200 hover:text-gray-100 transition duration-150 ease-in-out" href="#0">Ayobami Ogundiran</div>
                    <span class="text-gray-700"> - </span>
                    <span class="text-gray-500">&#128337; ${formatDate(article.createdAt)}</span>
                </div>
            </footer>
        </div>
    </article>    
</div>
`;

const makeTags = (tags) => {
    let tagsContainer;
    const tagViews = tags.split(',').map((tag) => {
        return `
            <li class="m-1">
                <a class="inline-flex text-center text-gray-100 py-1 px-3 rounded-full hover:bg-purple-700 transition duration-150 ease-in-out ${chooseColorAtRandom()}" href="#0">${tag}</a>
            </li> `
    })
    tagsContainer = `
        <div class="mb-3">
            <ul class="flex flex-wrap text-xs font-medium -m-1">
                ${tagViews.join('')}
            </ul>
        </div>
    `
    return tagsContainer;
}

const Home = (articles) => Articles(articles);

render(Home(articles), 'replace');

const displayArticle = (articleId) => {
    const articles = getDataFromHTML()
    const article = searchDataById(articles, articleId);
    console.log(article)
    const singleArticle = `
        <article class="markdown-body bg-black article max-w-sm mx-auto md:max-w-none items-center" id="markdown-body">
            <button onclick="goBack()">Go back</button>
            <h1>${article.title}</h1>
            <span>&#128337; ${formatDate(article.createdAt)}</span> 
            <img src="${article.cover_image}" class="mt-3">
            <div class="text-gray-400 md:max-w-3xl p-5 ">${marked.parse(article.content)}</div>
        </article>`;
    render(singleArticle, 'replace');
}
window.displayArticle = displayArticle;

const insertTextarea = () => {
    document.getElementById("upload_widget").style.display = 'block';
    const textarea = `
        <div class="flex justify-center bg-white" id="textarea">
            <div class="mb-3 w-96 md:w-[900px] xl:w-[900px] md:h-[550px]">
                <label for="exampleFormControlTextarea1" class="form-label inline-block text-white"
                    >Write an article</label>
                <textarea
                    class="
                    form-control
                    block
                    w-full
                    h-[88%]
                    mb-1
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                    article-content
                    "
                    id="article-content"
                    rows="3"
                    placeholder="Your message">
---
title:
description:
tags:
cover_image:
---
            </textarea>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onclick="getForm()">
                Publish
            </button>
        </div>
    </div>
    
    `;
    document.querySelector('.write-article').innerHTML = textarea;
}
window.insertTextarea = insertTextarea;

// Function to parse metadata from a markdown file
const parseMarkdownMetadata = markdown => {
    // Regular expression to match metadata at the beginning of the file
    const metadataRegex = /^---([\s\S]*?)---/;
    const metadataMatch = markdown.match(metadataRegex);
    console.log(metadataMatch)
    // If there is no metadata, return an empty object
    if (!metadataMatch) {
      return {};
    }
  
    // Split the metadata into lines
    const metadataLines = metadataMatch[1].split("\n");
   console.log(metadataLines)
    // Use reduce to accumulate the metadata as an object
    const metadata = metadataLines.reduce((acc, line) => {
      // Split the line into key-value pairs
      const [key, ...value] = line.split(":").map(part => part.trim());
      console.log(key, value)
      // If the line is not empty add the key-value pair to the metadata object
      if(key) acc[key] = value[1] ? value.join(":") : value.join("");
      return acc;
    }, {});
  
    // Return the metadata object
    return metadata;
  };

const convertMardownToObject =(mardown) => {
    const metadataRegex = /^---([\s\S]*?)---/;
    const obj = parseMarkdownMetadata(mardown);
    const content = mardown.replace(metadataRegex, " ");
    obj.content = content;
    return obj;
}

const getForm = () => {
  const textarea = document.querySelector('.article-content');
//   const metadataRegex = /^---([\s\S]*?)---/;
//   const metadata = parseMarkdownMetadata(textarea.value);
//   const content = textarea.value.replace(metadataRegex, " ");
//  console.log(metadata) 

  const article = convertMardownToObject(textarea.value);

  const post = {
        title: article.title,
        slug: article.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        description: article.description,
        tags: article.tags,
        cover_image: article.cover_image,
        content: article.content.replace(/^\s*|\s*$/g,' ')
    }  
    createOrUpdatePost(post);
    insertTextarea();
}
window.getForm = getForm;

const createOrUpdatePost = async (data) => {
    //initiate authentication
    startPrivateAuth()

    const updatedData = await createOrUpdateData(data);
    render(Article(updatedData), 'prepend');
    
    //end authentication and switch back to public
    endPrivateAuth()
}
const goBack = () => {
    const currentPage = window.__data;
    render(Articles(currentPage), 'replace')
}
window.goBack = goBack;

const loadMore = async (counter) => {
    const singleArticleHTML = document.getElementById("markdown-body");
    const nextPageCounter = page + counter;
    const currentPage = window.__data;
    const nextPage = await loadData(nextPageCounter);
    const bothPages = [...currentPage, ...nextPage]
    window.__data = bothPages;
    
    if(singleArticleHTML) {
        render(Articles(bothPages), 'replace')
    }
    page = nextPageCounter;
    render(Articles(nextPage), 'append')
}
window.loadMore = loadMore;

