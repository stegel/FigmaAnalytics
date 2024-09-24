require('dotenv').config();
const axios = require('axios');

const options = {
    headers : {'X-Figma-Token': process.env.FIGMA_API_TOKEN}
};

let components;

function getFile(filekey) {
    return axios.get(`https://api.figma.com/v1/files/${filekey}`, options);
}

function getLayers(pages) {
    let layerCount = 0;
    pages.forEach(page => {
        
        // for each page step through the children and count the layers
        page.children.forEach(child => {

            layerCount = layerCount + countLayers(child);
        });
    });
    console.log(`All done ${layerCount}`);
}

function countLayers(object) {
    let layerCount = 0;
    let instanceCount = 0;
    if(object.children === undefined) {
        layerCount++;
    }
    else if (object.type === "INSTANCE") {
        checkIfFromLibrary(object);
    }
    else {
        object.children.forEach(child => {
            if(child.type === "FRAME" || child.type === "GROUP" || child.type === "SECTION") {
                layerCount = layerCount + countLayers(child)
            } else {
                layerCount++;
            }
        });
    }
    console.log(`Counting ${object.type} layers: ${layerCount}`)
    return layerCount;
}

function checkIfFromLibrary(instance) {
    // console.log(instance.componentId);
    const componentKey = components[instance.componentId].key;

    axios.get(`https://api.figma.com/v1/components/5`, options).then(res => {
        console.log(res.data);
    });

   
    
}

getFile('MKIecLz7tDzZ5F0JIwslxj').then(result => {
    const document = result.data.document;
    components = result.data.components;
    // console.log(components);
    getLayers(document.children);
})





