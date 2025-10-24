/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require('puppeteer')
const axeSource = require('axe-core').source
const fs = require('fs')

async function run(){
  const url = process.argv[2] || 'http://127.0.0.1:3000'
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  console.log('Navigating to', url)
  await page.goto(url, { waitUntil: 'networkidle2' })

  // Open the Playground by clicking the stepper button labelled '3'
  try{
    await page.evaluate(()=>{ const btns = Array.from(document.querySelectorAll('button[aria-label]')); const btn = btns.find(b=>/Ir al paso 3/.test(b.getAttribute('aria-label')||'')); if(btn) btn.click() })
  if(typeof page.waitForTimeout === 'function') await page.waitForTimeout(400)
  else await new Promise(r=>setTimeout(r,400))
  }catch(e){ console.warn('Could not open Playground stepper', e) }

  // perform some keyboard navigation to exercise focus order
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  if(typeof page.waitForTimeout === 'function') await page.waitForTimeout(200)
  else await new Promise(r=>setTimeout(r,200))

  // inject axe and run
  await page.evaluate(axeSource)
  const results = await page.evaluate(async ()=>{ return await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa'] } }) })

  // write report
  fs.writeFileSync('./axe-report.json', JSON.stringify(results, null, 2))

  if(results.violations && results.violations.length>0){
    console.log('Violations found:', results.violations.length)
    for(const v of results.violations){
      console.log('\nRULE:', v.id, v.impact)
      console.log('Help:', v.help)
      for(const node of v.nodes){
        console.log(' Selector:', node.target.join(', '))
      }
    }
  } else {
    console.log('No violations found (wcag2a/wcag2aa).')
  }

  await browser.close()
}

run().catch(err=>{ console.error(err); process.exit(1) })
