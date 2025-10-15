const puppeteer = require('puppeteer')
const axeSource = require('axe-core').source

async function run(){
  const url = process.argv[2] || 'http://127.0.0.1:3000'
  console.log('Launching headless browser...')
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  console.log('Navigating to', url)
  await page.goto(url, { waitUntil: 'networkidle2' })
  // inject axe
  await page.evaluate(axeSource)
  console.log('Running axe-core ...')
  const results = await page.evaluate(async ()=>{
    return await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa'] } })
  })
  await browser.close()
  if(results.violations && results.violations.length>0){
    console.log('Accessibility violations found: ' + results.violations.length)
    for(const v of results.violations){
      console.log('\nRULE: ' + v.id + ' (' + v.impact + ')')
      console.log('Description: ' + v.description)
      console.log('Help: ' + v.help + '\n')
      for(const node of v.nodes){
        console.log('  Selector: ' + node.target.join(', '))
        console.log('  Failure Summary: ' + node.failureSummary)
      }
    }
    process.exitCode = 2
  } else {
    console.log('No accessibility violations (wcag2a/wcag2aa)')
  }
}

run().catch(err=>{ console.error(err); process.exit(1) })
