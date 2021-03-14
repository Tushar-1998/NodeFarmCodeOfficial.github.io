const { profileEnd } = require('console');
const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
/************ */
/*FILES*/

/*blocking Code execution.
// This is so called as the synchronous way.
const textIn = fs.readFileSync('./txt/input.txt','utf-8');
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\ncreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log('Fie Writen!'); */

// non-blocking code 
// This is a so called the asynchronous way.
/*fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if (err) return console.log('ERROR! ');

    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            console.log(data3);

            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err, data) => {
                 console.log('your file has been written');
            })
        });
    });
});
console.log('Will read File!');*/


/************ */
/*SERVER*/
const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
  );
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);// synchronous way for the simple web api.

const slugs = dataObj.map(el=> slugify(el.productName, { lower: true }));
console.log(slugs);

//console.log(slugify('Fresh Avocados',{ lower: true }));


const server = http.createServer((req, res) => { 
    const { query, pathname } = url.parse(req.url, true);
    
    //overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }
    // product page 
    else if (pathname === '/product') {
    res.writeHead(200, {'content-type': 'text/html'});
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    }// This is a simple routing 
    else if (pathname === '/api') { 
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
            res.writeHead(200, {'content-type': 'application/json'});
            res.end(data);//This is a API part sinple web API 
        });        
    }
    //Not Found
    else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'My-own-header' : 'Hello-world'
        });
        res.end('<h1>page not found!</h1>');
    }
});
server.listen(8000, '127.0.0.1', () => {
     console.log('Listening to requests on port 8000');
});

