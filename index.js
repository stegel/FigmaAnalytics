// The goal is to match the component key/set key from the design file to the same key in the library
// TODO: consider how to use the depth param to quickly get file meta, before going and getting all the node tree. specifically updated_at
// TODO: consider how to use webhooks to trigger assessments on files
// TODO: receive a webhook in a queue and determine that all those files should be assessed on "Friyay"
// TODO: also consider what happens after a library publsihed event
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
// const { FigmaCalculator } = require('figma-calculations');

const filekey='MKIecLz7tDzZ5F0JIwslxj';
const librarykey='eB8K8rmfYgbAGaQh2Q1VZ9';

const options = {
    headers : {'X-Figma-Token': process.env.FIGMA_API_TOKEN}
};

axios.get(`https://api.figma.com/v1/files/${filekey}`, options
    ).then((result) => {
    const document = result.data.document;
    // get layers on page 1
    const page = document.children[0];
    
    fs.writeFile('sampleData/file.json', JSON.stringify(document), err => {
        if (err) {
            throw error
        }

        console.log('JSON data is saved');
    const instances = page.children.filter((layer) => {
        if(layer.type === "INSTANCE") {
            return true;
        }
    });

    console.log(`There are ${instances.length} component instances in this file`);
    instances.forEach((instance) => {
        console.log(`--- ${instance.name} ---`);
        console.log(instance.componentProperties.Variant);
        console.log('--------\n ', instance);
    });

    
    });
    // // get all component sets from the library
    // axios.get(`https://api.figma.com/v1/files/${librarykey}/component_sets`, {
    //     headers : {'X-Figma-Token': process.env.FIGMA_API_TOKEN},
    // }).then((result) => {
    //     const components = result.data.meta.component_sets
    //     console.log(`There are ${components.length} components in this file`);
    //     // firstComponent = components[0];
    //     // console.log(firstComponent)

    //     const buttonComponents = components.filter(component => {
    //         if(component.name.indexOf("Button") > -1) {
    //             return true;
    //         }
    //     });

    //     buttonComponents.forEach((component, index) => {
            
    //         console.log(`NAME: ${component.name} || ID: ${component.node_id}`);
    //         console.log(component);
    //         console.log('------------------------------------------------');
    //     });
    //     // console.log(findButton);
    // });
    // get all components in a file
    axios.get(`https://api.figma.com/v1/files/${librarykey}/components`, {
        headers : {'X-Figma-Token': process.env.FIGMA_API_TOKEN},
    }).then((result) => {
        const components = result.data.meta.components;

        const nodeIdMap = components.map(component => {
            return {
                compName : component.name,
                nodeId : component.nodeId

            };
        });
        const componentData = JSON.stringify(nodeIdMap);
        fs.writeFile('components.json', componentData, err => {
            if (err) {
                throw error
            }

            console.log('JSON data is saved');
        });
        // console.log(`There are ${components.length} components in this file`);
        // // firstComponent = components[0];
        // // console.log(firstComponent)

        // const buttonComponents = components.filter(component => {
        //     if(component.name.indexOf("Button") > -1) {
        //         return true;
        //     }
        // });

        // buttonComponents.forEach((component, index) => {
            
        //     console.log(`NAME: ${component.name} || ID: ${component.node_id}`);
        //     console.log(component);
        //     console.log('------------------------------------------------');
        // });
        // console.log(findButton);
    });
});



